import NodeNumber from '../NodeNumber.js';
import SliderProperties from './SliderProperties.jsx';
import OutputNumber from '../OutputNumber.js';

export default class Slider extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Slider', SliderProperties, settings);

    this.inputs = [];
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
    super.run(inputThatTriggered);
  }
}
