import NodeImage from '../NodeImage.js';
import WarpProperties from './WarpProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Warp extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Warp', WarpProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputImage(this, 1, 'Map'),
      new InputNumber(this, 2, 'Strength', 'hasStrength')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 50;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let strength = this.strength;
      if (this.inputs[2].number != null) {
        strength = this.inputs[2].number;
      }

      const src = this.inputs[0].image;
      const map = this.inputs[1].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const mw = map.bitmap.width;
      const mh = map.bitmap.height;
      const image = src.clone();
      const srcData = src.bitmap.data;
      const mapData = map.bitmap.data;
      const data = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const mx = Math.min(x, mw - 1);
          const my = Math.min(y, mh - 1);
          const mapIdx = (my * mw + mx) * 4;
          const offsetX = ((mapData[mapIdx] - 128) / 128) * strength;
          const offsetY = ((mapData[mapIdx + 1] - 128) / 128) * strength;
          const sx = Math.max(0, Math.min(w - 1, Math.round(x + offsetX)));
          const sy = Math.max(0, Math.min(h - 1, Math.round(y + offsetY)));
          const srcIdx = (sy * w + sx) * 4;
          const dstIdx = (y * w + x) * 4;
          data[dstIdx] = srcData[srcIdx];
          data[dstIdx + 1] = srcData[srcIdx + 1];
          data[dstIdx + 2] = srcData[srcIdx + 2];
          data[dstIdx + 3] = srcData[srcIdx + 3];
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
