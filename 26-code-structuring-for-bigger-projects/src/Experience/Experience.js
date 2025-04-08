import * as THREE from 'three'
import Sizes from './Utils/Sizes.js'
import Time from './Utils/Time.js'
import Debug from './Utils/Debug.js'
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
    this.debug = new Debug()
    this.sizes = new Sizes()
    this.time = new Time()
    this.scene = new THREE.Scene()
    this.resources = new Resources(sources)
    this.camera = new Camera()
    this.renderer = new Renderer()
    this.world = new World()

    // EventEmitter的方法
    // 监听窗口大小变化事件，调用resize方法
    this.sizes.on('resize', () => {
      this.resize()
    })
    // 监听时间变化事件，调用update方法
    this.time.on('tick', () => {
      this.update()
    })
  }

  resize() {
    this.camera.resize()
    this.renderer.resize()
  }
  update() {
    this.camera.update()
    this.world.update()
    // render 放在最后，确保所有物体都渲染完成
    this.renderer.update()
  }

  destroy() {
    // EventEmitter的方法，移除事件监听
    this.sizes.off('resize')
    this.time.off('tick')

    // 遍历场景中的所有物体
    this.scene.traverse(child => {
      // 检查物体是否是Mesh
      if (child instanceof THREE.Mesh) {
        child.geometry.dispose()

        // 遍历网格模型的材质，调用dispose方法
        for (const key in child.material) {
          const value = child.material[key]
          if (value && typeof value.dispose === 'function') {
            value.dispose()
          }
        }
      }

      this.camera.controls.dispose()
      this.renderer.instance.dispose()
      if (this.debug.active) this.debug.ui.destroy()
    })
  }
}
