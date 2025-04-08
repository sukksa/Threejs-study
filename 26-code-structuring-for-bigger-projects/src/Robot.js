export default class Robot {
  constructor(name, legs) {
    this.name = name;
    this.legs = legs;
    // this.sayHi()
    console.log(`I am ${this.name }. Thank you creator!`);
  }
  sayHi() {
    console.log(`Hi! I am ${this.name }.`);
  }
}