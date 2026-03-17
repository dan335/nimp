import NodeImage from '../NodeImage.js';
import FBMProperties from './FBMProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";
import SimplexNoise from 'simplex-noise';



export default class FBM extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'FBM Noise', FBMProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Seed', 'hasSeed'),
      new InputNumber(this, 3, 'Scale', 'hasScale'),
      new InputNumber(this, 4, 'Octaves', 'hasOctaves'),
      new InputNumber(this, 5, 'Lacunarity', 'hasLacunarity'),
      new InputNumber(this, 6, 'Gain', 'hasGain')
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
    this.octaves = typeof settings.octaves !== 'undefined' ? settings.octaves : 6;
    this.lacunarity = typeof settings.lacunarity !== 'undefined' ? settings.lacunarity : 2.0;
    this.gain = typeof settings.gain !== 'undefined' ? settings.gain : 0.5;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.seed = this.seed;
    json.settings.scale = this.scale;
    json.settings.octaves = this.octaves;
    json.settings.lacunarity = this.lacunarity;
    json.settings.gain = this.gain;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let seed = this.seed;
    let scale = this.scale;
    let octaves = this.octaves;
    let lacunarity = this.lacunarity;
    let gain = this.gain;

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
      octaves = this.inputs[4].number;
    }

    if (this.inputs[5].number != null) {
      lacunarity = this.inputs[5].number;
    }

    if (this.inputs[6].number != null) {
      gain = this.inputs[6].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    scale = Math.max(0.00001, scale);
    scale = Math.min(5, scale);
    octaves = Math.max(1, Math.round(octaves));

    const image = new Jimp({ width, height });
    const simplex = new SimplexNoise(seed);

    image.scan((x, y, idx) => {
      let amplitude = 1;
      let frequency = 1;
      let total = 0;
      let maxValue = 0;

      for (let i = 0; i < octaves; i++) {
        total += amplitude * simplex.noise2D(x * scale * frequency, y * scale * frequency);
        maxValue += amplitude;
        amplitude *= gain;
        frequency *= lacunarity;
      }

      const noise = Math.round((total / maxValue + 1) / 2 * 255);
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
