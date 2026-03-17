import NodeImage from '../NodeImage.js';
import SlopeBlurProperties from './SlopeBlurProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class SlopeBlur extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Slope Blur', SlopeBlurProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputImage(this, 1, 'Map'),
      new InputNumber(this, 2, 'Strength', 'hasStrength'),
      new InputNumber(this, 3, 'Samples', 'hasSamples')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 10;
    this.samples = typeof settings.samples !== 'undefined' ? settings.samples : 8;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let strength = this.strength;
      let samples = this.samples;
      if (this.inputs[2].number != null) strength = this.inputs[2].number;
      if (this.inputs[3].number != null) samples = this.inputs[3].number;
      samples = Math.max(1, Math.round(samples));

      const src = this.inputs[0].image;
      const map = this.inputs[1].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const mw = map.bitmap.width;
      const mh = map.bitmap.height;
      const srcData = src.bitmap.data;
      const mapData = map.bitmap.data;
      const image = src.clone();
      const data = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const mx = Math.min(x, mw - 1);
          const my = Math.min(y, mh - 1);
          const mapIdx = (my * mw + mx) * 4;
          const angle = (mapData[mapIdx] / 255) * 2 * Math.PI;
          const dx = Math.cos(angle);
          const dy = Math.sin(angle);

          let r = 0, g = 0, b = 0, a = 0;
          for (let s = 0; s < samples; s++) {
            const t = (s / samples) * strength;
            const sx = Math.round(x + t * dx);
            const sy = Math.round(y + t * dy);
            const cx = Math.max(0, Math.min(w - 1, sx));
            const cy = Math.max(0, Math.min(h - 1, sy));
            const idx = (cy * w + cx) * 4;
            r += srcData[idx];
            g += srcData[idx + 1];
            b += srcData[idx + 2];
            a += srcData[idx + 3];
          }
          const dstIdx = (y * w + x) * 4;
          data[dstIdx] = Math.round(r / samples);
          data[dstIdx + 1] = Math.round(g / samples);
          data[dstIdx + 2] = Math.round(b / samples);
          data[dstIdx + 3] = Math.round(a / samples);
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
    json.settings.samples = this.samples;
    return json;
  }
}
