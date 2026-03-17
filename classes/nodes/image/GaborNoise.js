import NodeImage from '../NodeImage.js';
import GaborNoiseProperties from './GaborNoiseProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';


export default class GaborNoise extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Gabor Noise', GaborNoiseProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Frequency', 'hasFrequencyInput'),
      new InputNumber(this, 3, 'Angle', 'hasAngleInput'),
      new InputNumber(this, 4, 'Seed', 'hasSeedInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.frequency = typeof settings.frequency !== 'undefined' ? settings.frequency : 0.1;
    this.angle = typeof settings.angle !== 'undefined' ? settings.angle : 45;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 0;
  }


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.frequency = this.frequency;
    json.settings.angle = this.angle;
    json.settings.seed = this.seed;
    return json;
  }


  mulberry32(a) {
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      var t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let frequency = this.frequency;
    let angle = this.angle;
    let seed = this.seed;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) frequency = this.inputs[2].number;
    if (this.inputs[3].number != null) angle = this.inputs[3].number;
    if (this.inputs[4].number != null) seed = this.inputs[4].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    frequency = Math.max(0.01, frequency);

    const rad = angle * Math.PI / 180;
    const cosA = Math.cos(rad);
    const sinA = Math.sin(rad);
    const sigma = 1 / (frequency * 2);

    const rand = this.mulberry32(seed);

    // Scatter Gabor kernels
    const numKernels = 100;
    const kernels = [];
    for (let i = 0; i < numKernels; i++) {
      kernels.push({
        x: rand() * width,
        y: rand() * height,
        phase: rand() * Math.PI * 2,
      });
    }

    const image = new Jimp({ width, height, color: 0x808080ff });
    const data = image.bitmap.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let sum = 0;

        for (let k = 0; k < kernels.length; k++) {
          const dx = x - kernels[k].x;
          const dy = y - kernels[k].y;
          const dist2 = dx * dx + dy * dy;

          if (dist2 > sigma * sigma * 16) continue;

          const rotX = dx * cosA + dy * sinA;
          const envelope = Math.exp(-dist2 / (2 * sigma * sigma));
          const wave = Math.cos(2 * Math.PI * frequency * rotX + kernels[k].phase);
          sum += envelope * wave;
        }

        const v = Math.max(0, Math.min(255, Math.round(128 + sum * 20)));
        const idx = (y * width + x) * 4;
        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }

    this.image = image;
    super.run(inputThatTriggered);
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      });
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      });
    }
    super.passToChildren();
  }
}
