import NodeNumber from '../NodeNumber.js';
import ClampNumberProperties from './ClampNumberProperties.jsx';
import InputNumber from '../InputNumber.js';
import OutputNumber from '../OutputNumber.js';

export default class ClampNumber extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Clamp', ClampNumberProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Value', 'hasValue'),
      new InputNumber(this, 1, 'Min', 'hasMin'),
      new InputNumber(this, 2, 'Max', 'hasMax'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.value = typeof settings.value !== 'undefined' ? settings.value : 0;
    this.min = typeof settings.min !== 'undefined' ? settings.min : 0;
    this.max = typeof settings.max !== 'undefined' ? settings.max : 1;
  }


  toJson() {
    let json = super.toJson();
    json.settings.value = this.value;
    json.settings.min = this.min;
    json.settings.max = this.max;
    return json;
  }


  run(inputThatTriggered) {
    let value = this.value;
    let min = this.min;
    let max = this.max;

    if (this.inputs[0].number != null) value = this.inputs[0].number;
    if (this.inputs[1].number != null) min = this.inputs[1].number;
    if (this.inputs[2].number != null) max = this.inputs[2].number;

    this.bg.classList.add('running');
    this.runTimer = Date.now();
    this.number = Math.min(max, Math.max(min, value));
    super.run(inputThatTriggered);
  }
}
