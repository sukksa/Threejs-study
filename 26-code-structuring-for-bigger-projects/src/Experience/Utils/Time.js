import EventEmitter from './EventEmitter'
export default class Time extends EventEmitter {
  constructor() {
    super()

    this.start = Date.now() // 记录开始时间
    this.current = this.start // 记录当前时间
    this.elapsed = 0 // 记录从开始到现在的时间
    this.delta = 16 // 每帧大约时间间隔，默认值为16ms（60fps）

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }

  tick() {
    const currentTime = Date.now()
    this.delta = currentTime - this.current
    this.current = currentTime
    this.elapsed = this.current - this.start

    // 触发事件，通知其他模块时间发生了变化
    this.trigger('tick')

    window.requestAnimationFrame(() => {
      this.tick()
    })
  }
}
