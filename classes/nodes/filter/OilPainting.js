import NodeImage from '../NodeImage.js';
import OilPaintingProperties from './OilPaintingProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class OilPainting extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Oil Painting', OilPaintingProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Radius', 'hasRadiusInput'),
      new InputNumber(this, 2, 'Levels', 'hasLevelsInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 3;
    this.levels = typeof settings.levels !== 'undefined' ? settings.levels : 20;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let radius = this.radius;
      let levels = this.levels;
      if (this.inputs[1].number != null) radius = this.inputs[1].number;
      if (this.inputs[2].number != null) levels = this.inputs[2].number;
      radius = Math.max(1, Math.min(8, Math.round(radius)));
      levels = Math.max(2, Math.min(50, Math.round(levels)));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      const intensityCount = new Int32Array(levels);
      const avgR = new Float64Array(levels);
      const avgG = new Float64Array(levels);
      const avgB = new Float64Array(levels);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          intensityCount.fill(0);
          avgR.fill(0);
          avgG.fill(0);
          avgB.fill(0);

          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              const sx = Math.min(w - 1, Math.max(0, x + kx));
              const sy = Math.min(h - 1, Math.max(0, y + ky));
              const si = (sy * w + sx) * 4;

              const r = srcData[si];
              const g = srcData[si + 1];
              const b = srcData[si + 2];

              const intensity = Math.round(((r + g + b) / 3) * (levels - 1) / 255);
              intensityCount[intensity]++;
              avgR[intensity] += r;
              avgG[intensity] += g;
              avgB[intensity] += b;
            }
          }

          // Find the most common intensity
          let maxCount = 0;
          let maxIdx = 0;
          for (let i = 0; i < levels; i++) {
            if (intensityCount[i] > maxCount) {
              maxCount = intensityCount[i];
              maxIdx = i;
            }
          }

          const idx = (y * w + x) * 4;
          outData[idx] = Math.round(avgR[maxIdx] / maxCount);
          outData[idx + 1] = Math.round(avgG[maxIdx] / maxCount);
          outData[idx + 2] = Math.round(avgB[maxIdx] / maxCount);
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
    json.settings.radius = this.radius;
    json.settings.levels = this.levels;
    return json;
  }
}
