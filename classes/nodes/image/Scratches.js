import NodeImage from '../NodeImage.js';
import ScratchesProperties from './ScratchesProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class Scratches extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Scratches', ScratchesProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Seed', 'hasSeed'),
      new InputNumber(this, 3, 'Count', 'hasCount'),
      new InputNumber(this, 4, 'Length', 'hasLength')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 1;
    this.count = typeof settings.count !== 'undefined' ? settings.count : 50;
    this.length = typeof settings.length !== 'undefined' ? settings.length : 100;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.seed = this.seed;
    json.settings.count = this.count;
    json.settings.length = this.length;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let seed = this.seed;
    let count = this.count;
    let length = this.length;

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
      count = this.inputs[3].number;
    }

    if (this.inputs[4].number != null) {
      length = this.inputs[4].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    count = Math.max(0, Math.floor(count));
    length = Math.max(1, length);

    const image = new Jimp({ width, height });

    // Start with black image (already default)
    // Set all pixels to black with full alpha
    image.scan((x, y, idx) => {
      image.bitmap.data[idx] = 0;
      image.bitmap.data[idx + 1] = 0;
      image.bitmap.data[idx + 2] = 0;
      image.bitmap.data[idx + 3] = 255;
    });

    const rng = this.seededRandom(seed);

    for (let i = 0; i < count; i++) {
      const x1 = Math.floor(rng() * width);
      const y1 = Math.floor(rng() * height);
      const angle = rng() * Math.PI * 2;
      const len = length * (0.5 + rng() * 0.5);
      const x2 = x1 + Math.cos(angle) * len;
      const y2 = y1 + Math.sin(angle) * len;
      const opacity = Math.floor(128 + rng() * 127);

      this.drawLine(image, x1, y1, Math.round(x2), Math.round(y2), opacity);
    }

    this.image = image;
    super.run(inputThatTriggered);
  }


  seededRandom(seed) {
    let s = Math.max(1, Math.abs(seed) || 1);
    return function() {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
  }


  drawLine(image, x0, y0, x1, y1, opacity) {
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    const data = image.bitmap.data;

    let dx = Math.abs(x1 - x0);
    let dy = Math.abs(y1 - y0);
    let sx = x0 < x1 ? 1 : -1;
    let sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    while (true) {
      if (x0 >= 0 && x0 < w && y0 >= 0 && y0 < h) {
        const idx = (y0 * w + x0) * 4;
        const existing = data[idx];
        const val = Math.min(255, Math.max(existing, opacity));
        data[idx] = val;
        data[idx + 1] = val;
        data[idx + 2] = val;
      }

      if (x0 === x1 && y0 === y1) break;

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x0 += sx;
      }
      if (e2 < dx) {
        err += dx;
        y0 += sy;
      }
    }
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
