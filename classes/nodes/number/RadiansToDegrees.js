import NodeNumber from '../NodeNumber.js';
import RadiansToDegreesProperties from './RadiansToDegreesProperties.jsx';
import InputNumberA from '../inputs/InputNumberA.js';
import OutputNumber from '../OutputNumber.js';

export default class RadiansToDegrees extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Radians to Degrees', RadiansToDegreesProperties);

    this.inputs = [
      new InputNumberA(this, 0, 'a'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.a = typeof settings.a !== 'undefined' ? settings.a : null;
  }


  toJson() {
    let json = super.toJson();

    json.settings.a = this.a;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].number == null) {
      this.a = null;
    } else {
      this.a = this.inputs[0].number;
    }

    if (this.a != null && !isNaN(this.a)) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.number = this.a * (180 / Math.PI);
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
