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

# Controls

[FlyControls](https://threejs.org/docs/examples/en/controls/FlyControls.html) 像控制飞船一样旋转镜头

[FirstPersonControls](https://threejs.org/docs/examples/en/controls/FirstPersonControls.html) 与 FlyControls 类似，但无法操控Y轴

[PointerLockControls](https://threejs.org/docs/examples/en/controls/PointerLockControls.html) 让鼠标消失，只能旋转方向，类似第一人称游戏。键盘操作距离

[OrbitControls](https://threejs.org/docs/examples/en/controls/OrbitControls.html) 轨道控制，左键旋转，右键移动，中键放大

[TrackballControls](https://threejs.org/docs/examples/en/controls/TrackballControls.html) 类似OrbitControls, 但是没有视角限制，可以无休止的旋转

[TransformControls](https://threejs.org/docs/examples/en/controls/TransformControls.html) 变换控件，可以移动物体

[DragControls](https://threejs.org/docs/examples/en/controls/DragControls.html) 类似TransformControls可以拖动物体
