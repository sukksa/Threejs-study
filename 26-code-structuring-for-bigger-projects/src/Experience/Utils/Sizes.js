import EventEmitter from './EventEmitter.js'

export default class Sizes extends EventEmitter {
  constructor() {
    super()
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)

      // 使用事件触发器来通知其他模块尺寸发生了变化
      this.trigger('resize')
    })
  }
}
