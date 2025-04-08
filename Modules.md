# THREE Modules

export

```js
// test.js
const somethingToExport = {
  name: 'test',
}
export { somethingToExport }

// script.js
import * as test from './test'
console.log(test.somethingToExport)
// or
import { somethingToExport } from './test'
console.log(somethingToExport)
```

```js
// test.js
const somethingToExport = {
  name: 'test',
}
export default somethingToExport

// script.js
import somethingToExport from './test.js'
console.log(somethingToExport)
```

---

## Experience Class

首先创建一个`Experience`类，将所有与 WebGL 相关的内容全部放在里面。大的类都在这儿实例化，并且设置为单例类。只有在第一次实例化时，会创建一个实例，若已经创建过实例对象，则会返回那个实例对象。类似于`vuex`一个全局变量

```js
import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Debug from './Utils/Debug.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'

let instance = null
// 单例模式，确保只有一个Experience实例存在
export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance
    }
    instance = this

    // 添加为全局变量，方便控制台查看，可加可不加
    window.experience = this

    // Options
    this.canvas = canvas

    // setup
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // EventEmitter的方法
    // 监听窗口大小变化事件，调用resize方法
    this.sizes.on('resize', () => {
      this.resize()
    })
    // 监听时间变化事件，调用update方法
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    this.camera.update()
    this.world.update()
    // render 放在最后，确保所有物体都渲染完成
    this.renderer.update()
  }

  destroy() {
    // EventEmitter的方法，移除事件监听
    this.sizes.off('resize')
    this.time.off('tick')

    // 遍历场景中的所有物体
    this.scene.traverse(child => {
      // 检查物体是否是Mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // 遍历网格模型的材质，调用dispose方法
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }

      this.camera.controls.dispose()
      this.renderer.instance.dispose()
      if (this.debug.active) this.debug.ui.destroy()
    })
  }
}
```

## Utils

将 THREEjs 项目通过 class 和 modules 分割为许多小模块方便维护。

### Size Class

size 类，记录窗口大小并且监听`resize`事件。

