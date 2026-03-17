import NodeImage from '../NodeImage.js';
import CheckerProperties from './CheckerProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";



export default class Checker extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Checker', CheckerProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Size', 'hasSize')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.size = typeof settings.size !== 'undefined' ? settings.size : 32;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.size = this.size;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let size = this.size;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      size = this.inputs[2].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    size = Math.max(1, size);

    const image = new Jimp({ width, height });

    image.scan((x, y, idx) => {
      const val = (Math.floor(x / size) + Math.floor(y / size)) % 2 === 0 ? 255 : 0;
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
