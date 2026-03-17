import NodeImage from '../NodeImage.js';
import AutoLevelsProperties from './AutoLevelsProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class AutoLevels extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Auto Levels', AutoLevelsProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];
  }

  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      // First pass: find min/max per channel
      let minR = 255, maxR = 0;
      let minG = 255, maxG = 0;
      let minB = 255, maxB = 0;

      for (let i = 0; i < data.length; i += 4) {
        minR = Math.min(minR, data[i]);
        maxR = Math.max(maxR, data[i]);
        minG = Math.min(minG, data[i+1]);
        maxG = Math.max(maxG, data[i+1]);
        minB = Math.min(minB, data[i+2]);
        maxB = Math.max(maxB, data[i+2]);
      }

      // Second pass: remap
      const rangeR = maxR - minR || 1;
      const rangeG = maxG - minG || 1;
      const rangeB = maxB - minB || 1;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round((data[i] - minR) / rangeR * 255);
        data[i+1] = Math.round((data[i+1] - minG) / rangeG * 255);
        data[i+2] = Math.round((data[i+2] - minB) / rangeB * 255);
      }

      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
