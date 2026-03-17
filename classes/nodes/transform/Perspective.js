import NodeImage from '../NodeImage.js';
import PerspectiveProperties from './PerspectiveProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";

export default class Perspective extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Perspective', PerspectiveProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Top Scale', 'hasTopScale'),
      new InputNumber(this, 2, 'Bottom Scale', 'hasBottomScale')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.topScale = typeof settings.topScale !== 'undefined' ? settings.topScale : 0.7;
    this.bottomScale = typeof settings.bottomScale !== 'undefined' ? settings.bottomScale : 1.0;
  }


  toJson() {
    let json = super.toJson();

    json.settings.topScale = this.topScale;
    json.settings.bottomScale = this.bottomScale;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let topScale = this.topScale;
      let bottomScale = this.bottomScale;

      if (this.inputs[1].number != null) {
        topScale = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        bottomScale = this.inputs[2].number;
      }

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const image = new Jimp({ width: w, height: h });
      const srcData = src.bitmap.data;
      const dstData = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        const t = h > 1 ? y / (h - 1) : 0;
        const scale = topScale + (bottomScale - topScale) * t;
        const offset = (1 - scale) * w / 2;

        for (let x = 0; x < w; x++) {
          const srcX = Math.round(offset + (x / w) * scale * w);
          const clampX = Math.max(0, Math.min(w - 1, srcX));
          const si = (y * w + clampX) * 4;
          const di = (y * w + x) * 4;
          dstData[di] = srcData[si];
          dstData[di+1] = srcData[si+1];
          dstData[di+2] = srcData[si+2];
          dstData[di+3] = srcData[si+3];
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
}
