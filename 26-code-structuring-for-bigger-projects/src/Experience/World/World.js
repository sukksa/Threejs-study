import * as THREE from 'three'
import Experience from '../Experience.js'
import Environment from './Environment.js'

export default class World {
  constructor() {
    this.experience = new Experience()
    this.scene = this.experience.scene

    // setup
    this.environment = new Environment()
  }

  ready() {
    this.environment.setEnvironmentMap()
  }
}
