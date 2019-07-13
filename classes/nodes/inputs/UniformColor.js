import NodeImage from '../NodeImage.js';
import UniformColorProperties from './UniformColorProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';


export default class UniformColor extends NodeImage {
  constructor(className, graph, x, y) {
    super(className, graph, x, y, 'Uniform Color', UniformColorProperties);

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

    this.run(null);
  }


  toJson() {
    let json = super.toJson();

    json.width = this.width;
    json.height = this.height;
    json.red = this.red;
    json.blue = this.blue;
    json.green = this.green;
    json.alpha = this.alpha;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    const hexNum = Jimp.rgbaToInt(this.red, this.green, this.blue, this.alpha);

    new Jimp(this.width, this.height, hexNum, (error, image) => {
      if (error) {
        console.log(error);
      } else {
        this.image = image;
        super.run(inputThatTriggered);
      }
    })
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
