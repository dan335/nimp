import NodeImage from '../NodeImage.js';
import QuantizeProperties from './QuantizeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Quantize extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Quantize', QuantizeProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Colors', 'hasColorsInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.colors = typeof settings.colors !== 'undefined' ? settings.colors : 8;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let colors = this.colors;
      if (this.inputs[1].number != null) colors = this.inputs[1].number;
      colors = Math.max(2, Math.min(256, Math.round(colors)));

      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      // Simple uniform quantization per channel
      const levels = Math.max(2, Math.round(Math.pow(colors, 1/3)));
      const step = 255 / (levels - 1);

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.round(Math.round(data[i] / step) * step);
        data[i + 1] = Math.round(Math.round(data[i + 1] / step) * step);
        data[i + 2] = Math.round(Math.round(data[i + 2] / step) * step);
      }

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
    json.settings.colors = this.colors;
    return json;
  }
}
