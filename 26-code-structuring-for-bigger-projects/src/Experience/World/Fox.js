import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Fox {
  constructor() {
    this.experience = new Experience()
    this.sence = this.experience.scene
    this.resources = this.experience.resources
    this.time = this.experience.time
    this.debug = this.experience.debug

    // Debug
    if (this.debug.active) {
      this.debugFolder = this.debug.ui.addFolder('fox')
    }

    // model
    this.resource = this.resources.items.foxModel
    this.setModel()
    this.setAnimation()
  }
  setModel() {
    this.model = this.resource.scene
    this.model.scale.set(0.02, 0.02, 0.02)
    this.sence.add(this.model)

    // 给模型添加阴影
    this.model.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
      }
    })
  }
  setAnimation() {
    this.animation = {}
    // 获取动画
    this.animation.mixer = new THREE.AnimationMixer(this.model)
    // 动作
    this.animation.actions = {}
    this.animation.actions.idle = this.animation.mixer.clipAction(
      this.resource.animations[0]
    )
    this.animation.actions.walking = this.animation.mixer.clipAction(
      this.resource.animations[1]
    )
    this.animation.actions.running = this.animation.mixer.clipAction(
      this.resource.animations[2]
    )

    this.animation.actions.current = this.animation.actions.idle
    this.animation.actions.current.play()

    // 切换动画的过渡
    this.animation.play = name => {
      const newAction = this.animation.actions[name]
      const oldAction = this.animation.actions.current

      newAction.reset()
      newAction.play()
      newAction.crossFadeFrom(oldAction, 1)

      this.animation.actions.current = newAction
    }
    // 添加debug选项
    if (this.debug.active) {
      const debugObject = {
        playIdle: () => this.animation.play('idle'),
        playWalking: () => this.animation.play('walking'),
        playRunning: () => this.animation.play('running'),
      }
      this.debugFolder.add(debugObject, 'playIdle')
      this.debugFolder.add(debugObject, 'playWalking')
      this.debugFolder.add(debugObject, 'playRunning')
    }

    // this.animation.action = this.animation.mixer.clipAction(
    //   this.resource.animations[0]
    // )
    // this.animation.action.play()
  }
  // 每帧更新动画
  // update方法会在Experience Class的update方法中被调用
  update() {
    this.animation.mixer.update(this.time.delta * 0.001)
  }
}
