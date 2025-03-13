## 创建3D场景

#### Scene

**场景对象**，THREE对象都挂载在scene上。`scene.add()`

```js
const scene = new THREE.Scene()

//scene.add(mesh)
```

#### Mesh

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



## transform object

1. 位置 position

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

2. 坐标轴 

   ```js
   const axesHeper = new THREE.AxesHelper(2)
   scene.add(axesHeper)
   ```

3. 缩放 scale

   ```js
   mesh.scale.x = 2 // mesh的x方向长度变为原来的2倍
   mesh.scale.y = 0.5 
   mesh.scale.z = 0.5
   // mesh.scale.set(2, 0.5, 0.5)
   ```

4. 旋转 rotation (基于欧拉角 uhler)

   旋转是围绕物体自身的坐标轴旋转的，x轴旋转后，Y轴不会向上。

   mesh.rotation.reorder('YXZ') 调整旋转的顺序，调用x,y的顺序不会导致不同，默认'XYZ'。

   ```js
   // mesh.rotation.reorder('YXZ')  // 旋转结果会不同
   mesh.rotation.y = Math.PI * 0.25 // mesh 绕自身y轴旋转45°， 2PI一周
   mesh.rotation.x = Math.PI * 0.25
   ```

5. 旋转 quaternion 四元数

6. LookAt

   调整摄像机对准目标，参数为三维向量，默认对准场景中心。

   ```js
   camera.lookAt(new THREE.Vector3(0, 0, 0)) // 默认，场景中心
   camera.lookAt(mesh.position)
   ```

7. 创建组 new THREE.Group()

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

