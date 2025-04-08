import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Camera from './Camera.js'
import Renderer from './Renderer.js'
import World from './World/World.js'
import Resources from './Utils/Resources.js'
import sources from './sources.js'

let instance = null
// 单例模式，确保只有一个Experience实例存在

export default class Experience {
  constructor(canvas) {
    if (instance) {
      return instance
    }
    instance = this

    // 添加为全局变量，方便控制台查看，可加可不加
    window.experience = this

    // Options
    this.canvas = canvas

    // setup
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // 监听窗口大小变化事件，调用resize方法
    this.sizes.on('resize', () => {
      this.resize()
    })
    // 监听时间变化事件，调用update方法
    this.time.on('tick', () => {
      this.update()
    })
    // 监听资源加载完成事件，调用ready方法
    this.resources.on('ready', () => {
      this.ready()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    this.camera.update()
    this.renderer.update()
  }
  ready() {
    this.world.ready()
  }
}
