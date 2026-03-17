import NodeImage from '../NodeImage.js';
import BrickPatternProperties from './BrickPatternProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";



export default class BrickPattern extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Brick Pattern', BrickPatternProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Brick Width', 'hasBrickWidth'),
      new InputNumber(this, 3, 'Brick Height', 'hasBrickHeight'),
      new InputNumber(this, 4, 'Gap', 'hasGap')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.brickWidth = typeof settings.brickWidth !== 'undefined' ? settings.brickWidth : 64;
    this.brickHeight = typeof settings.brickHeight !== 'undefined' ? settings.brickHeight : 32;
    this.gap = typeof settings.gap !== 'undefined' ? settings.gap : 2;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.brickWidth = this.brickWidth;
    json.settings.brickHeight = this.brickHeight;
    json.settings.gap = this.gap;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let brickWidth = this.brickWidth;
    let brickHeight = this.brickHeight;
    let gap = this.gap;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      brickWidth = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      brickHeight = this.inputs[3].number;
    }

    if (this.inputs[4].number != null) {
      gap = this.inputs[4].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    brickWidth = Math.max(1, brickWidth);
    brickHeight = Math.max(1, brickHeight);
    gap = Math.max(0, gap);

    const image = new Jimp({ width, height });

    image.scan((x, y, idx) => {
      const row = Math.floor(y / (brickHeight + gap));
      const offsetX = (row % 2) * (brickWidth / 2);
      const localX = ((x + offsetX) % (brickWidth + gap));
      const localY = (y % (brickHeight + gap));
      const isMortar = localX >= brickWidth || localY >= brickHeight;
      const val = isMortar ? 0 : 255;

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
