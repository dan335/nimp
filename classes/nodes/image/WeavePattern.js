import NodeImage from '../NodeImage.js';
import WeavePatternProperties from './WeavePatternProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class WeavePattern extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Weave Pattern', WeavePatternProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Thread Size', 'hasThreadSize'),
      new InputNumber(this, 3, 'Gap', 'hasGap')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.threadSize = typeof settings.threadSize !== 'undefined' ? settings.threadSize : 8;
    this.gap = typeof settings.gap !== 'undefined' ? settings.gap : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.threadSize = this.threadSize;
    json.settings.gap = this.gap;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let threadSize = this.threadSize;
    let gap = this.gap;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      threadSize = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      gap = this.inputs[3].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    threadSize = Math.max(1, threadSize);
    gap = Math.max(0, gap);

    const image = new Jimp({ width, height });

    image.scan((x, y, idx) => {
      const col = Math.floor(x / (threadSize + gap));
      const row = Math.floor(y / (threadSize + gap));
      const localX = x % (threadSize + gap);
      const localY = y % (threadSize + gap);
      const isGap = localX >= threadSize || localY >= threadSize;

      let val;
      if (isGap) {
        val = 0;
      } else {
        const isWarp = (col + row) % 2 === 0;
        val = isWarp ? 220 : 180;
      }

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
