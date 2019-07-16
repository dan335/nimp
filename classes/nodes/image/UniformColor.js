import NodeImage from '../NodeImage.js';
import UniformColorProperties from './UniformColorProperties.jsx';
import OutputImage from '../OutputImage.js';
import UniformColorInputNumberWidth from './UniformColorInputNumberWidth.js';
import UniformColorInputNumberHeight from './UniformColorInputNumberHeight.js';
import InputColor from '../InputColor.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';
const tinycolor = require("tinycolor2");


export default class UniformColor extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Uniform Color', UniformColorProperties);

    this.inputs = [
      new UniformColorInputNumberWidth(this, 0, 'Width'),
      new UniformColorInputNumberHeight(this, 1, 'Height'),
      new InputColor(this, 2, 'Input'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.hexColor = typeof settings.hexColor !== 'undefined' ? settings.hexColor : '#ffffffff';

    this.run(null);
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.hexColor = this.hexColor;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let hexColor = this.hexColor

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].color != null) {
      hexColor = this.inputs[2].color;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);

    const tc = tinycolor(hexColor);
    let color = null;
    if (tc.isValid()) {
      color = tc.toHex8String();
    } else {
      color = '#ffffffff';
    }

    //console.log(bogus)
    //const hexNum = Jimp.rgbaToInt(this.red, this.green, this.blue, this.alpha);

    if (this.isInsideALoop) {
      this.image = new Jimp(width, height, color);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, color, (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = image;
          super.run(inputThatTriggered);
        }
      })
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