通知其他类 size 发生了变化[EventEmitter](https://gist.github.com/brunosimon/120acda915e6629e3a4d497935b16bdf)，首先继承`class Sizes extends EventEmitter`，事件触发时，调用`this.trigger('event')`，然后再捕获变化 `this.sizes.on(()=>{...})`

```js
import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
  constructor() {
    super()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      // 使用事件触发器来通知其他模块尺寸发生了变化
      this.trigger('resize')
    })
  }
}
```

### Time Class

time 类，记录时间相关的参数，并触发`window.requestAnimationFrame`渲染页面

```js
import EventEmitter from './EventEmitter'
export default class Time extends EventEmitter {
  constructor() {
    super()

    this.start = Date.now() // 记录开始时间
    this.current = this.start // 记录当前时间
    this.elapsed = 0 // 记录从开始到现在的时间
    this.delta = 16 // 每帧大约时间间隔，默认值为16ms（60fps）

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    // 触发事件，通知其他模块时间发生了变化
    this.trigger('tick')

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
```

### Resources Class

统一加载资源，方便管理。在这个类中实例化所有需要的`loader`，以及加载`asset`。

在所有的资源都加载完成之后，告诉其他类资源已经加载完毕

首先创建一个`sources.js`文件，存放资源的路径

```js
// sources.js
export default [
  {
    name: 'environmentMapTexture',
    type: 'cubeTexture',
    path: [
      'textures/environmentMap/px.jpg',
      'textures/environmentMap/nx.jpg',
      'textures/environmentMap/py.jpg',
      'textures/environmentMap/ny.jpg',
      'textures/environmentMap/pz.jpg',
      'textures/environmentMap/nz.jpg',
    ],
  },
]
```

在 Resources Class 中，有三个属性

- `items` 已加载的资源 `{}`
- `toLoad` 需要加载的资源数量 `this.sources.length`
- `loaded` 已加载的资源数量 `0`

如果`toLoad == loaded`表明所有资源都加载完毕了

```js
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter'

export default class Resources extends EventEmitter {
  constructor(sources) {
    super()
    this.sources = sources

    this.items = {}
    this.toLoad = this.sources.length
    this.loaded = 0

    this.setLoaders()
    this.startLoading()
  }
  // 加载需要的loader
  setLoaders() {
    this.loaders = {}
    this.loaders.gltfLoader = new GLTFLoader()
    this.loaders.textureLoader = new THREE.TextureLoader()
    this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
  }
  // 通过loader加载资源
  startLoading() {
    for (const source of this.sources) {
      switch (source.type) {
        case 'gltfModel':
          this.loaders.gltfLoader.load(source.path, file => {
            this.sourceLoaded(source, file)
          })
          break
        case 'texture':
          this.loaders.textureLoader.load(source.path, file => {
            this.sourceLoaded(source, file)
          })
          break
        case 'cubeTexture':
          this.loaders.cubeTextureLoader.load(source.path, file => {
            this.sourceLoaded(source, file)
          })
          break
      }
    }
  }
  // 资源加载后，存储到items中，并判断是否全部加载完成
  sourceLoaded(source, file) {
    this.items[source.name] = file
    this.loaded++
    if (this.loaded === this.toLoad) {
      this.trigger('ready')
    }
  }
}
```

### Debug Class

lil-gui设置debug。

在url后面加上`#debug`会打开调试窗口，通过判断 `window.location.hash === '#debug'`，如果是才创建`G】gui`的实例

```js
import GUI from 'lil-gui'

export default class Debug {
  constructor() {
    // 如果包含debug，则创建一个GUI实例
    this.active = window.location.hash === '#debug'
    if (this.active) {
      this.ui = new GUI()
    }
  }
}
```

并在 `Experience Class`中实例化 `this.debug = new Debug()`

在实例化的类中添加debug object，以 `Environment Class`为例。在`constructor()`中创建environment分类，`setEnvironmentMap()`方法中添加debug选项。在Environment Class可看

```js
export default class Environment {
  constructor() {
    // ...
    this.debug = this.experience.debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment')
    }
  }
  // ...
  setEnvironmentMap() {
    // ...
    this.environmentMap.updateMaterials = () => { ... }
    this.environmentMap.updateMaterials()
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials)
    }
  }
}
```

### EventEmitter Class

事件监听类，在需要监听的class直接继承

- `trigger()`告诉其他模块触发事件
- `on()` 接收事件触发，执行操作
- `off()` 移除事件监听

```js
export default class Sizes extends EventEmitter {
  // 使用事件触发器来通知其他模块尺寸发生了变化
  this.trigger('resize')
}

// 监听窗口大小变化事件，调用resize方法
this.sizes.on('resize', () => {
  this.resize()
})

// 移除事件监听
this.sizes.off('resize')
```

[EventEmitter](https://gist.github.com/brunosimon/120acda915e6629e3a4d497935b16bdf) 

```js
export default class EventEmitter {
  constructor() {
    this.callbacks = {}
    this.callbacks.base = {}
  }

  on(_names, callback) {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong names')
      return false
    }

    if (typeof callback === 'undefined') {
      console.warn('wrong callback')
      return false
    }

    // Resolve names
    const names = this.resolveNames(_names)

    // Each name
    names.forEach(_name => {
      // Resolve name
      const name = this.resolveName(_name)

      // Create namespace if not exist
      if (!(this.callbacks[name.namespace] instanceof Object))
        this.callbacks[name.namespace] = {}

      // Create callback if not exist
      if (!(this.callbacks[name.namespace][name.value] instanceof Array))
        this.callbacks[name.namespace][name.value] = []

      // Add callback
      this.callbacks[name.namespace][name.value].push(callback)
    })

    return this
  }

  off(_names) {
    // Errors
    if (typeof _names === 'undefined' || _names === '') {
      console.warn('wrong name')
      return false
    }

    // Resolve names
    const names = this.resolveNames(_names)

    // Each name
    names.forEach(_name => {
      // Resolve name
      const name = this.resolveName(_name)

      // Remove namespace
      if (name.namespace !== 'base' && name.value === '') {
        delete this.callbacks[name.namespace]
      }

      // Remove specific callback in namespace
      else {
        // Default
        if (name.namespace === 'base') {
          // Try to remove from each namespace
          for (const namespace in this.callbacks) {
            if (
              this.callbacks[namespace] instanceof Object &&
              this.callbacks[namespace][name.value] instanceof Array
            ) {
              delete this.callbacks[namespace][name.value]

              // Remove namespace if empty
              if (Object.keys(this.callbacks[namespace]).length === 0)
                delete this.callbacks[namespace]
            }
          }
        }

        // Specified namespace
        else if (
          this.callbacks[name.namespace] instanceof Object &&
          this.callbacks[name.namespace][name.value] instanceof Array
        ) {
          delete this.callbacks[name.namespace][name.value]

          // Remove namespace if empty
          if (Object.keys(this.callbacks[name.namespace]).length === 0)
            delete this.callbacks[name.namespace]
        }
      }
    })

    return this
  }

  trigger(_name, _args) {
    // Errors
    if (typeof _name === 'undefined' || _name === '') {
      console.warn('wrong name')
      return false
    }

    let finalResult = null
    let result = null

    // Default args
    const args = !(_args instanceof Array) ? [] : _args

    // Resolve names (should on have one event)
    let name = this.resolveNames(_name)

    // Resolve name
    name = this.resolveName(name[0])

    // Default namespace
    if (name.namespace === 'base') {
      // Try to find callback in each namespace
      for (const namespace in this.callbacks) {
        if (
          this.callbacks[namespace] instanceof Object &&
          this.callbacks[namespace][name.value] instanceof Array
        ) {
          this.callbacks[namespace][name.value].forEach(function (callback) {
            result = callback.apply(this, args)

            if (typeof finalResult === 'undefined') {
              finalResult = result
            }
          })
        }
      }
    }

    // Specified namespace
    else if (this.callbacks[name.namespace] instanceof Object) {
      if (name.value === '') {
        console.warn('wrong name')
        return this
      }

      this.callbacks[name.namespace][name.value].forEach(function (callback) {
        result = callback.apply(this, args)

        if (typeof finalResult === 'undefined') finalResult = result
      })
    }

    return finalResult
  }

  resolveNames(_names) {
    let names = _names
    names = names.replace(/[^a-zA-Z0-9 ,/.]/g, '')
    names = names.replace(/[,/]+/g, ' ')
    names = names.split(' ')

    return names
  }

  resolveName(name) {
    const newName = {}
    const parts = name.split('.')

    newName.original = name
    newName.value = parts[0]
    newName.namespace = 'base' // Base namespace

    // Specified namespace
    if (parts.length > 1 && parts[1] !== '') {
      newName.namespace = parts[1]
    }

    return newName
  }
}
```

## Three

### Camera Class

创建 camera 和轨道控制时，需要提供 size 和 canvas，再 `camera class`无法直接访问这些属性。可以通过下面3种方法

- 创建全局变量

  ```js
  // Experience Class
  window.experience = this
  // Camera Class
  constructor() {
    this.experience = window.experience
  }
  ```

- 参数传递

  ```js
  // Experience Class
  this.camera = new Camera(this)
  // Camera Class
  constructor(experience) {
    this.experience = experience
  }
  ```

- 使用单例(singleton)

  单例类只有在第一次实例化时，会创建一个实例，若已经创建过实例对象，则会返回那个实例对象。

  ```js
  // Experience Class
  let instance = null
  // 单例模式，确保只有一个Experience实例存在
  export default class Experience {
    constructor(canvas) {
      if (instance) {
        return instance
      }
      instance = this
  	// ...
      this.camera = new Camera()
    }
  }
  
  // Camera Class
  import Experience from './Experience'
  export default class Camera {
    constructor() {
      // Base camera
      this.experience = new Experience()
    }
  }
  ```

创建 Camera Class，不单独监听resize事件，而是通过Experience类中的`sizes.on('resize')`来统一监听，防止在每个类中都调用，只监听一次

```js
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Experience from './Experience'
export default class Camera {
  constructor() {
    this.experience = new Experience()
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.canvas = this.experience.canvas
    this.setInstance()
    this.setOrbitControls()
  }

  setInstance() {
    this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 100)
    this.instance.position.set(6, 4, 8)
    this.scene.add(this.instance)
  }
  setOrbitControls() {
    this.controls = new OrbitControls(this.instance, this.canvas)
    this.controls.enableDamping = true
  }
  // resize 事件触发时调用，更新相机的宽高比
  resize() {
    this.instance.aspect = this.sizes.width / this.sizes.height
    this.instance.updateProjectionMatrix()
  }
  // tick 事件触发时调用，更新相机的控制器
  update() {
    this.controls.update()
  }
}
```

### Renderer Class

```js
import * as THREE from 'three'
import Experience from './Experience'
export default class Renderer {
  constructor() {
    this.experience = new Experience()
    this.canvas = this.experience.canvas
    this.sizes = this.experience.sizes
    this.scene = this.experience.scene
    this.camera = this.experience.camera
    this.setInstance()
  }
  setInstance() {
    this.instance = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
    })
    this.instance.toneMapping = THREE.CineonToneMapping
    this.instance.toneMappingExposure = 1.75
    this.instance.shadowMap.enabled = true
    this.instance.shadowMap.type = THREE.PCFSoftShadowMap
    this.instance.setClearColor('#211d20')
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  resize() {
    this.instance.setSize(this.sizes.width, this.sizes.height)
    this.instance.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }
  update() {
    this.instance.render(this.scene, this.camera.instance)
  }
}
```

## Wolrd

### Wolrd Class

Wolrd 类包含了，需要加载的lights，models，meshes等等都在这里实例化。自身在 `Experience Class`中实例化

```js
import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // 监听资源加载完成事件
    this.resources.on('ready', () => {
      this.floor = new Floor()
      this.fox = new Fox()
      // environmentMap 需要在最后执行，否则之后的还没加入sence导致添加不上
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
```

### Environment Class

创建环境贴图，添加debug选项

```js
import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources
    this.debug = this.experience.debug

    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('environment')
    }

    this.setSunlight()
    this.setEnvironmentMap()
  }

  setSunlight() {
    this.sunlight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunlight.castShadow = true
    this.sunlight.shadow.camera.far = 15
    this.sunlight.shadow.mapSize.set(1024, 1024)
    this.sunlight.shadow.normalBias = 0.05
    this.sunlight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunlight)
    if (this.debug.active) {
      this.debugFolder
        .add(this.sunlight, 'intensity')
        .name('sunlightIntensity')
        .min(0)
        .max(10)
        .step(0.001)
        
      this.debugFolder
        .add(this.sunlight.position, 'x')
        .min(-5)
        .max(5)
        .step(0.001)
    }
  }
  setEnvironmentMap() {
    this.environmentMap = {}
    this.environmentMap.intensity = 0.4
    this.environmentMap.texture = this.resources.items.environmentMapTexture
    this.environmentMap.texture.colorSpace = THREE.SRGBColorSpace
    // this.scene.background = this.environmentMap.texture
    this.scene.environment = this.environmentMap.texture
    // 给mesh添加环境贴图
    this.environmentMap.updateMaterials = () => {
      this.scene.traverse(child => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshStandardMaterial
        ) {
          child.material.envMap = this.environmentMap.texture
          child.material.envMapIntensity = this.environmentMap.intensity
          child.material.needsUpdate = true
        }
      })
    }
    this.environmentMap.updateMaterials()
    if (this.debug.active) {
      this.debugFolder
        .add(this.environmentMap, 'intensity')
        .min(0)
        .max(4)
        .step(0.001)
        .onChange(this.environmentMap.updateMaterials)
    }
  }
}
```

### Floor Class

地板，一个`CircleGeometry`,用于接受阴影

```js
import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Floor {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    this.setGeometry()
    this.setTexture()
    this.setMaterial()
    this.setMesh()
  }

  setGeometry() {
    this.geometry = new THREE.CircleGeometry(5, 64)
  }
  setTexture() {
    this.texture = {}
    this.texture.color = this.resources.items.grassColorTexture
    this.texture.color.repeat.set(1.5, 1.5)
    this.texture.color.colorSpace = THREE.SRGBColorSpace
    this.texture.color.wrapS = THREE.RepeatWrapping
    this.texture.color.wrapT = THREE.RepeatWrapping

    this.texture.normal = this.resources.items.grassNormalTexture
    this.texture.normal.repeat.set(1.5, 1.5)
    this.texture.normal.wrapS = THREE.RepeatWrapping
    this.texture.normal.wrapT = THREE.RepeatWrapping
  }
  setMaterial() {
    this.material = new THREE.MeshStandardMaterial({
      map: this.texture.color,
      normalMap: this.texture.normal,
    })
  }
  setMesh() {
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.x = -Math.PI * 0.5
    this.mesh.receiveShadow = true
    this.scene.add(this.mesh)
  }
}
```



### Fox Class

加载 fox model ，添加动画和debug调试

```js
import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Fox {
  constructor() {
    this.experience = new Experience()
    this.sence = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox')
    }

    // model
    this.resource = this.resources.items.foxModel
    this.setModel()
    this.setAnimation()
  }
  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.sence.add(this.model)

    // 给模型添加阴影
    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }
  setAnimation() {
    this.animation = {}
    // 获取动画
    this.animation.mixer = new THREE.AnimationMixer(this.model)
    // 动作
    this.animation.actions = {}
    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    )
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    )
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    )

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    // 切换动画的过渡
    this.animation.play = name => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }
    // 添加debug选项
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => this.animation.play('idle'),
        playWalking: () => this.animation.play('walking'),
        playRunning: () => this.animation.play('running'),
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalking')
      this.debugFolder.add(debugObject, 'playRunning')
    }

    // this.animation.action = this.animation.mixer.clipAction(
    //   this.resource.animations[0]
    // )
    // this.animation.action.play()
  }
  // 每帧更新动画
  // update方法会在Experience Class的update方法中被调用
  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
```

## Destroy

首先移除事件监听，因为通知事件是继承 `EventEmitter Class`，所以直接调用 `off`方法

```js
this.sizes.off('resize')
this.time.off('tick')
```

移除`sence`中的对象，通过遍历整个`sence`，查找需要处理的对象。[how to dispose of object](https://threejs.org/manual/?q=dispose#en/how-to-dispose-of-objects) 主要移除geometry，material，texture，control等等

如果是`Mesh`,直接调用`dispose()`方法，遍历`material`如果有`dispose()`就调用

最后卸载 `camera` `renderer` `debug`

```js
  destroy() {
    // EventEmitter的方法，移除事件监听
    this.sizes.off('resize')
    this.time.off('tick')

    // 遍历场景中的所有物体
    this.scene.traverse(child => {
      // 检查物体是否是Mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // 遍历网格模型的材质，调用dispose方法
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }
    })
    this.camera.controls.dispose()
    this.renderer.instance.dispose()、
    if (this.debug.active) this.debug.ui.destroy()
  }
```

