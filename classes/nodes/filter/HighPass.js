import NodeImage from '../NodeImage.js';
import HighPassProperties from './HighPassProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class HighPass extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'High Pass', HighPassProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Radius', 'hasRadiusInput'),
      new InputNumber(this, 2, 'Strength', 'hasStrengthInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 5;
    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let radius = this.radius;
      let strength = this.strength;
      if (this.inputs[1].number != null) radius = this.inputs[1].number;
      if (this.inputs[2].number != null) strength = this.inputs[2].number;
      radius = Math.max(1, Math.round(radius));
      strength = Math.max(0, Math.min(5, strength));

      const original = this.inputs[0].image;
      const blurred = original.clone().blur(radius);
      const image = original.clone();
      const srcData = original.bitmap.data;
      const blurData = blurred.bitmap.data;
      const outData = image.bitmap.data;

      for (let i = 0; i < srcData.length; i += 4) {
        outData[i] = Math.max(0, Math.min(255, Math.round(128 + (srcData[i] - blurData[i]) * strength)));
        outData[i + 1] = Math.max(0, Math.min(255, Math.round(128 + (srcData[i + 1] - blurData[i + 1]) * strength)));
        outData[i + 2] = Math.max(0, Math.min(255, Math.round(128 + (srcData[i + 2] - blurData[i + 2]) * strength)));
        outData[i + 3] = srcData[i + 3];
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
    json.settings.radius = this.radius;
    json.settings.strength = this.strength;
    return json;
  }
}
