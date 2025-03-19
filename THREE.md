## 创建3D场景

### Scene

**场景对象**，THREE对象都挂载在scene上。`scene.add()`

```js
const scene = new THREE.Scene()

//scene.add(mesh)
```

### Mesh

**网格模型**

1. Geometry 立方体几何对象
2. Material 材质对象

```
const geometry = new THREE.BoxGeometry(1, 1, 1); //创建一个立方体几何对象Geometry
const material = new THREE.MeshLambertMaterial({
  color: 0x0000ff
}); //材质对象Material
const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中
```

### Camera

**相机**

1. PerspectiveCamera 透视相机

    模拟人眼视角，有近大远小的透视效果，物体会随距离变形

   ```js
   const camera = new THREE.PerspectiveCamera(
     45,       // 视野角度（FOV in degrees）
     width/height, // 宽高比（Aspect Ratio）
     0.1,      // 近裁剪面（Near Plane）
     1000      // 远裁剪面（Far Plane）
   );
   ```

   

2. OrthographicCamera 正交相机

   平行投影，物体大小与距离无关， 保持物体原始比例

   ```js
   const camera = new THREE.OrthographicCamera(
     left,     // 左裁剪面
     right,    // 右裁剪面
     top,      // 上裁剪面
     bottom,   // 下裁剪面
     near,     // 近裁剪面
     far       // 远裁剪面
   );
   ```

   

```js
const width = window.innerWidth; //窗口宽度
const height = window.innerHeight; //窗口高度
const k = width / height; //窗口宽高比
const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大

//创建相机对象
const camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
const camera = new THREE.PerspectiveCamera(75, k)
camera.position.set(3, 3, 3); //设置相机位置
camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
```

### Renderer

**渲染器对象**

```js
var renderer = new THREE.WebGLRenderer();
document.body.appendChild(renderer.domElement); //body元素中插入canvas对象

const canvas = document.querySelector('canvas.webgl') // 获取 canvas.webgl
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(width, height);//设置渲染区域尺寸
renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
//执行渲染操作   指定场景、相机作为参数
renderer.render(scene, camera);
```



## Transform Object

### 位置 position

是一个三维向量 new THREE.Vector3(0.7, -0.6, 1)

mesh.position.normalize()  归一化

mesh.position.distanceTo(camera.position)  查看mesh到camera的向量长度

```	js
 mesh.position.x = 0.7
 mesh.position.y = -0.6
 mesh.position.z = 1
 // mesh.position.set(0.7, -0.6, 1)
 mesh.position.length() // 1.3601470508735443

 // 归一化 向量长度设置为1
 mesh.position.normalize()
 mesh.position.length() // 1
```

### 坐标轴 AxesHelper

```js
const axesHeper = new THREE.AxesHelper(2)
scene.add(axesHeper)
```

### 缩放 scale

```js
mesh.scale.x = 2 // mesh的x方向长度变为原来的2倍
mesh.scale.y = 0.5 
mesh.scale.z = 0.5
// mesh.scale.set(2, 0.5, 0.5)
```

### 旋转 rotation (基于欧拉角 uhler)

旋转是围绕物体自身的坐标轴旋转的，x轴旋转后，Y轴不会向上。

mesh.rotation.reorder('YXZ') 调整旋转的顺序，调用x,y的顺序不会导致不同，默认'XYZ'。

```js
// mesh.rotation.reorder('YXZ')  // 旋转结果会不同
mesh.rotation.y = Math.PI * 0.25 // mesh 绕自身y轴旋转45°， 2PI一周
mesh.rotation.x = Math.PI * 0.25
```

### 旋转 quaternion 四元数

### LookAt

调整摄像机对准目标，参数为三维向量，默认对准场景中心。

```js
camera.lookAt(new THREE.Vector3(0, 0, 0)) // 默认，场景中心
camera.lookAt(mesh.position)
```

### 创建组 new THREE.Group()

同时transform多个对象

```js
const group = new THREE.Group()
group.position.y = 1
group.scale.y = 0.5
group.rotation.y = Math.PI * 1
scene.add(group)

const cube1 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    }))
group.add(cube1)

const cube2 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    }))
cube2.position.x = -2
group.add(cube2)

const cube3 = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }))
cube3.position.x = 2
group.add(cube3)
```

## Animations

