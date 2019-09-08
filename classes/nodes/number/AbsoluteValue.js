import NodeNumber from '../NodeNumber.js';
import AbsoluteValueProperties from './AbsoluteValueProperties.jsx';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';

export default class AbsoluteValue extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Absolute Value', AbsoluteValueProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'a', 'hasA'),
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
      this.number = Math.abs(this.a);
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
