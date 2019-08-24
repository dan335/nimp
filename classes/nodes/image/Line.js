import NodeImage from '../NodeImage.js';
import LineProperties from './LineProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import OutputColor from '../OutputColor.js';
import InputNumberWidth from '../inputs/InputNumberWidth.js';
import InputNumberHeight from '../inputs/InputNumberHeight.js';
import InputNumberX1 from '../inputs/InputNumberHeight.js';
import InputNumberY1 from '../inputs/InputNumberHeight.js';
import InputNumberX2 from '../inputs/InputNumberHeight.js';
import InputNumberY2 from '../inputs/InputNumberHeight.js';
import InputColor from '../InputColor.js';
import InputNumberLineWidth from '../inputs/InputNumberLineWidth.js';
import Jimp from 'jimp';
const tinycolor = require("tinycolor2");


export default class Line extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Line', LineProperties);

    this.inputs = [
      new InputNumberWidth(this, 0, 'Width'),
      new InputNumberHeight(this, 1, 'Height'),
      new InputNumberX1(this, 2, 'x1'),
      new InputNumberY1(this, 3, 'y1'),
      new InputNumberX2(this, 4, 'x2'),
      new InputNumberY2(this, 5, 'y2'),
      new InputColor(this, 6, 'Color'),
      new InputNumberLineWidth(this, 7, 'Line Width')
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
    this.y1 = typeof settings.y1 !== 'undefined' ? settings.y1 : 5;
    this.x2 = typeof settings.x2 !== 'undefined' ? settings.x2 : 100;
    this.y2 = typeof settings.y2 !== 'undefined' ? settings.y2 : 100;
    this.hexColor = typeof settings.hexColor !== 'undefined' ? settings.hexColor : 'hsla(0, 0, 1, 1)';
    this.lineWidth = typeof settings.lineWidth !== 'undefined' ? settings.lineWidth : 5;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.x1 = this.x1;
    json.settings.y1 = this.y1;
    json.settings.x2 = this.x2;
    json.settings.y2 = this.y2;
    json.settings.hexColor = this.hexColor;
    json.settings.lineWidth = this.lineWidth;

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
    let hexColor = this.hexColor;
    let lineWidth = this.lineWidth;

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

    if (this.inputs[6].color != null) {
      hexColor = this.inputs[6].color;
    }

    if (this.inputs[7].number != null) {
      lineWidth = this.inputs[6].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    x1 = Math.max(0, x1);
    y1 = Math.max(0, y1);
    x2 = Math.max(0, x2);
    y2 = Math.max(0, y2);

    x1 = Math.min(width, x1);
    y1 = Math.min(height, y1);
    x2 = Math.min(width, x2);
    y2 = Math.min(height, y2);

    lineWidth = Math.max(1, lineWidth);

    const tc = tinycolor(hexColor);
    this.color = '#fff';
    if (tc.isValid()) {
      this.color = tc.toHex8String();
    }

    if (this.isInsideALoop) {
      let image = new Jimp(width, height, 0x00000000);
      this.image = this.createLine(image, width, height, x1, y1, x2, y2, this.color, lineWidth);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, 0x00000000, (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = this.createLine(image, width, height, x1, y1, x2, y2, this.color, lineWidth);
          super.run(inputThatTriggered);
        }
      })
    }

  }


  createLine(image, width, height, x1, y1, x2, y2, color, lineWidth) {
    const temp = document.getElementById('lineCanvas');
    if (temp) {
      temp.remove();
    }
    console.log('color', color)
    var canvas = document.createElement('canvas');

    canvas.id = 'lineCanvas';
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    const imgd = ctx.getImageData(0, 0, width, height);
    //const pix = imgd.data;

    image.bitmap.data = imgd.data;

    // image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    //   this.bitmap.data[idx] = pix[]
    // })


    // let centerX = image.bitmap.width / 2;
    // let centerY = image.bitmap.height / 2;
    // let radius = Math.min(image.bitmap.width, image.bitmap.height) / 2 - padding;
    //
    // image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
    //   let a = x + 0.5 - centerX;
    //   let b = y + 0.5 - centerY;
    //   let distance = Math.sqrt(a*a+b*b);
    //
    //   if (distance < radius) {
    //     // inside
    //   } else {
    //     // outside
    //     this.bitmap.data[idx+3] = 0;
    //   }
    // })

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
