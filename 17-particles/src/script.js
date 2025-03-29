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

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTextrue = textureLoader.load('/textures/particles/2.png')
const particleAlphaTexture = textureLoader.load('/textures/particles/star_trans_01.png')
/**
 * Particles
 */
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const count = 10000
// const positions = new Float32Array(count * 3).fill(0).map(() => (Math.random() - 0.5) * 20) // (x,y,z)
const positions = new Float32Array(count * 3)
const colors = new Float32Array(count * 3)
for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10
    colors[i] = Math.random()
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))


// Material
// particle的边缘会遮挡其他particle，不使用map，设置alphaMap
// particle是按照顺序绘制的，
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.1,
    // color: 0x7799CC,
    // map: particleTextrue,
    alphaMap: particleTextrue,
    transparent: true,
    // sizeAttenuation: false,
})
// alphaTest，但是仍有边缘的过渡像素
// particlesMaterial.alphaTest = 0.001
// depth test
// particlesMaterial.depthTest = false
particlesMaterial.depthWrite = false
particlesMaterial.blending = THREE.AdditiveBlending
// 当一个像素有多个粒子时，会变得非常亮，这是AdditiveBlending，因为不是一层一层的绘制颜色而是把这个颜色加到之前的颜色上。就像不同颜色的灯光混合在一起

// 使用顶点颜色，但是会将基础颜色和顶点颜色混合
particlesMaterial.vertexColors = true



// Particles
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// my BufferGeometry
// const myBufferGeometry = new THREE.BufferGeometry()
// const count = 50
// const positionArray = new Float32Array(count * 3 * 3)
// for (let i = 0; i < count * 3 * 3; i++) {
//     positionArray[i] = (Math.random() - 0.5)
// }
// const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
// myBufferGeometry.setAttribute('position', positionAttribute)
// const particles = new THREE.Points(myBufferGeometry, particlesMaterial)
// scene.add(particles)


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
camera.position.z = 3
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

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update particles
    // 整体旋转
    // particles.rotation.y = elapsedTime * 0.2
    // 分别控制, 遍历所有的顶点
    for (let i = 0; i < count; i++) {
        // 3个元素为一组顶点，每次只访问x。count是顶点数
        const i3 = i * 3
        const x = particlesGeometry.attributes.position.array[i3]
        // 粒子波浪运动
        particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(elapsedTime + x)
        // 但是属性已经更新了，粒子却没有动，设置needsUpdate，告诉threejs更新
    }
    particlesGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()