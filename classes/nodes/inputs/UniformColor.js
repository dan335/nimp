import NodeImage from '../NodeImage.js';
import UniformColorProperties from './UniformColorProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';


export default class UniformColor extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Uniform Color', UniformColorProperties);

    this.inputs = [];
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

    this.run();
  }


  run() {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    const hexNum = Jimp.rgbaToInt(this.red, this.green, this.blue, this.alpha);

    new Jimp(this.width, this.height, hexNum, (error, image) => {
      if (error) {
        console.log(error);
      } else {
        this.image = image;
        super.run();
      }
    })
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.node.run();
      })
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.node.run();
      })
    }

    super.passToChildren();
  }
}
