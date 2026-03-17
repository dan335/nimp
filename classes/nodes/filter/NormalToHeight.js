import NodeImage from '../NodeImage.js';
import NormalToHeightProperties from './NormalToHeightProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class NormalToHeight extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Normal To Height', NormalToHeightProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Normal Map'),
      new InputNumber(this, 1, 'Iterations', 'hasIterations')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.iterations = typeof settings.iterations !== 'undefined' ? settings.iterations : 64;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let iterations = this.iterations;
      if (this.inputs[1].number != null) iterations = this.inputs[1].number;

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;

      // Extract gradients from normal map
      const dx = new Float32Array(w * h);
      const dy = new Float32Array(w * h);
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          dx[y * w + x] = -(srcData[idx] / 255 * 2 - 1);
          dy[y * w + x] = -(srcData[idx+1] / 255 * 2 - 1);
        }
      }

      // Jacobi iteration
      let height = new Float32Array(w * h);
      let temp = new Float32Array(w * h);
      for (let iter = 0; iter < iterations; iter++) {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const left = x > 0 ? height[y * w + (x-1)] : 0;
            const right = x < w-1 ? height[y * w + (x+1)] : 0;
            const top = y > 0 ? height[(y-1) * w + x] : 0;
            const bottom = y < h-1 ? height[(y+1) * w + x] : 0;
            const dxVal = dx[y * w + x] - (x > 0 ? dx[y * w + (x-1)] : 0);
            const dyVal = dy[y * w + x] - (y > 0 ? dy[(y-1) * w + x] : 0);
            temp[y * w + x] = (left + right + top + bottom + dxVal + dyVal) / 4;
          }
        }
        [height, temp] = [temp, height];
      }

      // Normalize to 0-255
      let minH = Infinity, maxH = -Infinity;
      for (let i = 0; i < height.length; i++) {
        minH = Math.min(minH, height[i]);
        maxH = Math.max(maxH, height[i]);
      }
      const range = maxH - minH || 1;

      // Write to output image
      const image = new Jimp({ width: w, height: h });
      const data = image.bitmap.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const val = Math.round((height[y * w + x] - minH) / range * 255);
          const idx = (y * w + x) * 4;
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
    json.settings.iterations = this.iterations;
    return json;
  }
}
