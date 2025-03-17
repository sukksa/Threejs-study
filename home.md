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

通过`onChange(...)`监听控制器变化，`material.color.set(...)`修改材质的颜色

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

PBR是基于物理的渲染

主要是金属感和粗糙度
