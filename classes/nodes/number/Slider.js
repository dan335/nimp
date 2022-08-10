import NodeNumber from '../NodeNumber.js';
import SliderProperties from './SliderProperties.jsx';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';

export default class Slider extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Slider', SliderProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Min', 'hasMinInput'),
      new InputNumber(this, 1, 'Max', 'hasMaxInput'),
      new InputNumber(this, 2, 'Step', 'hasStepInput'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.number = typeof settings.number !== 'undefined' ? settings.number : 1;
    this.min = typeof settings.min !== 'undefined' ? settings.min : 0;
    this.max = typeof settings.max !== 'undefined' ? settings.max : 10;
    this.step = typeof settings.max !== 'undefined' ? settings.step : 0.01;
  }


  toJson() {
    let json = super.toJson();

    json.settings.number = this.number;
    json.settings.min = this.min;
    json.settings.max = this.max;
    json.settings.step = this.step;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    if (this.inputs[0].number != null) {
      this.min = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      this.max = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      this.step = this.inputs[2].number;
    }

    super.run(inputThatTriggered);
  }
}
