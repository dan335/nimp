import NodeImage from '../NodeImage.js';
import CausticsProperties from './CausticsProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";
import SimplexNoise from 'simplex-noise';


export default class Caustics extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Caustics', CausticsProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Seed', 'hasSeed'),
      new InputNumber(this, 3, 'Scale', 'hasScale'),
      new InputNumber(this, 4, 'Intensity', 'hasIntensity')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 1;
    this.scale = typeof settings.scale !== 'undefined' ? settings.scale : 0.02;
    this.intensity = typeof settings.intensity !== 'undefined' ? settings.intensity : 3;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.seed = this.seed;
    json.settings.scale = this.scale;
    json.settings.intensity = this.intensity;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let seed = this.seed;
    let scale = this.scale;
    let intensity = this.intensity;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      seed = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      scale = this.inputs[3].number;
    }

    if (this.inputs[4].number != null) {
      intensity = this.inputs[4].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    scale = Math.max(0.00001, scale);

    const image = new Jimp({ width, height });
    const simplex = new SimplexNoise(seed);

    // Compute height field from simplex noise
    const heights = new Float32Array(width * height);
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        heights[y * width + x] = simplex.noise2D(x * scale, y * scale);
      }
    }

    // Accumulation buffer for caustics
    const accum = new Float32Array(width * height);

    // For each pixel, compute where refracted light lands
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const dhdx = (heights[y * width + x + 1] - heights[y * width + x - 1]) * intensity;
        const dhdy = (heights[(y + 1) * width + x] - heights[(y - 1) * width + x]) * intensity;

        // Refracted position
        const targetX = Math.round(x + dhdx * width * 0.1);
        const targetY = Math.round(y + dhdy * height * 0.1);

        if (targetX >= 0 && targetX < width && targetY >= 0 && targetY < height) {
          accum[targetY * width + targetX] += 1;
        }
      }
    }

    // Normalize
    let maxVal = 0;
    for (let i = 0; i < accum.length; i++) maxVal = Math.max(maxVal, accum[i]);
    maxVal = maxVal || 1;

    // Write to image
    image.scan((x, y, idx) => {
      const val = Math.min(255, Math.round(accum[y * width + x] / maxVal * 255));
      image.bitmap.data[idx] = val;
      image.bitmap.data[idx+1] = val;
      image.bitmap.data[idx+2] = val;
      image.bitmap.data[idx+3] = 255;
    });

    this.image = image;
    super.run(inputThatTriggered);
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      })
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      })
    }

    super.passToChildren();
  }
}
