import NodeImage from '../NodeImage.js';
import AnisotropicBlurProperties from './AnisotropicBlurProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class AnisotropicBlur extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Anisotropic Blur', AnisotropicBlurProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Iterations', 'hasIterationsInput'),
      new InputNumber(this, 2, 'Strength', 'hasStrengthInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.iterations = typeof settings.iterations !== 'undefined' ? settings.iterations : 5;
    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 0.15;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let iterations = this.iterations;
      let strength = this.strength;
      if (this.inputs[1].number != null) iterations = this.inputs[1].number;
      if (this.inputs[2].number != null) strength = this.inputs[2].number;
      iterations = Math.max(1, Math.min(30, Math.round(iterations)));
      strength = Math.max(0.01, Math.min(0.5, strength));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;

      // Work with float buffers
      let current = new Float32Array(w * h * 3);
      const srcData = src.bitmap.data;

      for (let i = 0, j = 0; i < srcData.length; i += 4, j += 3) {
        current[j] = srcData[i];
        current[j + 1] = srcData[i + 1];
        current[j + 2] = srcData[i + 2];
      }

      // Perona-Malik anisotropic diffusion
      const kappa = 30;
      const next = new Float32Array(w * h * 3);

      for (let iter = 0; iter < iterations; iter++) {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const idx = (y * w + x) * 3;

            for (let c = 0; c < 3; c++) {
              const center = current[idx + c];

              // 4-connected neighbors
              const north = y > 0 ? current[((y - 1) * w + x) * 3 + c] - center : 0;
              const south = y < h - 1 ? current[((y + 1) * w + x) * 3 + c] - center : 0;
              const east = x < w - 1 ? current[(y * w + x + 1) * 3 + c] - center : 0;
              const west = x > 0 ? current[(y * w + x - 1) * 3 + c] - center : 0;

              // Edge-stopping function
              const cN = Math.exp(-(north * north) / (kappa * kappa));
              const cS = Math.exp(-(south * south) / (kappa * kappa));
              const cE = Math.exp(-(east * east) / (kappa * kappa));
              const cW = Math.exp(-(west * west) / (kappa * kappa));

              next[idx + c] = center + strength * (cN * north + cS * south + cE * east + cW * west);
            }
          }
        }

        // Swap buffers
        const tmp = current;
        current = next;
        next.set(current);
      }

      const image = src.clone();
      const outData = image.bitmap.data;

      for (let i = 0, j = 0; i < outData.length; i += 4, j += 3) {
        outData[i] = Math.max(0, Math.min(255, Math.round(current[j])));
        outData[i + 1] = Math.max(0, Math.min(255, Math.round(current[j + 1])));
        outData[i + 2] = Math.max(0, Math.min(255, Math.round(current[j + 2])));
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
    json.settings.strength = this.strength;
    return json;
  }
}