本质并不是动画效果，只是在下一帧再次调用函数。对于刷新率不同的显示器每秒调用次数也不同。60fps为60次，120fps为120次

### 利用帧间隔 getDelta

deltaTime 为两帧之间的时间间隔，60fps帧间隔为16ms，每秒调用60次，1s旋转60x16x0.01=9.6。120fps帧间隔为8ms，每秒调用120次，1s旋转120x8x0.01=9.6。

deltaTime相当于clock.getDelta()

```js
let time = Date.now()
const tick = () => {
    const currentTime = Date.now()
    const deltaTime = currentTime - time
    time = currentTime
    
    mesh.rotation.y += 0.01 * deltaTime
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
```

### Clock.getElapsedTime()

getElapsedTime() 时clock初始化时从0开始计时（单位：s）

elapsedTime时累计时间，意味着mesh每秒旋转一周

```js
const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y = elapsedTime * Math.PI * 2
    
    // mesh绕圆柱旋转
    // mesh.position.y = Math.sin(elapsedTime)
    // mesh.position.x = Math.cos(elapsedTime)
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()
```

### GSAP库

## Cameras

### ![img](http://www.webgl3d.cn/upload/threejs60%E6%8A%95%E5%BD%B1.jpg)

### PerspectiveCamera

透视相机，PerspectiveCamera( fov, aspect, near, far )

```js
PerspectiveCamera(fov, aspect, near, far)
```

| 参数   | 含义                                                         | 默认值                               |
| :----- | :----------------------------------------------------------- | :----------------------------------- |
| fov    | fov表示视场，所谓视场就是能够看到的角度范围，人的眼睛大约能够看到180度的视场，视角大小设置要根据具体应用，一般游戏会设置60~90度 | 45                                   |
| aspect | aspect表示渲染窗口的长宽比，如果一个网页上只有一个全屏的canvas画布且画布上只有一个窗口，那么aspect的值就是网页窗口客户区的宽高比 | window.innerWidth/window.innerHeight |
| near   | near属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 | 0.1                                  |
| far    | far属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小，会有部分场景看不到 | 1000                                 |

