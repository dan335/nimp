import NodeImage from '../NodeImage.js';
import CloudNoiseProperties from './CloudNoiseProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";
import SimplexNoise from 'simplex-noise';


export default class CloudNoise extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Cloud Noise', CloudNoiseProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Seed', 'hasSeed'),
      new InputNumber(this, 3, 'Scale', 'hasScale'),
      new InputNumber(this, 4, 'Warp Strength', 'hasWarpStrength')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 1;
    this.scale = typeof settings.scale !== 'undefined' ? settings.scale : 0.01;
    this.warpStrength = typeof settings.warpStrength !== 'undefined' ? settings.warpStrength : 2;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.seed = this.seed;
    json.settings.scale = this.scale;
    json.settings.warpStrength = this.warpStrength;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let seed = this.seed;
    let scale = this.scale;
    let warpStrength = this.warpStrength;

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
      warpStrength = this.inputs[4].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    scale = Math.max(0.00001, scale);

    const image = new Jimp({ width, height });
    const simplex = new SimplexNoise(seed);
    const simplex2 = new SimplexNoise(seed + 1);

    image.scan((x, y, idx) => {
      // First layer of noise for warping
      const warpX = simplex2.noise2D(x * scale, y * scale) * warpStrength;
      const warpY = simplex2.noise2D(x * scale + 100, y * scale + 100) * warpStrength;

      // FBM with warped coordinates
      let total = 0;
      let amplitude = 1;
      let frequency = 1;
      let maxVal = 0;
      const octaves = 6;

      for (let i = 0; i < octaves; i++) {
        const wx = (x + warpX * 50) * scale * frequency;
        const wy = (y + warpY * 50) * scale * frequency;
        total += amplitude * simplex.noise2D(wx, wy);
        maxVal += amplitude;
        amplitude *= 0.5;
        frequency *= 2;
      }

      const noise = Math.round((total / maxVal + 1) / 2 * 255);
      image.bitmap.data[idx] = noise;
      image.bitmap.data[idx+1] = noise;
      image.bitmap.data[idx+2] = noise;
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
