import Robot from './Robot.js';
export default class FlyingRobot extends Robot {
  constructor(name, legs) {
    super(name, legs); // super() 相当于调用父类的构造函数
    this.canFly = true;
  }
  takeOff() {
    console.log(`${this.name} is taking off!`);
  }
  land() {
    console.log(`Weblcome back ${this.name}`);
  }
  sayHi() {
    // super.sayHi()
    console.log(`Hi! I am ${this.name }. I can fly!`);
  }
}