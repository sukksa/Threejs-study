import * as THREE from 'three'
import {
    OrbitControls
} from 'three/examples/jsm/controls/OrbitControls.js'
import {
    Timer
} from 'three/addons/misc/Timer.js'
import GUI from 'lil-gui'

const textureLoader = new THREE.TextureLoader()
// floor
const floorAlphaTexture = textureLoader.load('/floor/alpha.jpg')
const floorColorTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_diff_1k.jpg')
const floorARMTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_arm_1k.jpg')
const floorNormalTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_nor_1k.jpg')
const floorDisplacementTexture = textureLoader.load('/floor/coast_sand_rocks_02_1k/coast_sand_rocks_02_disp_1k.jpg')

// 解决纹理颜色泛白，设置正确的颜色
floorColorTexture.colorSpace = THREE.SRGBColorSpace
// 设置纹理的平铺和重复，不然纹理放大会模糊
const setTextrueRepeat = (texture, repeatS, repeatT) => {
    texture.repeat.set(repeatS, repeatT)
    texture.wrapS = THREE.RepeatWrapping
    texture.wrapT = THREE.RepeatWrapping
}
setTextrueRepeat(floorColorTexture, 8, 8)
setTextrueRepeat(floorARMTexture, 8, 8)
setTextrueRepeat(floorNormalTexture, 8, 8)
setTextrueRepeat(floorDisplacementTexture, 8, 8)

// wall textrues
const wallColorTexture = textureLoader.load('/walls/castle_brick_broken_06_diff_1k.jpg')
const wallARMTexture = textureLoader.load('/walls/castle_brick_broken_06_arm_1k.jpg')
const wallNormalTexture = textureLoader.load('/walls/castle_brick_broken_06_nor_1k.jpg')
const wallDisplacementTextrue = textureLoader.load('/walls/castle_brick_broken_06_disp_1k.jpg')

wallColorTexture.colorSpace = THREE.SRGBColorSpace
// setTextrueRepeat(wallColorTexture, 2)
// setTextrueRepeat(wallARMTexture, 2)
// setTextrueRepeat(wallNormalTexture, 2)
// setTextrueRepeat(wallDisplacementTextrue, 2)

// roof textrues
const roofColorTexture = textureLoader.load('/roof/roof_slates_02_diff_1k.jpg')
const roofARMTexture = textureLoader.load('/roof/roof_slates_02_arm_1k.jpg')
const roofNormalTexture = textureLoader.load('/roof/roof_slates_02_nor_1k.jpg')
const roofDisplacementTextrue = textureLoader.load('/roof/roof_slates_02_disp_1k.jpg')
roofColorTexture.colorSpace = THREE.SRGBColorSpace
setTextrueRepeat(roofColorTexture, 3, 1)
setTextrueRepeat(roofARMTexture, 3, 1)
setTextrueRepeat(roofNormalTexture, 3, 1)
setTextrueRepeat(roofDisplacementTextrue, 3, 1)

// rush
const rushColorTexture = textureLoader.load('/rush/leaves_forest_ground_diff_1k.jpg')
const rushARMTexture = textureLoader.load('/rush/leaves_forest_ground_arm_1k.jpg')
const rushNormalTexture = textureLoader.load('/rush/leaves_forest_ground_nor_1k.jpg')
const rushDisplacementTextrue = textureLoader.load('/rush/leaves_forest_ground_disp_1k.jpg')
roofColorTexture.colorSpace = THREE.SRGBColorSpace

// grave
const graveColorTexture = textureLoader.load('/grave/plastered_stone_wall_diff_1k.jpg')
const graveARMTexture = textureLoader.load('/grave/plastered_stone_wall_arm_1k.jpg')
const graveNormalTexture = textureLoader.load('/grave/plastered_stone_wall_nor_1k.jpg')
const graveDisplacementTextrue = textureLoader.load('/grave/plastered_stone_wall_disp_1k.jpg')
graveColorTexture.colorSpace = THREE.SRGBColorSpace
setTextrueRepeat(graveColorTexture, 0.3, 0.4)
setTextrueRepeat(graveARMTexture, 0.3, 0.4)
setTextrueRepeat(graveNormalTexture, 0.3, 0.4)
setTextrueRepeat(graveDisplacementTextrue, 0.3, 0.4)

// Door
const doorColorTexture = textureLoader.load('./door/color.jpg')
const doorAlphaTexture = textureLoader.load('./door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('./door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('./door/height.jpg')
const doorNormalTexture = textureLoader.load('./door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('./door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('./door/roughness.jpg')

doorColorTexture.colorSpace = THREE.SRGBColorSpace

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
 * House
 */
const houseMeasurements = {
    width: 4,
    height: 2.5,
    depth: 4,

}

// TODO floor 
const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20, 100, 100),
    new THREE.MeshStandardMaterial({
        map: floorColorTexture,
        alphaMap: floorAlphaTexture,
        transparent: true,
        aoMap: floorARMTexture,
        roughnessMap: floorARMTexture,
        metalnessMap: floorARMTexture,
        normalMap: floorNormalTexture,
        displacementMap: floorDisplacementTexture, // 高度，地形起伏
        displacementScale: 0.3, // 高度缩放
        displacementBias: -0.2, // 高度偏移，因为displacementMap会抬高，所以设置向下偏移
    }))
