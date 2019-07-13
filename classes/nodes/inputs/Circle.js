import NodeImage from '../NodeImage.js';
import CircleProperties from './CircleProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import CircleInputNumberWidth from './CircleInputNumberWidth.js';
import CircleInputNumberHeight from './CircleInputNumberHeight.js';
import Jimp from 'jimp';


export default class Circle extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Circle', CircleProperties);

    this.inputs = [
      new CircleInputNumberWidth(this, 0, 'Width'),
      new CircleInputNumberHeight(this, 1, 'Height'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = 256;
    this.height = 256;
    this.red = 255;
    this.blue = 255;
    this.green = 255;
    this.alpha = 255;

    this.run(null);
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);

    const hexNum = Jimp.rgbaToInt(this.red, this.green, this.blue, this.alpha);

    if (this.isInsideALoop) {
      let image = new Jimp(width, height, hexNum);
      this.image = this.createCircle(image);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, hexNum, (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = this.createCircle(image);
          super.run(inputThatTriggered);
        }
      })
    }

  }


  createCircle(image) {
    let padding = 1;
    let centerX = image.bitmap.width / 2;
    let centerY = image.bitmap.height / 2;
    let radius = Math.min(image.bitmap.width, image.bitmap.height) / 2 - padding;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      let a = x + 0.5 - centerX;
      let b = y + 0.5 - centerY;
      let distance = Math.sqrt(a*a+b*b);

      if (distance < radius) {
        // inside
      } else {
        // outside
        this.bitmap.data[idx+3] = 0;
      }
    })

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
    }

    super.passToChildren();
  }
}
