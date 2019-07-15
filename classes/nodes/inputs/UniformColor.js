import NodeImage from '../NodeImage.js';
import UniformColorProperties from './UniformColorProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';


export default class UniformColor extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Uniform Color', UniformColorProperties);

    this.inputs = [];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.red = typeof settings.red !== 'undefined' ? settings.red : 255;
    this.blue = typeof settings.blue !== 'undefined' ? settings.blue : 255;
    this.green = typeof settings.green !== 'undefined' ? settings.green : 255;
    this.alpha = typeof settings.alpha !== 'undefined' ? settings.alpha : 255;

    this.run(null);
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.red = this.red;
    json.settings.blue = this.blue;
    json.settings.green = this.green;
    json.settings.alpha = this.alpha;

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
