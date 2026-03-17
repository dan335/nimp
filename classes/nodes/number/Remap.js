import NodeNumber from '../NodeNumber.js';
import RemapProperties from './RemapProperties.jsx';
import InputNumber from '../InputNumber.js';
import OutputNumber from '../OutputNumber.js';

export default class Remap extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Remap', RemapProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Value', 'hasValue'),
      new InputNumber(this, 1, 'In Min', 'hasInMin'),
      new InputNumber(this, 2, 'In Max', 'hasInMax'),
      new InputNumber(this, 3, 'Out Min', 'hasOutMin'),
      new InputNumber(this, 4, 'Out Max', 'hasOutMax'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.value = typeof settings.value !== 'undefined' ? settings.value : 0.5;
    this.inMin = typeof settings.inMin !== 'undefined' ? settings.inMin : 0;
    this.inMax = typeof settings.inMax !== 'undefined' ? settings.inMax : 1;
    this.outMin = typeof settings.outMin !== 'undefined' ? settings.outMin : 0;
    this.outMax = typeof settings.outMax !== 'undefined' ? settings.outMax : 255;
  }


  toJson() {
    let json = super.toJson();
    json.settings.value = this.value;
    json.settings.inMin = this.inMin;
    json.settings.inMax = this.inMax;
    json.settings.outMin = this.outMin;
    json.settings.outMax = this.outMax;
    return json;
  }


  run(inputThatTriggered) {
    let value = this.value;
    let inMin = this.inMin, inMax = this.inMax;
    let outMin = this.outMin, outMax = this.outMax;

    if (this.inputs[0].number != null) value = this.inputs[0].number;
    if (this.inputs[1].number != null) inMin = this.inputs[1].number;
    if (this.inputs[2].number != null) inMax = this.inputs[2].number;
    if (this.inputs[3].number != null) outMin = this.inputs[3].number;
    if (this.inputs[4].number != null) outMax = this.inputs[4].number;

    this.bg.classList.add('running');
    this.runTimer = Date.now();

    const inRange = inMax - inMin;
    if (inRange === 0) {
      this.number = outMin;
    } else {
      const t = (value - inMin) / inRange;
      this.number = outMin + t * (outMax - outMin);
    }

    super.run(inputThatTriggered);
  }
}
