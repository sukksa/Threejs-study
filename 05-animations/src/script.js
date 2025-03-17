import * as THREE from 'three'
import {
    gsap
} from 'gsap'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'

// Canvas
const canvas = document.querySelector('canvas.webgl')


// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({
    color: 0xff0000
})
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.render(scene, camera)

// gsap.to(mesh.position, {
//     x: 2,
//     duration: 1,
//     delay: 1
// })
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
// controls.target.y = 1
// controls.update()
// Clock
const tick = () => {
    // const elapsedTime = clock.getElapsedTime()
    // mesh.rotation.y = elapsedTime * Math.PI

    controls.update()
    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}

tick()