![img](http://www.webgl3d.cn/upload/threejs60PerspectiveCamera.png)

### OrthographicCamera

正交相机。无透视，物体不缩放。左右边界的距离与上下边界的距离比值与画布的渲染窗口的宽高比例要一致，否则三维模型的显示效果会被单方向不等比例拉伸

```js
OrthographicCamera(left, right, top, bottom, near, far)
```

| 参数(属性)     | 含义  |
| :--------- | :-------------------------------------- |
| left       | 渲染空间的左边界                                             |
| right      | 渲染空间的右边界                                             |
| top        | 渲染空间的上边界                                             |
| bottom     | 渲染空间的下边界                                             |
| near       | near属性表示的是从距离相机多远的位置开始渲染，一般情况会设置一个很小的值。 默认值0.1 |
| far        | far属性表示的是距离相机多远的位置截止渲染，如果设置的值偏小小，会有部分场景看不到。 默认值1000 |

![img](http://www.webgl3d.cn/upload/threejs60OrthographicCamera.png)

```js
const aspectRatio = sizes.width / sizes.height
const camera = new THREE.OrthographicCamera(-1 * aspectRatio,
    1 * aspectRatio,
    1,
    -1,
    0.1, 100)
```

### 鼠标控制旋转

```js
// 获取鼠标坐标(-0.5, 0.5), 画面中央为原点
window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / window.innerWidth - 0.5
    cursor.y = -(event.clientY / window.innerHeight - 0.5)
})

const tick = () => {
    // 水平方向旋转一周
    camera.position.x = Math.sin(cursor.x * Math.PI * 2) * 3
    camera.position.z = Math.cos(cursor.x * Math.PI * 2) * 3
    camera.position.y = cursor.y * 3
    camera.lookAt(mesh.position)
    
    // Render
    renderer.render(scene, camera)

    window.requestAnimationFrame(tick)
}
tick()
```

## Controls

[FlyControls](https://threejs.org/docs/examples/en/controls/FlyControls.html) 像控制飞船一样旋转镜头

[FirstPersonControls](https://threejs.org/docs/examples/en/controls/FirstPersonControls.html) 与 FlyControls 类似，但无法操控Y轴

[PointerLockControls](https://threejs.org/docs/examples/en/controls/PointerLockControls.html) 让鼠标消失，只能旋转方向，类似第一人称游戏。键盘操作距离

[OrbitControls](https://threejs.org/docs/examples/en/controls/OrbitControls.html) 轨道控制，左键旋转，右键移动，中键放大

[TrackballControls](https://threejs.org/docs/examples/en/controls/TrackballControls.html) 类似OrbitControls, 但是没有视角限制，可以无休止的旋转

[TransformControls](https://threejs.org/docs/examples/en/controls/TransformControls.html) 变换控件，可以移动物体

[DragControls](https://threejs.org/docs/examples/en/controls/DragControls.html) 类似TransformControls可以拖动物体

## Fullscreen and Resize

### Resize

```css
.webgl{
  position: fixed; 	// 固定canvas
  top: 0;
  left: 0;
  outline: none;  // 去除边框
}
html, body{
  overflow: hidden; // 去除滚动事件
}
```

```js
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
// 添加 resize 事件，监听窗口变化。
window.addEventListener('resize', () => {
    // 更新sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
	// 更新camera
    camera.aspect = sizes.width / sizes.height // 宽高比
    camera.updateProjectionMatrix() // 提醒相机更新投影矩阵
  	// 渲染
    renderer.setSize(sizes.width, sizes.height)
})
```

### Pixel ratio

设备像素比，屏幕上的一个物理像素单位相对于软件中的一个像素单位。`window.devicePixelRatio`

2 的像素比意味着需要渲染 4 倍的像素（4个物理像素对应1个逻辑像素），3 的像素比意味着需要渲染 9 倍的像素。

防止在高像素比的设备出现性能问题。可以放在resize事件中，如果用户使用两块屏幕并且像素比不同时，确保更好的渲染质量

```js
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
```

### Fullscreen

`document.fullscreenElement` 是否全屏

`canvas.requestFullscreen() `将某个dom全屏，只显示那一个dom

`document.exitFullscreen()` 退出全屏，退出是文档级的，所以用

但是在 Safari 上无效

```js
// 双击进入全屏，退出
window.addEventListener('dblclick', () => {

    if (!document.fullscreenElement) {
        console.log('go fullscreen')
        canvas.requestFullscreen()
    } else {
        console.log('leave fullscreen')
        document.exitFullscreen()
    }
})
```

```js
window.addEventListener('dblclick', () => {
    const fullscreenElement = document.fullscreenElement || document.webkitFullscreenElement
    if (!fullscreenElement) {
        if (canvas.requestFullscreen()) {
            canvas.requestFullscreen()
        } else if (canvas.webkitRequestFullscreen()) {
            canvas.webkitRequestFullscreen()
        }
    } else {
        if (document.exitFullscreen()) {
            document.exitFullscreen()
        } else if (document.webkitExitFullscreen()) {
            document.webkitExitFullscreen()
        }
    }
})
```

## Geometry

### 几何体

几何体是由顶点构成，每个顶点都有位置数据（position, UV, normal, ...），3个顶点连接成三角形，再构成面

- [BoxGeometry](https://threejs.org/docs/#api/en/geometries/BoxGeometry) 立方体
- [PlaneGeometry](https://threejs.org/docs/#api/en/geometries/PlaneGeometry) 平面
- [CircleGeometry](https://threejs.org/docs/#api/en/geometries/CircleGeometry) 圆面
- [ConeGeometry](https://threejs.org/docs/#api/en/geometries/ConeGeometry) 圆锥
- [CylinderGeometry](https://threejs.org/docs/#api/en/geometries/CylinderGeometry) 圆柱
- [RingGeometry](https://threejs.org/docs/#api/en/geometries/RingGeometry) 环
- [TorusGeometry](https://threejs.org/docs/#api/en/geometries/TorusGeometry) 3d环（戒指）
- [TorusKnotGeometry](https://threejs.org/docs/#api/en/geometries/TorusKnotGeometry) 环面结
- [DodecahedronGeometry](https://threejs.org/docs/#api/en/geometries/DodecahedronGeometry) 十二面体
- [OctahedronGeometry](https://threejs.org/docs/#api/en/geometries/OctahedronGeometry) 八面体
- [TetrahedronGeometry](https://threejs.org/docs/#api/en/geometries/TetrahedronGeometry) 四面体
- [IcosahedronGeometry](https://threejs.org/docs/#api/en/geometries/IcosahedronGeometry) 二十面体
- [SphereGeometry](https://threejs.org/docs/#api/en/geometries/SphereGeometry) 球
- [ShapeGeometry](https://threejs.org/docs/#api/en/geometries/ShapeGeometry) 心形（平面）
- [TubeGeometry](https://threejs.org/docs/#api/en/geometries/TubeGeometry) 管道
- [ExtrudeGeometry](https://threejs.org/docs/#api/en/geometries/ExtrudeGeometry) 
- [LatheGeometry](https://threejs.org/docs/#api/en/geometries/LatheGeometry) 车床？
- [TextGeometry](https://threejs.org/docs/?q=textge#examples/en/geometries/TextGeometry) 3d文字

### BoxGeometry

以`BoxGeometry`为例，

```js
const geometry = new THREE.BoxGeometry(1, 1, 1, 2, 2, 2)
```

- `width`: `x`轴的尺寸
- `height`:`y`轴的尺寸
- `depth`: `z`轴的尺寸
- `widthSegments`: `x`轴上的分段
- `heightSegments`:  `y` 轴上的分段
- `depthSegments`:  `z` 轴上的分段

分段对应于构成面部的三角形数量认情况下，它是 `1`，这意味着每个面只有 2 个三角形。如果将细分设置为 `2`，则每个面最终将有 8 个三角形。`2*Math.pow(n)`。更多的分段意味着可以做出更平滑的面，或者不同高度的地形

将 `wireframe： true` 添加到材质中。线框将显示分隔每个三角形的线条：

```javascript
const material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true })
```

BufferGeometry

创建自定义的几何体，通过类型化数组创建

```js
const positionsArray = new Float32Array([
    0, 0, 0, // Vertex 1 x, y, z
    0, 1, 0, // Vertex 2
    1, 0, 0 // Vertex 3
])
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3)
const geometry = new THREE.BufferGeometry()
geometry.setAttribute('position', positionsAttribute)
```

```js
const geometry = new THREE.BufferGeometry() // 创建一个空的几何体对象
const count = 50 // 三角形数量
const positionsArray = new Float32Array(count * 3 * 3) // 创建位置数组 150个点 3个数字为一个顶点
for (let i = 0; i < count * 3 * 3; i++) {
    positionsArray[i] = Math.random() - 0.5
}
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3) // 每个顶点接受3个数字
geometry.setAttribute('position', positionsAttribute) // 将位置数据添加到几何体对象
// 三角会共享顶点，通过setIndex优化
geometry.dispose(); // 移除几何体
```

## Debug UI

用于调试参数，以`dat.gui`为例

```js
npm i --save dat.gui

import * as dat from 'dat.gui'
const gui = new dat.GUI() // 实例化dat.gui
```

通过`gui.add()`添加需要控制的对象属性，必须接受一个对象

- **Range** 数值范围

  ```js
  const params = { size: 10 };
  // 基础用法
  gui.add(params, 'size'); 
  // 带范围限制的滑块
  gui.add(params, 'size', 0, 100, 1); // min=0, max=100, step=1
  ```

- **Checkbox** 复选框 (`true` or `false`)

  ```js
  const params = { visible: true };
  gui.add(params, 'visible'); // 生成复选框
  ```

- **Text** 文本框

  ```js
  const params = { name: 'Cube' };
  gui.add(params, 'name'); // 生成文本框
  ```

- **Select** 下拉选框

  ```js
  const params = { type: 'sphere' };
  
  // 传入选项数组
  gui.add(params, 'type', ['sphere', 'cube', 'cylinder']); // 生成下拉菜单
  ```

- **Color** 颜色选择

  ```js
  const params = { color: '#ff0000' };
  // 需使用 addColor 方法
  gui.addColor(params, 'color'); // 生成颜色选择器
  ```

- **Button** 点击按钮

  ```js
  import gsap from 'gsap'
  let debugObject = {
      spin: () => {
          gsap.to(mesh.rotation, {
              duration: 1,
              y: mesh.rotation.y + Math.PI * 2 // mesh 绕Y轴旋转一周 2PI
          })
      }
  }
  gui.add(debugObject, 'spin') // 添加一个按钮，点击后执行spin方法
  ```

- **Folder** 文件

基本用法

```js
import * as dat from 'dat.gui'
const gui = new dat.GUI() // 实例化dat.gui
gui.add(mesh.position, 'y', -3, 3, 0.01) // 添加一个y轴的控制器，范围是-3到3，步长是0.01
gui.add(mesh.position, 'y').min(-3).max(3).step(0.01).name('y轴') // 与上面的代码等价，并取别名

gui.add(mesh, 'visible') // 控制mesh的可见性，自动识别出现checkbox
gui.add(material, 'wireframe') // 控制材质的wireframe(线框)属性
```

通过`onChange(...)`监听控制器变化，` material.color.set(...)`修改材质的颜色

```js
let debugObject = {
    color: 0xff0000,
}
gui.addColor(debugObject, 'color').onChange(() => {
    material.color.set(debugObject.color)
})
```

## Texture

纹理

### PBR (Physically Based Rendering)

PBR是基于物理的渲染，偏向现实中的物体，主要是金属感`metalness`和粗糙度`roughness`

### TextureLoader

```js
const texture = new THREE.TextureLoader().load(
  url,          // 图像路径（必填）
  onLoad,       // 加载成功回调（可选）
  onProgress,   // 加载进度回调（可选）
  onError       // 加载失败回调（可选）
);
```

| 参数             | 类型       | 说明                                                         |
| :--------------- | :--------- | :----------------------------------------------------------- |
| **`url`**        | `string`   | 图像资源的 URL 路径（支持相对/绝对路径）                     |
| **`onLoad`**     | `Function` | 加载成功时触发，参数为加载完成的 `THREE.Texture` 对象        |
| **`onProgress`** | `Function` | 加载进度回调，参数为 `XMLHttpRequest` 实例（含 `loaded` 和 `total` 字节） |
| **`onError`**    | `Function` | 加载失败时触发，参数为错误信息                               |

```js
const loader = new THREE.TextureLoader();

const texture = loader.load(
  'textures/metal.png',
  (texture) => { 
    console.log('纹理加载完成', texture); 
    material.needsUpdate = true; // 若动态加载需手动更新材质
  },
  (xhr) => {
    console.log(`${(xhr.loaded / xhr.total * 100)}% 已加载`);
  },
  (err) => {
    console.error('加载失败:', err);
  }
);
// 将纹理应用到材质
const material = new THREE.MeshBasicMaterial({ map: texture });
const cube = new THREE.Mesh(new THREE.BoxGeometry(), material);
scene.add(cube);
```

对纹理进行操作

```js
textrue.repeat.x = 2 // 水平方向重复两次
textrue.repeat.y = 3 // 垂直方向重复三次
textrue.wrapS = THREE.RepeatWrapping // 水平方向重复
textrue.wrapT = THREE.MirroredRepeatWrapping // 垂直方向镜像重复 

textrue.offset.x = 0.5 // x轴偏移0.5
textrue.offset.y = 0.5 // y轴偏移0.5

textrue.rotation = Math.PI / 4 // 旋转45度
// 旋转中心点 默认(0,0) 左下角
textrue.center.x = 0.5 
textrue.center.y = 0.5 
```



### Texture Mapping

纹理映射，GPU会生成从原本大小的纹理到宽高为1/2,1/4，直到`1x1`大小的映射图（总大小为原来的2倍）。GPU会根据缩放程度，选择加载合适的纹理图

| **过滤类型**             | **触发场景**                                                 | **典型问题**                       |
| :----------------------- | :----------------------------------------------------------- | :--------------------------------- |
| **Minification Filter**  | 当纹理被**缩小**（纹理分辨率 > 屏幕像素分辨率）时使用。 （例如：远距离观察高分辨率贴图） | 锯齿（Aliasing）、闪烁（Moire）    |
| **Magnification Filter** | 当纹理被**放大**（纹理分辨率 < 屏幕像素像素分辨率）时使用。 （例如：近距离观察低分辨率贴图） | 模糊（Blur）、马赛克（Pixelation） |

```js
const texture = new THREE.TextureLoader().load('texture.jpg');

// 缩小过滤器配置（解决远处纹理问题）
texture.minFilter = THREE.LinearMipmapLinearFilter; // 三线性过滤（默认值）
// texture.minFilter = THREE.NearestFilter; // 高性能，低质量

// 放大过滤器配置（解决近处纹理问题）
texture.magFilter = THREE.LinearFilter; // 双线性过滤（默认值）
// texture.magFilter = THREE.NearestFilter; // 锐利边缘（如像素风格）

texture.needsUpdate = true; // 使配置生效
```

为了节约资源，无需缩放的贴图，可以不生成mipmaps

```js
Texture.generateMipmaps = false // 不生成mipmaps
```

## Material

材质

### MeshBasicMaterial

一种基础材质，它不考虑光照影响，直接以纯色或贴图渲染物体表面。

| 参数名            | 类型            | 默认值      | 说明                                                         |
| :---------------- | :-------------- | :---------- | :----------------------------------------------------------- |
| **`color`**       | `THREE.Color`   | `0xffffff`  | 材质颜色（十六进制值或CSS颜色字符串）                        |
| **`wireframe`**   | `boolean`       | `false`     | 是否以线框模式渲染（显示为网格线）                           |
| **`opacity`**     | `number`        | `1`         | 透明度（0.0 完全透明 ~ 1.0 不透明），需设置 `transparent: true` 生效 |
| **`transparent`** | `boolean`       | `false`     | 是否启用透明度                                               |
| **`map`**         | `THREE.Texture` | `null`      | 表面贴图（漫反射颜色纹理）                                   |
| **`alphaMap`**    | `THREE.Texture` | `null`      | 透明度贴图（控制各区域透明度，需开启 `transparent`）         |
| **`side`**        | `THREE.Side`    | `FrontSide` | 渲染面：`FrontSide`（前）、`BackSide`（后）、`DoubleSide`（双面） |
| **`fog`**         | `boolean`       | `true`      | 是否受场景雾效影响                                           |
| **`depthTest`**   | `boolean`       | `true`      | 是否启用深度测试（避免被其他物体遮挡）                       |
| **`depthWrite`**  | `boolean`       | `true`      | 是否写入深度缓冲区                                           |
| **`visible`**     | `boolean`       | `true`      | 材质是否可见                                                 |

- side

  ```js
  // 设置内外哪面可见
  material.side = THREE.FrontSide // 默认
  material.side = THREE.BackSide	// 仅渲染背面（适用于镜面效果）
  material.side = THREE.DoubleSide // 两面可见, 双面渲染（适用于透明物体）
  ```

- transparent

  是否透明，`opacity` `alphaMap `需要设为`true`

  ```js
  material.transparent = true 
  material.opacity = 0.5
  material.alphaMap = doorColorTexture
  ```

### MeshNormalMaterial

一种基于物体表面法线方向（Normal）进行颜色映射的材质，常用于调试模型或实现特定的视觉效果。物体颜色由法线决定

法线是垂直于顶点向外的向量

| 参数              | 类型      | 默认值      | 说明                                                         |
| :---------------- | :-------- | :---------- | :----------------------------------------------------------- |
| **`wireframe`**   | `boolean` | `false`     | 线框模式显示模型结构                                         |
| **`flatShading`** | `boolean` | `false`     | 平面着色（每个面的法线相同）vs 平滑着色（顶点法线插值）      |
| **`opacity`**     | `number`  | `1`         | 透明度（0.0 完全透明 ~ 1.0 不透明）                          |
| **`transparent`** | `boolean` | `false`     | 是否允许透明（需与 `opacity` 配合使用）                      |
| **`side`**        | `enum`    | `FrontSide` | 定义渲染的面：`THREE.FrontSide`（前）、`BackSide`（后）、`DoubleSide`（双面） |

- **`flatShading: true`**

  - **法线来源**：每个三角形面片的法线（Face Normal）
  - **计算方式**：取三角形三个顶点的平均法线，整个面片使用同一法线值
  - **颜色表现**：面片内部颜色一致，面与面交界处颜色突变

- **`flatShading: false`**

  - **法线来源**：顶点的法线（Vertex Normal）
  - **计算方式**：在三角形内部插值顶点法线，每个像素的法线独立计算
  - **颜色表现**：颜色平滑过渡，隐藏面片边界

  

  ```js
  material.flatShading = true
  ```

### MeshMatcapMaterial

一种基于 **预渲染环境光照（Material Capture，Matcap）** 的材质，它通过纹理贴图模拟复杂的光照和材质反射效果，无需实际光源即可实现立体感。

| 参数                    | 类型            | 默认值     | 说明                                           |
| :---------------------- | :-------------- | :--------- | :--------------------------------------------- |
| **`matcap`**            | `THREE.Texture` | `null`     | Matcap 贴图（必须提供）                        |
| **`color`**             | `THREE.Color`   | `0xffffff` | 材质基础颜色，与 Matcap 颜色相乘               |
| **`bumpMap`**           | `THREE.Texture` | `null`     | 凹凸贴图（灰度图，影响表面凹凸感）             |
| **`bumpScale`**         | `number`        | `1`        | 凹凸强度（正负值控制凹凸方向）                 |
| **`normalMap`**         | `THREE.Texture` | `null`     | 法线贴图（影响表面细节光照方向）               |
| **`normalScale`**       | `THREE.Vector2` | `(1,1)`    | 法线贴图强度（x/y 对应 UV 方向）               |
| **`displacementMap`**   | `THREE.Texture` | `null`     | 置换贴图（实际改变顶点位置，需足够细分几何体） |
| **`displacementScale`** | `number`        | `1`        | 置换强度                                       |
| **`flatShading`**       | `boolean`       | `false`    | 是否启用平面着色（面片法线 vs 顶点法线插值）   |

- matcp

  将模型法线方向映射到 Matcap 贴图的 UV 坐标，通过贴图像素颜色模拟光照反射。贴图通常为 **圆形渐变色图**，中心代表法线朝向摄像机（Z+方向），边缘代表法线朝向侧面。

### MeshDepthMaterial

一种基于物体到相机距离（深度）渲染的材质，其颜色由物体表面相对于相机的远近决定。它常用于 **深度可视化**、**阴影映射** 和 **后处理效果**（如 SSAO）。

**近点白色，远点是黑色。用于制作雾效和预处理**

| 参数                    | 类型/枚举            | 默认值             | 说明                                                         |
| :---------------------- | :------------------- | :----------------- | :----------------------------------------------------------- |
| **`depthPacking`**      | `THREE.DepthPacking` | `RGBADepthPacking` | 深度数据编码方式： `BasicDepthPacking`（32位）或 `RGBADepthPacking`（RGBA四通道8位存储） |
| **`alphaTest`**         | `number`             | `0`                | 透明度测试阈值（0.0~1.0），低于此值的像素被丢弃              |
| **`displacementMap`**   | `THREE.Texture`      | `null`             | 置换贴图（灰度图，实际修改顶点位置）                         |
| **`displacementScale`** | `number`             | `1`                | 置换强度（正负值控制凹凸方向）                               |
| **`displacementBias`**  | `number`             | `0`                | 置换基准偏移量                                               |
| **`wireframe`**         | `boolean`            | `false`            | 是否以线框模式渲染                                           |

### MeshLambertMaterial

一种基于 **Lambert 光照模型** 的材质，适用于表现**非光泽表面**的物体（如木材、布料、哑光塑料等）。漫反射，确保场景添加了光源才能显示

| 参数          | 类型            | 作用                                           |
| :------------ | :-------------- | :--------------------------------------------- |
| `color`       | `THREE.Color`   | 材质的基础颜色（默认 `0xffffff`，白色）        |
| `map`         | `THREE.Texture` | 漫反射贴图，覆盖基础颜色                       |
| `emissive`    | `THREE.Color`   | 自发光颜色（使物体在无光源时可见）             |
| `emissiveMap` | `THREE.Texture` | 自发光贴图                                     |
| `envMap`      | `THREE.Texture` | 环境贴图（模拟反射周围环境，但不同于镜面反射） |
| `wireframe`   | `Boolean`       | 是否以线框模式渲染（默认 `false`）             |

```js
// 1. 创建材质
const material = new THREE.MeshLambertMaterial({
  color: 0x00ff00,     // 基础颜色（十六进制）
  map: textureLoader.load('path/to/diffuse.jpg'), // 漫反射贴图
  emissive: 0x444444,  // 自发光颜色
  wireframe: false      // 是否显示为线框
});

// 2. 创建几何体并应用材质
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  material
);

// 3. 确保场景中添加光源
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // 环境光
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5); // 平行光
scene.add(ambientLight, directionalLight);
```

### MeshPhongMaterial
