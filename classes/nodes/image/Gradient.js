import NodeImage from '../NodeImage.js';
import GradientProperties from './GradientProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import OutputColor from '../OutputColor.js';
import InputNumberWidth from '../inputs/InputNumberWidth.js';
import InputNumberHeight from '../inputs/InputNumberHeight.js';
import InputColorA from '../inputs/InputColorA.js';
import InputColorB from '../inputs/InputColorB.js';
import Jimp from 'jimp';
const tinycolor = require("tinycolor2");


export default class Gradient extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Gradient', GradientProperties);

    this.inputs = [
      new InputNumberWidth(this, 0, 'Width'),
      new InputNumberHeight(this, 1, 'Height'),
      new InputColorA(this, 2, 'Color A'),
      new InputColorB(this, 3, 'Color B'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
      new OutputColor(this, 3, 'Color A'),
      new OutputColor(this, 4, 'Color B'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.colorA = typeof settings.colorA !== 'undefined' ? settings.colorA : 'hsla(0, 0, 0, 1)';
    this.colorB = typeof settings.colorB !== 'undefined' ? settings.colorB : 'hsla(0, 0, 1, 1)';
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.colorA = this.colorA;
    json.settings.colorB = this.colorB;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let colorA = tinycolor(this.colorA);
    let colorB = tinycolor(this.colorB);

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].color != null) {
      colorA = this.inputs[2].color.clone();
    }

    if (this.inputs[3].color != null) {
      colorB = this.inputs[3].color.clone();
    }

    width = Math.max(1, width);
    height = Math.max(1, height);

    if (!colorA.isValid()) {
      colorA = tinycolor('#000');
    }

    if (!colorB.isValid()) {
      colorB = tinycolor('#fff');
    }

    if (this.isInsideALoop) {
      let image = new Jimp(width, height, '#000');
      this.image = this.createGradient(image, colorA, colorB);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, '#000', (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = this.createGradient(image, colorA, colorB);
          super.run(inputThatTriggered);
        }
      })
    }

  }


  createGradient(image, colorA, colorB) {
    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const color = tinycolor.mix(colorA, colorB, y / image.bitmap.height * 100);
      const rgb = color.toRgb();

      this.bitmap.data[idx] = rgb.r;
      this.bitmap.data[idx+1] = rgb.g;
      this.bitmap.data[idx+2] = rgb.b;
      this.bitmap.data[idx+3] = rgb.a * 255;
    })

    return image;
  }


  passToChildren() {
    if (this.image) {
      this.outputs[0].connections.forEach(conn => {
        conn.image = this.image;
        conn.runNode();
      })
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      })
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      })
      this.outputs[3].connections.forEach(conn => {
        let color = tinycolor(this.colorA);
        if (!color.isValid()) {
          color = tinycolor('#000');
        }
        conn.color = color;
        conn.runNode();
      })
      this.outputs[4].connections.forEach(conn => {
        let color = tinycolor(this.colorB);
        if (!color.isValid()) {
          color = tinycolor('#fff');
        }
        conn.color = color;
        conn.runNode();
      })
    }

    super.passToChildren();
  }
}
