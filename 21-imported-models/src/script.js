import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import GUI from 'lil-gui'
// import {
//     GLTFLoader
// } from 'three/examples/jsm/loaders/GLTFLoader.js'
import {
    GLTFLoader
} from 'three/addons/loaders/GLTFLoader.js';
import {
    DRACOLoader
} from 'three/addons/loaders/DRACOLoader.js';
/**
 * Base
 */
// Debug
const gui = new GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/* 
 * Models
 */
const gltfLoader = new GLTFLoader()


const dracoLoader = new DRACOLoader()
// three/examples/jsm/libs/draco 文件夹
// 设置dracoLoader的解码路径
dracoLoader.setDecoderPath('/draco/')
// 将 gltfLoader 通过DRACOLoader实例化
gltfLoader.setDRACOLoader(dracoLoader)
/* gltfLoader.load(
    // '/models/Duck/glTF/Duck.gltf',
    // '/models/Duck/glTF-Binary/Duck.glb',
    // '/models/Duck/glTF-Draco/Duck.gltf',
    // '/models/FlightHelmet/glTF/FlightHelmet.gltf',
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log(gltf);
        // 直接添加 children 会移除掉gltf中的mesh，别直接遍历原数组
        // const children = [...gltf.scene.children]
        // for (const child of children) {
        //     scene.add(child)
        // }

        // or
        scene.add(gltf.scene)
    },
) */
let mixer = null
gltfLoader.load(
    '/models/Fox/glTF/Fox.gltf',
    (gltf) => {
        console.log(gltf);
        // 动画会应用到 gltf.scene 这个场景
        mixer = new THREE.AnimationMixer(gltf.scene)
        // action
        const action = mixer.clipAction(gltf.animations[2])
        console.log(action);
        action.play()
        // 缩放
        gltf.scene.scale.set(0.025, 0.025, 0.025)
        scene.add(gltf.scene)
    },
)



/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#444444',
        metalness: 0,
        roughness: 0.5
    })
)
floor.receiveShadow = true
floor.rotation.x = -Math.PI * 0.5
scene.add(floor)

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.4)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 1.8)
directionalLight.castShadow = true
directionalLight.shadow.mapSize.set(1024, 1024)
directionalLight.shadow.camera.far = 15
directionalLight.shadow.camera.left = -7
directionalLight.shadow.camera.top = 7
directionalLight.shadow.camera.right = 7
directionalLight.shadow.camera.bottom = -7
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

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
camera.position.set(2, 2, 2)
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.target.set(0, 0.75, 0)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let previousTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - previousTime
    previousTime = elapsedTime

    // Update mixer
    // 加载模型需要时间，判断 mixer 是否实例化
    if (mixer) {
        mixer.update(deltaTime)
    }

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}
tick()