import NodeImage from '../NodeImage.js';
import ContentAwareScaleProperties from './ContentAwareScaleProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";

export default class ContentAwareScale extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Content Aware Scale', ContentAwareScaleProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Target Width', 'hasTargetWidth')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.targetWidth = typeof settings.targetWidth !== 'undefined' ? settings.targetWidth : 200;
  }


  toJson() {
    let json = super.toJson();

    json.settings.targetWidth = this.targetWidth;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let targetWidth = this.targetWidth;

      if (this.inputs[1].number != null) {
        targetWidth = this.inputs[1].number;
      }

      targetWidth = Math.max(10, Math.round(targetWidth));

      let currentImage = this.inputs[0].image.clone();

      while (currentImage.bitmap.width > targetWidth) {
        const cw = currentImage.bitmap.width;
        const ch = currentImage.bitmap.height;
        const data = currentImage.bitmap.data;

        // Compute energy (gradient magnitude)
        const energy = new Float32Array(cw * ch);
        for (let y = 0; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
            const idx = (y * cw + x) * 4;
            const left = x > 0 ? (y * cw + x - 1) * 4 : idx;
            const right = x < cw - 1 ? (y * cw + x + 1) * 4 : idx;
            const top = y > 0 ? ((y-1) * cw + x) * 4 : idx;
            const bottom = y < ch - 1 ? ((y+1) * cw + x) * 4 : idx;

            const dx = Math.abs(data[right] - data[left]) + Math.abs(data[right+1] - data[left+1]) + Math.abs(data[right+2] - data[left+2]);
            const dy = Math.abs(data[bottom] - data[top]) + Math.abs(data[bottom+1] - data[top+1]) + Math.abs(data[bottom+2] - data[top+2]);
            energy[y * cw + x] = dx + dy;
          }
        }

        // Find minimum energy seam (dynamic programming)
        const dp = new Float32Array(cw * ch);
        for (let x = 0; x < cw; x++) dp[x] = energy[x];
        for (let y = 1; y < ch; y++) {
          for (let x = 0; x < cw; x++) {
            let minPrev = dp[(y-1) * cw + x];
            if (x > 0) minPrev = Math.min(minPrev, dp[(y-1) * cw + x - 1]);
            if (x < cw - 1) minPrev = Math.min(minPrev, dp[(y-1) * cw + x + 1]);
            dp[y * cw + x] = energy[y * cw + x] + minPrev;
          }
        }

        // Find minimum in last row
        let minVal = Infinity, minX = 0;
        for (let x = 0; x < cw; x++) {
          if (dp[(ch-1) * cw + x] < minVal) {
            minVal = dp[(ch-1) * cw + x];
            minX = x;
          }
        }

        // Trace back the seam
        const seam = new Int32Array(ch);
        seam[ch - 1] = minX;
        for (let y = ch - 2; y >= 0; y--) {
          let x = seam[y + 1];
          let bestX = x;
          let bestVal = dp[y * cw + x];
          if (x > 0 && dp[y * cw + x - 1] < bestVal) {
            bestX = x - 1;
            bestVal = dp[y * cw + x - 1];
          }
          if (x < cw - 1 && dp[y * cw + x + 1] < bestVal) {
            bestX = x + 1;
          }
          seam[y] = bestX;
        }

        // Remove seam - create new image one pixel narrower
        const newImage = new Jimp({ width: cw - 1, height: ch });
        const newData = newImage.bitmap.data;
        for (let y = 0; y < ch; y++) {
          let newX = 0;
          for (let x = 0; x < cw; x++) {
            if (x === seam[y]) continue;
            const srcIdx = (y * cw + x) * 4;
            const dstIdx = (y * (cw - 1) + newX) * 4;
            newData[dstIdx] = data[srcIdx];
            newData[dstIdx+1] = data[srcIdx+1];
            newData[dstIdx+2] = data[srcIdx+2];
            newData[dstIdx+3] = data[srcIdx+3];
            newX++;
          }
        }

        currentImage = newImage;
      }

      this.image = currentImage;
      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
