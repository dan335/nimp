import NodeNumber from '../NodeNumber.js';
import RandomNumberProperties from './RandomNumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';

export default class RandomNumber extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Random Number', RandomNumberProperties);

    this.inputs = [
      new InputNumber(this, 0, 'Regenerate')
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.number = Math.random();
  }


  run() {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    this.number = Math.random();
    super.run();
  }
}
