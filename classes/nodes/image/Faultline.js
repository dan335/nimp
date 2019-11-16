// https://github.com/barisusakli/faultline

import NodeImage from '../NodeImage.js';
import FaultlineProperties from './FaultlineProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';
import InputNumber from '../InputNumber.js';


export default class Faultline extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Faultline Noise', FaultlineProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Iterations', 'hasIterationsInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.iterations = typeof settings.iterations !== 'undefined' ? settings.iterations : 500;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.iterations = this.iterations;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let iterations = this.iterations;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      iterations = this.inputs[2].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    iterations = Math.max(1, iterations);

    if (this.isInsideALoop) {
      let image = new Jimp(width, height, '#808080');
      this.image = this.createImage(image, iterations);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, '#808080', (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = this.createImage(image, iterations);
          super.run(inputThatTriggered);
        }
      })
    }

  }


  createImage(image, iterations) {
    let heightData = new Array(image.bitmap.width * image.bitmap.height).fill(0);

    for (let i = 0; i < iterations; i++) {
      heightData = this.shiftSide(heightData, image.bitmap.width, image.bitmap.height);
    }

    // find min and max
    let min = 999999;
    let max = -999999;
    heightData.forEach(h => {
      if (h > max) {
        max = h;
      }
      if (h < min) {
        min = h;
      }
    })

    for (let i = 0; i < heightData.length; i++) {
      heightData[i] = Math.floor(this.normalize(heightData[i], min, max) * 255);
    }

    for (let i = 0; i < image.bitmap.height; i++) {
      for (let k = 0; k < image.bitmap.width; k++) {
        const index = k + i * image.bitmap.width;
        const height = heightData[index];
        image.bitmap.data[index * 4] = height;
        image.bitmap.data[index * 4 + 1] = height;
        image.bitmap.data[index * 4 + 2] = height;
      }
    }

    return image;
  }


  // generate random line by picking 2 random points
  // go through all points and raise/lower them depending
  // on which side of the line segment they lie on
  shiftSide(heightData, width, height) {
    const x1 = this.getRandomInt(0, width - 1);
    const y1 = this.getRandomInt(0, height - 1);
    const x2 = this.getRandomInt(0, width - 1);
    const y2 = this.getRandomInt(0, height - 1);

    for (let y = 0; y < height; y++) {
      const stride = y * width;
      for (let x = 0; x < width; x++) {
        const d = this.pointSide(x, y, x1, y1, x2, y2);
        const i = x + stride;
        if (d > 0) {
          heightData[i]++;
        } else if (d < 0) {
          heightData[i]--;
        }
      }
    }

    return heightData;
  }


  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }


  pointSide(x, y, x1, y1, x2, y2) {
    return ((x - x1) * (y2 - y1)) - ((y - y1) * (x2 - x1));
  }


  normalize(num, min, max) {
    return (num - min) / (max - min);
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
