import NodeImage from '../NodeImage.js';
import ThresholdProperties from './ThresholdProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Threshold extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Threshold', ThresholdProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Max', 'hasMaxInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.max = typeof settings.max !== 'undefined' ? settings.max : 127;
    this.autoGreyscale = typeof settings.autoGreyscale !== 'undefined' ? settings.autoGreyscale : true;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let max = this.max;
      if (this.inputs[1].number != null) {
        max = this.inputs[1].number;
      }
      max = Math.max(0, Math.min(255, Math.round(max)));

      const image = this.inputs[0].image.clone();
      image.threshold({max, replace: 255, autoGreyscale: this.autoGreyscale});
      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();
    json.settings.max = this.max;
    json.settings.autoGreyscale = this.autoGreyscale;
    return json;
  }
}
