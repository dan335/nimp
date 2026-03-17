import NodeImage from '../NodeImage.js';
import GlowProperties from './GlowProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Glow extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Glow', GlowProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Threshold', 'hasThresholdInput'),
      new InputNumber(this, 2, 'Radius', 'hasRadiusInput'),
      new InputNumber(this, 3, 'Intensity', 'hasIntensityInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.threshold = typeof settings.threshold !== 'undefined' ? settings.threshold : 200;
    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 10;
    this.intensity = typeof settings.intensity !== 'undefined' ? settings.intensity : 0.5;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let threshold = this.threshold;
      let radius = this.radius;
      let intensity = this.intensity;
      if (this.inputs[1].number != null) threshold = this.inputs[1].number;
      if (this.inputs[2].number != null) radius = this.inputs[2].number;
      if (this.inputs[3].number != null) intensity = this.inputs[3].number;
      threshold = Math.max(0, Math.min(255, Math.round(threshold)));
      radius = Math.max(1, Math.min(50, Math.round(radius)));
      intensity = Math.max(0, Math.min(2, intensity));

      const src = this.inputs[0].image;
      const srcData = src.bitmap.data;

      // Extract bright areas
      const bright = src.clone();
      const brightData = bright.bitmap.data;

      for (let i = 0; i < brightData.length; i += 4) {
        const lum = brightData[i] * 0.299 + brightData[i + 1] * 0.587 + brightData[i + 2] * 0.114;
        if (lum < threshold) {
          brightData[i] = 0;
          brightData[i + 1] = 0;
          brightData[i + 2] = 0;
        }
      }

      // Blur bright areas
      bright.blur(radius);
      const blurData = bright.bitmap.data;

      // Additive blend
      const image = src.clone();
      const outData = image.bitmap.data;

      for (let i = 0; i < outData.length; i += 4) {
        outData[i] = Math.min(255, Math.round(srcData[i] + blurData[i] * intensity));
        outData[i + 1] = Math.min(255, Math.round(srcData[i + 1] + blurData[i + 1] * intensity));
        outData[i + 2] = Math.min(255, Math.round(srcData[i + 2] + blurData[i + 2] * intensity));
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
    json.settings.threshold = this.threshold;
    json.settings.radius = this.radius;
    json.settings.intensity = this.intensity;
    return json;
  }
}
