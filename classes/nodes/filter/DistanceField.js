import NodeImage from '../NodeImage.js';
import DistanceFieldProperties from './DistanceFieldProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class DistanceField extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Distance Field', DistanceFieldProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Threshold', 'hasThreshold')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.threshold = typeof settings.threshold !== 'undefined' ? settings.threshold : 128;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let threshold = this.threshold;
      if (this.inputs[1].number != null) {
        threshold = this.inputs[1].number;
      }
      threshold = Math.max(0, Math.min(255, Math.round(threshold)));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;

      // Create binary image from threshold
      const binary = new Uint8Array(w * h);
      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        const lum = (srcData[idx] + srcData[idx + 1] + srcData[idx + 2]) / 3;
        binary[i] = lum >= threshold ? 1 : 0;
      }

      // Distance transform using chamfer distance (forward/backward pass)
      const dist = new Float32Array(w * h);
      const INF = w + h;
      dist.fill(INF);

      // Forward pass
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = y * w + x;
          if (binary[i]) {
            dist[i] = 0;
          } else {
            if (x > 0) dist[i] = Math.min(dist[i], dist[i - 1] + 1);
            if (y > 0) dist[i] = Math.min(dist[i], dist[(y - 1) * w + x] + 1);
            if (x > 0 && y > 0) dist[i] = Math.min(dist[i], dist[(y - 1) * w + (x - 1)] + 1.414);
            if (x < w - 1 && y > 0) dist[i] = Math.min(dist[i], dist[(y - 1) * w + (x + 1)] + 1.414);
          }
        }
      }

      // Backward pass
      for (let y = h - 1; y >= 0; y--) {
        for (let x = w - 1; x >= 0; x--) {
          const i = y * w + x;
          if (x < w - 1) dist[i] = Math.min(dist[i], dist[i + 1] + 1);
          if (y < h - 1) dist[i] = Math.min(dist[i], dist[(y + 1) * w + x] + 1);
          if (x < w - 1 && y < h - 1) dist[i] = Math.min(dist[i], dist[(y + 1) * w + (x + 1)] + 1.414);
          if (x > 0 && y < h - 1) dist[i] = Math.min(dist[i], dist[(y + 1) * w + (x - 1)] + 1.414);
        }
      }

      // Normalize and write output
      let maxDist = 0;
      for (let i = 0; i < dist.length; i++) maxDist = Math.max(maxDist, dist[i]);
      maxDist = maxDist || 1;

      const image = src.clone();
      const data = image.bitmap.data;
      for (let i = 0; i < w * h; i++) {
        const val = Math.round((1 - dist[i] / maxDist) * 255);
        const idx = i * 4;
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
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
    json.settings.threshold = this.threshold;
    return json;
  }
}
