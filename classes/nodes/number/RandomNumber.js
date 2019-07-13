import NodeNumber from '../NodeNumber.js';
import RandomNumberProperties from './RandomNumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';

export default class RandomNumber extends NodeNumber {
  constructor(className, graph, x, y) {
    super(className, graph, x, y, 'Random Number', RandomNumberProperties);

    this.inputs = [
      new InputNumber(this, 0, 'Regenerate')
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.number = Math.random();
  }


  toJson() {
    let json = super.toJson();

    json.number = this.number;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    this.number = Math.random();
    super.run(inputThatTriggered);
  }
}
