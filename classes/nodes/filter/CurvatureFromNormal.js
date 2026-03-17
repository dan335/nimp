import NodeImage from '../NodeImage.js';
import CurvatureFromNormalProperties from './CurvatureFromNormalProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class CurvatureFromNormal extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Curvature From Normal', CurvatureFromNormalProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Normal Map'),
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
      const image = new Jimp({ width: w, height: h });
      const data = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const nx = srcData[idx] / 255 * 2 - 1;
          const ny = srcData[idx+1] / 255 * 2 - 1;

          // Get neighbors
          const rightIdx = (y * w + Math.min(w-1, x+1)) * 4;
          const bottomIdx = (Math.min(h-1, y+1) * w + x) * 4;
          const nxR = srcData[rightIdx] / 255 * 2 - 1;
          const nyB = srcData[bottomIdx] / 255 * 2 - 1;

          const divergence = ((nxR - nx) + (nyB - ny)) * strength;
          const val = Math.max(0, Math.min(255, Math.round(divergence * 128 + 128)));

          data[idx] = val;
          data[idx+1] = val;
          data[idx+2] = val;
          data[idx+3] = 255;
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
