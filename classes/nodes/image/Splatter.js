import NodeImage from '../NodeImage.js';
import SplatterProperties from './SplatterProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';


export default class Splatter extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Splatter', SplatterProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Count', 'hasCountInput'),
      new InputNumber(this, 3, 'Seed', 'hasSeedInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.count = typeof settings.count !== 'undefined' ? settings.count : 50;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 0;
    this.minRadius = typeof settings.minRadius !== 'undefined' ? settings.minRadius : 3;
    this.maxRadius = typeof settings.maxRadius !== 'undefined' ? settings.maxRadius : 20;
  }


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.count = this.count;
    json.settings.seed = this.seed;
    json.settings.minRadius = this.minRadius;
    json.settings.maxRadius = this.maxRadius;
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
    let count = this.count;
    let seed = this.seed;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) count = this.inputs[2].number;
    if (this.inputs[3].number != null) seed = this.inputs[3].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    count = Math.max(1, Math.min(500, Math.round(count)));

    const rand = this.mulberry32(seed);
    const image = new Jimp({ width, height, color: 0x000000ff });
    const data = image.bitmap.data;

    const minR = Math.max(1, this.minRadius);
    const maxR = Math.max(minR, this.maxRadius);

    // Generate blobs
    const blobs = [];
    for (let i = 0; i < count; i++) {
      blobs.push({
        x: rand() * width,
        y: rand() * height,
        r: minR + rand() * (maxR - minR),
        brightness: Math.round(128 + rand() * 127),
      });
    }

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let maxVal = 0;

        for (let i = 0; i < blobs.length; i++) {
          const dx = x - blobs[i].x;
          const dy = y - blobs[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < blobs[i].r) {
            const falloff = 1 - dist / blobs[i].r;
            const val = falloff * falloff * blobs[i].brightness;
            if (val > maxVal) maxVal = val;
          }
        }

        const v = Math.min(255, Math.round(maxVal));
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
