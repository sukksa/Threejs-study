import * as THREE from 'three'
var geometry = new THREE.BoxGeometry(1, 1, 1); //创建一个立方体几何对象Geometry
var material = new THREE.MeshLambertMaterial({
    color: 0x0000ff
}); //材质对象Material
var mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
scene.add(mesh); //网格模型添加到场景中
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
// const geometry = new THREE.BoxGeometry(1, 1, 1)
// const material = new THREE.MeshBasicMaterial({
//     color: 0xff0000
// })
// const mesh = new THREE.Mesh(geometry, material)

// console.log(mesh.position.length(), mesh.position);
// // mesh.position.x = 0.7
// // mesh.position.y = -0.6
// // mesh.position.z = 1
// mesh.position.set(0.7, -0.6, 1)
// scene.add(mesh)
// const axesHeper = new THREE.AxesHelper()
// scene.add(axesHeper)
// // console.log(mesh.position.length());
// // 归一化 向量长度设置为1
// // mesh.position.normalize();
// // console.log(mesh.position.length(), mesh.position);
// // mesh.scale.x = 2
// // mesh.scale.y = 0.5
// // mesh.scale.z = 0.5
// mesh.scale.set(2, 0.5, 0.5)
// mesh.rotation.reorder('YXZ')
// mesh.rotation.y = Math.PI * 0.25
// mesh.rotation.x = Math.PI * 0.25

const group = new THREE.Group()
group.position.y = 1
group.scale.y = 0.5
group.rotation.y = Math.PI * 1
scene.add(group)

const cube1 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0xff0000
    }))
group.add(cube1)
const cube2 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x00ff00
    }))
cube2.position.x = -2
group.add(cube2)
const cube3 = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({
        color: 0x0000ff
    }))
cube3.position.x = 2
group.add(cube3)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}
const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)
/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.set(0, 0, 3)
scene.add(camera)
// console.log(mesh.position.distanceTo(camera.position));

// 他会调整对象对准目标
camera.lookAt(new THREE.Vector3())
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)