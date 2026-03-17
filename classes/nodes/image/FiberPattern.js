import NodeImage from '../NodeImage.js';
import FiberPatternProperties from './FiberPatternProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class FiberPattern extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Fiber Pattern', FiberPatternProperties, settings);

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
    this.count = typeof settings.count !== 'undefined' ? settings.count : 80;
    this.length = typeof settings.length !== 'undefined' ? settings.length : 200;
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


  seededRandom(seed) {
    let s = Math.max(1, Math.abs(seed) || 1);
    return function() {
      s = (s * 16807) % 2147483647;
      return s / 2147483647;
    };
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
    const h = height;

    const rng = this.seededRandom(seed);
    const fibers = [];
    for (let i = 0; i < count; i++) {
      const startX = rng() * width;
      fibers.push({
        y: rng() * h,
        startX: startX,
        endX: startX + length * (0.5 + rng() * 0.5),
        amplitude: 2 + rng() * 6,
        frequency: 0.01 + rng() * 0.05,
        phase: rng() * Math.PI * 2,
        brightness: 150 + Math.floor(rng() * 105)
      });
    }

    image.scan((x, y, idx) => {
      let maxBrightness = 0;
      for (const fiber of fibers) {
        if (x < fiber.startX || x > fiber.endX) continue;
        const fiberY = fiber.y + Math.sin(x * fiber.frequency + fiber.phase) * fiber.amplitude;
        const dist = Math.abs(y - fiberY);
        if (dist < 2) {
          const brightness = fiber.brightness * (1 - dist / 2);
          maxBrightness = Math.max(maxBrightness, brightness);
        }
      }
      const val = Math.round(maxBrightness);
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
