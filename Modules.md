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

## Base

将 THREEjs 项目通过 class 和 modules 分割为许多小模块方便维护。

### Experience Class

首先创建一个`Experience`类，将所有与 WebGL 无关的内容全部放在里面。

```js
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
export default class Experience {
  constructor(canvas) {
    // 添加为全局变量，方便控制台查看，可加可不加
    window.experience = this

    // Options
    this.canvas = canvas

    // setup
    this.sizes = new Sizes()
    this.time = new Time()

    // 监听窗口大小变化事件，调用resize方法
    this.sizes.on('resize', () => {
      this.resize()
    })
    // 监听时间变化事件，调用update方法
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {}
  update() {}
}
```

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

Wolrd 类包含了，需要加载的lights，models，meshes等等都在这里实例化



### Environment Class