floor.rotateX(-Math.PI * 0.5)
scene.add(floor)

gui.add(floor.material, 'displacementScale').min(0).max(1).step(0.001)
gui.add(floor.material, 'displacementBias').min(-1).max(1).step(0.001)

// 房子 group
const house = new THREE.Group()
scene.add(house)

// 墙壁 walls
const walls = new THREE.Mesh(
    new THREE.BoxGeometry(houseMeasurements.width, houseMeasurements.height, houseMeasurements.depth, 100, 100),
    new THREE.MeshStandardMaterial({
        map: wallColorTexture,
        aoMap: wallARMTexture,
        roughnessMap: wallARMTexture,
        metalnessMap: wallARMTexture,
        normalMap: wallNormalTexture,
        displacementMap: wallDisplacementTextrue,
        displacementScale: 0.25,
        displacementBias: -0.23,
    })
)
walls.position.y = houseMeasurements.height * 0.5
house.add(walls)

//  房顶 roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1.5, 4),
    new THREE.MeshStandardMaterial({
        map: roofColorTexture,
        aoMap: roofARMTexture,
        roughnessMap: roofARMTexture,
        metalnessMap: roofARMTexture,
        normalMap: roofNormalTexture,
    })
)
roof.position.y = houseMeasurements.height + 1.5 * 0.5
// roof.rotation.y = Math.PI * 0.25
roof.rotateY(Math.PI * 0.25)
house.add(roof)

// door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
    new THREE.MeshStandardMaterial({
        side: THREE.DoubleSide,
        map: doorColorTexture,
        alphaMap: doorAlphaTexture,
        transparent: true,
        aoMap: doorAmbientOcclusionTexture,
        roughnessMap: doorRoughnessTexture,
        metalnessMap: doorMetalnessTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.15,
        displacementBias: -0.04,
    })
)
door.position.y = 1
door.position.z = houseMeasurements.depth * 0.5 + 0.01
house.add(door)

// 灌木丛 bushes
const bushGeometry = new THREE.SphereGeometry(1, 32, 32, 32)
const bushMaterial = new THREE.MeshStandardMaterial({
    color: 0xccffcc,
    map: rushColorTexture,
    aoMap: rushARMTexture,
    roughnessMap: rushARMTexture,
    metalnessMap: rushARMTexture,
    normalMap: rushNormalTexture,
    displacementMap: rushDisplacementTextrue,
    displacementScale: 0.2,
    displacementBias: -0.2,
})
const bush1 = new THREE.Mesh(bushGeometry, bushMaterial)
bush1.scale.set(0.5, 0.5, 0.5)
bush1.position.set(0.8, 0.2, 2.2)
bush1.rotation.x = -0.75
const bush2 = new THREE.Mesh(bushGeometry, bushMaterial)
bush2.scale.set(0.25, 0.25, 0.25)
bush2.position.set(1.4, 0.1, 2.1)
bush2.rotation.x = -0.75
const bush3 = new THREE.Mesh(bushGeometry, bushMaterial)
bush3.scale.set(0.4, 0.4, 0.4)
bush3.position.set(-0.8, 0.1, 2.2)
bush3.rotation.x = -0.75
const bush4 = new THREE.Mesh(bushGeometry, bushMaterial)
bush4.scale.set(0.15, 0.15, 0.15)
bush4.position.set(-1, 0.05, 2.6)
bush4.rotation.x = -0.75
house.add(bush1, bush2, bush3, bush4)

// graves 墓碑
const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2)
const graveMaterial = new THREE.MeshStandardMaterial({
    map: graveColorTexture,
    aoMap: graveARMTexture,
    roughnessMap: graveARMTexture,
    metalnessMap: graveARMTexture,
    normalMap: graveNormalTexture,
    // displacementMap: graveDisplacementTextrue,
    // displacementScale: 0.2,
    // displacementBias: -0.2,
})
const graves = new THREE.Group()
scene.add(graves)

for (let i = 0; i < 30; i++) {
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 4 + 3
    const x = Math.sin(angle) * radius
    const z = Math.cos(angle) * radius
    // mesh
    const grave = new THREE.Mesh(graveGeometry, graveMaterial)
    grave.position.x = x
    grave.position.y = Math.random() * 0.4
    grave.position.z = z
    grave.rotation.x = (Math.random() - 0.5) * 0.4
    grave.rotation.y = (Math.random() - 0.5) * 0.4
    grave.rotation.z = (Math.random() - 0.5) * 0.4
    graves.add(grave)
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#ffffff', 0.5)
scene.add(ambientLight)

// Directional light
const directionalLight = new THREE.DirectionalLight('#ffffff', 1.5)
directionalLight.position.set(3, 2, -8)
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
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
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
const timer = new Timer()

const tick = () => {
    // Timer
    timer.update()
    const elapsedTime = timer.getElapsed()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()