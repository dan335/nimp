import NodeImage from '../NodeImage.js';
import GammaProperties from './GammaProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Gamma extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Gamma', GammaProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Gamma', 'hasGammaInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.gamma = typeof settings.gamma !== 'undefined' ? settings.gamma : 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let gamma = this.gamma;
      if (this.inputs[1].number != null) gamma = this.inputs[1].number;
      gamma = Math.max(0.01, Math.min(10, gamma));

      const invGamma = 1 / gamma;

      // Build LUT
      const lut = new Uint8Array(256);
      for (let i = 0; i < 256; i++) {
        lut[i] = Math.round(Math.pow(i / 255, invGamma) * 255);
      }

      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      for (let i = 0; i < data.length; i += 4) {
        data[i] = lut[data[i]];
        data[i + 1] = lut[data[i + 1]];
        data[i + 2] = lut[data[i + 2]];
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
    json.settings.gamma = this.gamma;
    return json;
  }
}
