import NodeImage from '../NodeImage.js';
import CurvatureProperties from './CurvatureProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Curvature extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Curvature', CurvatureProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Strength', 'hasStrength')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let strength = this.strength;
      if (this.inputs[1].number != null) {
        strength = this.inputs[1].number;
      }

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const data = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const center = (srcData[idx] + srcData[idx + 1] + srcData[idx + 2]) / 3;

          const tx = Math.max(0, Math.min(w - 1, x));
          const ly = Math.max(0, Math.min(h - 1, y));

          const topIdx = (Math.max(0, y - 1) * w + tx) * 4;
          const botIdx = (Math.min(h - 1, y + 1) * w + tx) * 4;
          const leftIdx = (ly * w + Math.max(0, x - 1)) * 4;
          const rightIdx = (ly * w + Math.min(w - 1, x + 1)) * 4;

          const top = (srcData[topIdx] + srcData[topIdx + 1] + srcData[topIdx + 2]) / 3;
          const bottom = (srcData[botIdx] + srcData[botIdx + 1] + srcData[botIdx + 2]) / 3;
          const left = (srcData[leftIdx] + srcData[leftIdx + 1] + srcData[leftIdx + 2]) / 3;
          const right = (srcData[rightIdx] + srcData[rightIdx + 1] + srcData[rightIdx + 2]) / 3;

          const curvature = (4 * center - top - bottom - left - right) * strength;
          const val = Math.max(0, Math.min(255, Math.round(128 + curvature)));

          data[idx] = val;
          data[idx + 1] = val;
          data[idx + 2] = val;
          data[idx + 3] = srcData[idx + 3];
        }
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
    json.settings.strength = this.strength;
    return json;
  }
}
