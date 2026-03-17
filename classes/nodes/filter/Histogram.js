import NodeImage from '../NodeImage.js';
import HistogramProperties from './HistogramProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import { Jimp } from "jimp";


export default class Histogram extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Histogram', HistogramProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const src = this.inputs[0].image;
      const srcData = src.bitmap.data;

      // Build histograms
      const histR = new Array(256).fill(0);
      const histG = new Array(256).fill(0);
      const histB = new Array(256).fill(0);
      const histL = new Array(256).fill(0);

      for (let i = 0; i < srcData.length; i += 4) {
        const r = srcData[i];
        const g = srcData[i + 1];
        const b = srcData[i + 2];
        histR[r]++;
        histG[g]++;
        histB[b]++;
        const lum = Math.round(r * 0.299 + g * 0.587 + b * 0.114);
        histL[lum]++;
      }

      // Find max for normalization
      let maxCount = 0;
      for (let i = 0; i < 256; i++) {
        maxCount = Math.max(maxCount, histR[i], histG[i], histB[i], histL[i]);
      }

      // Draw histogram: 256x200 image
      const w = 256;
      const h = 200;
      const image = new Jimp({ width: w, height: h, color: 0x222222ff });
      const data = image.bitmap.data;

      for (let x = 0; x < 256; x++) {
        const rH = Math.round((histR[x] / maxCount) * h);
        const gH = Math.round((histG[x] / maxCount) * h);
        const bH = Math.round((histB[x] / maxCount) * h);
        const lH = Math.round((histL[x] / maxCount) * h);

        for (let y = 0; y < h; y++) {
          const iy = h - 1 - y;
          const idx = (iy * w + x) * 4;

          let r = data[idx], g = data[idx + 1], b = data[idx + 2];

          if (y < lH) { r = Math.min(255, r + 60); g = Math.min(255, g + 60); b = Math.min(255, b + 60); }
          if (y < rH) { r = Math.min(255, r + 120); }
          if (y < gH) { g = Math.min(255, g + 120); }
          if (y < bH) { b = Math.min(255, b + 120); }

          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
          data[idx + 3] = 255;
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
