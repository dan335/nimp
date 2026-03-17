import { Jimp } from 'jimp';
import NodeImage from '../NodeImage.js';
import SkewProperties from './SkewProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class Skew extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Skew', SkewProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Shear X', 'hasShearX'),
      new InputNumber(this, 2, 'Shear Y', 'hasShearY')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.shearX = typeof settings.shearX !== 'undefined' ? settings.shearX : 0.3;
    this.shearY = typeof settings.shearY !== 'undefined' ? settings.shearY : 0;
  }


  toJson() {
    let json = super.toJson();

    json.settings.shearX = this.shearX;
    json.settings.shearY = this.shearY;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let shearX = this.shearX;
      let shearY = this.shearY;

      if (this.inputs[1].number != null) {
        shearX = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        shearY = this.inputs[2].number;
      }

      const image = this.inputs[0].image;
      const w = image.bitmap.width;
      const h = image.bitmap.height;
      const result = new Jimp({ width: w, height: h });
      const srcData = image.bitmap.data;
      const dstData = result.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const srcX = Math.round(x - y * shearX);
          const srcY = Math.round(y - x * shearY);
          if (srcX >= 0 && srcX < w && srcY >= 0 && srcY < h) {
            const srcIdx = (srcY * w + srcX) * 4;
            const dstIdx = (y * w + x) * 4;
            dstData[dstIdx] = srcData[srcIdx];
            dstData[dstIdx+1] = srcData[srcIdx+1];
            dstData[dstIdx+2] = srcData[srcIdx+2];
            dstData[dstIdx+3] = srcData[srcIdx+3];
          }
        }
      }

      this.image = result;
      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
