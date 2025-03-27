import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'

/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
const textrueLoader = new THREE.TextureLoader()
const bakedShadow = textrueLoader.load('/textures/bakedShadow.jpg')
const simpleShadow = textrueLoader.load('/textures/simpleShadow.jpg')

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3)
gui.add(ambientLight, 'intensity').min(0).max(3).step(0.001)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4)
directionalLight.position.set(2, 2, -1)
gui.add(directionalLight, 'intensity').min(0).max(3).step(0.001)
gui.add(directionalLight.position, 'x').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'y').min(-5).max(5).step(0.001)
gui.add(directionalLight.position, 'z').min(-5).max(5).step(0.001)
scene.add(directionalLight)

// directionalLight 的 camera 是一个正交相机，无透视
// 投射 
directionalLight.castShadow = true
// 优化阴影 贴图的尺寸
console.log(directionalLight.shadow);
directionalLight.shadow.mapSize.width = 1024
directionalLight.shadow.mapSize.height = 1024
// 阴影能中照射到的范围，缩小渲染范围在球体的边缘看到更多的细节，更清晰的呈现阴影
directionalLight.shadow.camera.top = 2
directionalLight.shadow.camera.right = 2
directionalLight.shadow.camera.bottom = -2
directionalLight.shadow.camera.left = -2
directionalLight.shadow.camera.near = 1
directionalLight.shadow.camera.far = 6
// 阴影的模糊效果，与物体的远近无关，模糊效果都是一致的
directionalLight.shadow.radius = 10
const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
directionalLightCameraHelper.visible = false
scene.add(directionalLightCameraHelper)
// shadow map algorithm 阴影贴图算法


// Spot Light 透视相机
const spotLight = new THREE.SpotLight(0xffffff, 0.3, 10, Math.PI * 0.3)
spotLight.castShadow = true
spotLight.shadow.mapSize.width = 1024
spotLight.shadow.mapSize.height = 1024
// 视角
spotLight.shadow.camera.fov = 30
spotLight.shadow.camera.near = 1
spotLight.shadow.camera.far = 5
spotLight.position.set(0, 2, 2)
scene.add(spotLight)
scene.add(spotLight.target)

const spotLightCameraHepler = new THREE.CameraHelper(spotLight.shadow.camera)
scene.add(spotLightCameraHepler)

const pointLight = new THREE.PointLight(0xffffff, 1)
pointLight.position.set(-1, 1, 0)
pointLight.castShadow = true
// 因为是向四周发散的所以无法调整视角fov
pointLight.shadow.mapSize.width = 1024
pointLight.shadow.mapSize.height = 1024
// pointLight 本身很小，near可以设置小一点
pointLight.shadow.camera.near = 0.1
pointLight.shadow.camera.far = 2
// scene.add() 前设置
scene.add(pointLight)

// 点光源 是像四周发散光，结果cameraHelper是一个透视相机，threejs将点光源的六个方向都渲染一次，所以相当于6个透视相机。为什么pointLightCameraHepler会向下呢？大概是最后一次渲染的是bottom
const pointLightCameraHepler = new THREE.CameraHelper(pointLight.shadow.camera)
scene.add(pointLightCameraHepler)


/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial()
material.roughness = 0.7
gui.add(material, 'metalness').min(0).max(1).step(0.001)
gui.add(material, 'roughness').min(0).max(1).step(0.001)

/**
 * Objects
 */
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(5, 5),
    material
)
plane.rotation.x = -Math.PI * 0.5
plane.position.y = -0.5
// sphere投射阴影
sphere.castShadow = true
// plane接收阴影
plane.receiveShadow = true
scene.add(sphere, plane)


const sphereShadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1.5, 1.5),
    new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true,
        alphaMap: simpleShadow
    })
)
sphereShadow.rotation.x = -Math.PI * 0.5
sphereShadow.position.y = plane.position.y + 0.001
scene.add(sphereShadow)
const axesHelper = new THREE.AxesHelper(2)
scene.add(axesHelper)
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 开启阴影
renderer.shadowMap.enabled = false

// 阴影贴图算法
renderer.shadowMap.type = THREE.PCFSoftShadowMap // radius 不起作用

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update the sphere
    // 圆周运动，y轴弹跳
    sphere.position.x = Math.cos(elapsedTime) * 1.5
    sphere.position.z = Math.sin(elapsedTime) * 1.5
    sphere.position.y = Math.abs(Math.sin(elapsedTime * 3))

    // Update the shadow
    sphereShadow.position.x = sphere.position.x
    sphereShadow.position.z = sphere.position.z
    sphereShadow.material.opacity = ((1 - sphere.position.y) / 3)

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()