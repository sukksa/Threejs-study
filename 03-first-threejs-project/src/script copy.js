import * as THREE from 'three'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000
})
// const material = new THREE.MeshPhongMaterial({
//     color: 0xff0000,
//     specular: 0x4488ee,
//     shininess: 12
// })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 4
scene.add(camera)


mesh.position.x = 0.7
mesh.position.y = -0.6
mesh.position.z = 1
console.log(mesh.position.normalize())
console.log(mesh.position.length())
console.log(mesh.position.distanceTo(camera.position))
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

function myrender() {
    renderer.render(scene, camera)
    mesh.rotateX(0.01)
    mesh.rotateY(0.01)
    requestAnimationFrame(myrender)
}
// myrender()