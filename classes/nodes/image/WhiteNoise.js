import NodeImage from '../NodeImage.js';
import WhiteNoiseProperties from './WhiteNoiseProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';

export default class WhiteNoise extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'White Noise', WhiteNoiseProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Seed', 'hasSeedInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 0;
  }

  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.seed = this.seed;
    return json;
  }

  // Simple seeded PRNG (mulberry32)
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
    let seed = this.seed;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) seed = this.inputs[2].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));

    const image = new Jimp({ width, height, color: 0x000000ff });
    const data = image.bitmap.data;
    const rand = this.mulberry32(seed);

    for (let i = 0; i < data.length; i += 4) {
      const v = (rand() * 256) | 0;
      data[i] = v;
      data[i + 1] = (rand() * 256) | 0;
      data[i + 2] = (rand() * 256) | 0;
      data[i + 3] = 255;
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
