import NodeImage from '../NodeImage.js';
import DirectionalBlurProperties from './DirectionalBlurProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class DirectionalBlur extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Directional Blur', DirectionalBlurProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Angle', 'hasAngle'),
      new InputNumber(this, 2, 'Samples', 'hasSamples')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.angle = typeof settings.angle !== 'undefined' ? settings.angle : 0;
    this.samples = typeof settings.samples !== 'undefined' ? settings.samples : 10;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let angle = this.angle;
      let samples = this.samples;
      if (this.inputs[1].number != null) angle = this.inputs[1].number;
      if (this.inputs[2].number != null) samples = this.inputs[2].number;
      samples = Math.max(1, Math.round(samples));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const data = image.bitmap.data;
      const rad = angle * Math.PI / 180;
      const dx = Math.cos(rad);
      const dy = Math.sin(rad);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let r = 0, g = 0, b = 0, a = 0;
          for (let s = 0; s < samples; s++) {
            const t = s - samples / 2;
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
    json.settings.angle = this.angle;
    json.settings.samples = this.samples;
    return json;
  }
}
