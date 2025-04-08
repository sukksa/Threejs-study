import GUI from 'lil-gui'

export default class Debug {
  constructor() {
    // 如果包含debug，则创建一个GUI实例
    this.active = window.location.hash === '#debug'
    if (this.active) {
      this.ui = new GUI()
    }
  }
}
