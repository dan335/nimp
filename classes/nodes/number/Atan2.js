import NodeNumber from '../NodeNumber.js';
import Atan2Properties from './Atan2Properties.jsx';
import InputNumber from '../InputNumber.js';
import OutputNumber from '../OutputNumber.js';

export default class Atan2 extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Atan2', Atan2Properties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'x', 'hasX'),
      new InputNumber(this, 1, 'y', 'hasY'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.numX = typeof settings.numX !== 'undefined' ? settings.numX : null;
    this.numY = typeof settings.numY !== 'undefined' ? settings.numY : null;
  }


  toJson() {
    let json = super.toJson();

    json.settings.numX = this.numX;
    json.settings.numY = this.numY;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].number == null) {
      this.numX = null;
    } else {
      this.numX = this.inputs[0].number;
    }

    if (this.inputs[1].number == null) {
      this.numY = null;
    } else {
      this.numY = this.inputs[1].number;
    }

    if (this.numX != null && !isNaN(this.numX) && this.numY != null && !isNaN(this.numY)) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.number = Math.atan2(this.numY, this.numX);
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
