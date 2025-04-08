import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene
    this.resources = this.experience.resources

    // 监听资源加载完成事件
    this.resources.on('ready', () => {
      this.floor = new Floor()
      this.fox = new Fox()
      // environmentMap 需要在最后执行，否则之后的还没加入sence导致添加不上
      this.environment = new Environment()
    })
  }

  update() {
    if (this.fox) {
      this.fox.update()
    }
  }
}
