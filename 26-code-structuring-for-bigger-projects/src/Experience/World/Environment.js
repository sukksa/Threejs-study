import * as THREE from 'three'
import Experience from '../Experience.js'

export default class Environment {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    this.setSunlight()
    this.setEnvironmentMap()
  }

  setSunlight() {
    this.sunlight = new THREE.DirectionalLight('#ffffff', 4)
    this.sunlight.castShadow = true
    this.sunlight.shadow.camera.far = 15
    this.sunlight.shadow.mapSize.set(1024, 1024)
    this.sunlight.shadow.normalBias = 0.05
    this.sunlight.position.set(3.5, 2, -1.25)
    this.scene.add(this.sunlight)
  }
  setEnvironmentMap() {}
}
