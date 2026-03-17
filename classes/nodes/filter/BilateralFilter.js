import NodeImage from '../NodeImage.js';
import BilateralFilterProperties from './BilateralFilterProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class BilateralFilter extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Bilateral Filter', BilateralFilterProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Radius', 'hasRadiusInput'),
      new InputNumber(this, 2, 'Sigma Space', 'hasSigmaSpaceInput'),
      new InputNumber(this, 3, 'Sigma Color', 'hasSigmaColorInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 3;
    this.sigmaSpace = typeof settings.sigmaSpace !== 'undefined' ? settings.sigmaSpace : 3;
    this.sigmaColor = typeof settings.sigmaColor !== 'undefined' ? settings.sigmaColor : 30;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let radius = this.radius;
      let sigmaSpace = this.sigmaSpace;
      let sigmaColor = this.sigmaColor;

      if (this.inputs[1].number != null) radius = this.inputs[1].number;
      if (this.inputs[2].number != null) sigmaSpace = this.inputs[2].number;
      if (this.inputs[3].number != null) sigmaColor = this.inputs[3].number;

      radius = Math.max(1, Math.min(10, Math.round(radius)));
      sigmaSpace = Math.max(0.1, sigmaSpace);
      sigmaColor = Math.max(0.1, sigmaColor);

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      const spatialFactor = -0.5 / (sigmaSpace * sigmaSpace);
      const colorFactor = -0.5 / (sigmaColor * sigmaColor);

      // Precompute spatial weights
      const spatialWeights = new Float32Array((2 * radius + 1) * (2 * radius + 1));
      for (let ky = -radius; ky <= radius; ky++) {
        for (let kx = -radius; kx <= radius; kx++) {
          const idx = (ky + radius) * (2 * radius + 1) + (kx + radius);
          spatialWeights[idx] = Math.exp((kx * kx + ky * ky) * spatialFactor);
        }
      }

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const ci = (y * w + x) * 4;
          const cr = srcData[ci];
          const cg = srcData[ci + 1];
          const cb = srcData[ci + 2];

          let sumR = 0, sumG = 0, sumB = 0, sumW = 0;

          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              const sx = Math.min(w - 1, Math.max(0, x + kx));
              const sy = Math.min(h - 1, Math.max(0, y + ky));
              const si = (sy * w + sx) * 4;

              const dr = srcData[si] - cr;
              const dg = srcData[si + 1] - cg;
              const db = srcData[si + 2] - cb;
              const colorDist = dr * dr + dg * dg + db * db;

              const sIdx = (ky + radius) * (2 * radius + 1) + (kx + radius);
              const weight = spatialWeights[sIdx] * Math.exp(colorDist * colorFactor);

              sumR += srcData[si] * weight;
              sumG += srcData[si + 1] * weight;
              sumB += srcData[si + 2] * weight;
              sumW += weight;
            }
          }

          outData[ci] = Math.round(sumR / sumW);
          outData[ci + 1] = Math.round(sumG / sumW);
          outData[ci + 2] = Math.round(sumB / sumW);
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
    json.settings.sigmaSpace = this.sigmaSpace;
    json.settings.sigmaColor = this.sigmaColor;
    return json;
  }
}
