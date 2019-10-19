// todo
// creating the canvas each time is probably slow
// create canvas when node is created


import NodeImage from '../NodeImage.js';
import TriangleProperties from './TriangleProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import OutputColor from '../OutputColor.js';
import InputColor from '../InputColor.js';
import Jimp from 'jimp';
const tinycolor = require("tinycolor2");
import InputNumber from '../InputNumber.js';


export default class Triangle extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Triangle', TriangleProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'x1', 'hasX1Input'),
      new InputNumber(this, 3, 'y1', 'hasY1Input'),
      new InputNumber(this, 4, 'x2', 'hasX2Input'),
      new InputNumber(this, 5, 'y2', 'hasY2Input'),
      new InputNumber(this, 6, 'x3', 'hasX3Input'),
      new InputNumber(this, 7, 'y3', 'hasY3Input'),
      new InputColor(this, 8, 'Color', 'hasColorInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
      new OutputColor(this, 3, 'Color'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.x1 = typeof settings.x1 !== 'undefined' ? settings.x1 : 5;
    this.y1 = typeof settings.y1 !== 'undefined' ? settings.y1 : 50;
    this.x2 = typeof settings.x2 !== 'undefined' ? settings.x2 : 250;
    this.y2 = typeof settings.y2 !== 'undefined' ? settings.y2 : 5;
    this.x3 = typeof settings.x3 !== 'undefined' ? settings.x3 : 200;
    this.y3 = typeof settings.y3 !== 'undefined' ? settings.y3 : 250;
    this.hexColor = typeof settings.hexColor !== 'undefined' ? settings.hexColor : 'hsla(0, 0, 1, 1)';
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.x1 = this.x1;
    json.settings.y1 = this.y1;
    json.settings.x2 = this.x2;
    json.settings.y2 = this.y2;
    json.settings.x3 = this.x3;
    json.settings.y3 = this.y3;
    json.settings.hexColor = this.hexColor;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let x1 = this.x1;
    let y1 = this.y1;
    let x2 = this.x2;
    let y2 = this.y2;
    let x3 = this.x3;
    let y3 = this.y3;
    let hexColor = this.hexColor;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      x1 = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      y1 = this.inputs[3].number;
    }

    if (this.inputs[4].number != null) {
      x2 = this.inputs[4].number;
    }

    if (this.inputs[5].number != null) {
      y2 = this.inputs[5].number;
    }

    if (this.inputs[6].number != null) {
      x3 = this.inputs[6].number;
    }

    if (this.inputs[7].number != null) {
      y3 = this.inputs[7].number;
    }

    if (this.inputs[8].color != null) {
      hexColor = this.inputs[8].color;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);

    const tc = tinycolor(hexColor);
    this.color = '#fff';
    if (tc.isValid()) {
      this.color = tc.toHex8String();
    }

    if (this.isInsideALoop) {
      let image = new Jimp(width, height, 0x00000000);
      this.image = this.createTriangle(image, width, height, x1, y1, x2, y2, x3, y3, this.color);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, 0x00000000, (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = this.createTriangle(image, width, height, x1, y1, x2, y2, x3, y3, this.color);
          super.run(inputThatTriggered);
        }
      })
    }

  }


  createTriangle(image, width, height, x1, y1, x2, y2, x3, y3, color) {
    const temp = document.getElementById('lineCanvas');
    if (temp) {
      temp.remove();
    }

    var canvas = document.createElement('canvas');

    canvas.id = 'lineCanvas';
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.lineTo(x3, y3);
    ctx.fill();

    const imgd = ctx.getImageData(0, 0, width, height);
    image.bitmap.data = imgd.data;

    return image;
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
      this.outputs[3].connections.forEach(conn => {
        conn.color = this.color;
        conn.runNode();
      })
    }

    super.passToChildren();
  }
}
