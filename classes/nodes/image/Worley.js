import NodeImage from '../NodeImage.js';
import WorleyProperties from './WorleyProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import Jimp from 'jimp';
import WorleyNoise from 'worley-noise';



export default class Worley extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Worley Noise', WorleyProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Seed', 'hasSeed'),
      new InputNumber(this, 3, 'Num Points', 'hasNumPoints')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.seed = typeof settings.seed !== 'undefined' ? settings.seed : 1;
    this.numPoints = typeof settings.numPoints !== 'undefined' ? settings.numPoints : 10;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.seed = this.seed;
    json.settings.numPoints = this.numPoints;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let seed = this.seed;
    let numPoints = this.numPoints;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      seed = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
        numPoints = this.inputs[3].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    numPoints = Math.max(1, numPoints);

    if (this.isInsideALoop) {
      let image = new Jimp(width, height);
      this.image = this.writeToImage(image, seed, numPoints);
      super.run(inputThatTriggered);
    } else {
      new Jimp(width, height, (error, image) => {
        if (error) {
          console.log(error);
        } else {
          this.image = this.writeToImage(image, seed, numPoints);
          super.run(inputThatTriggered);
        }
      })
    }
  }


  writeToImage(image, seed, numPoints) {
    let noise = new WorleyNoise({
        numPoints: numPoints,
        seed: seed
    });

    var img = noise.renderImage(image.bitmap.width, {normalize: true});

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      const noise = Math.round(img[y * image.bitmap.width + x] * 255);
      this.bitmap.data[idx] = noise;
      this.bitmap.data[idx+1] = noise;
      this.bitmap.data[idx+2] = noise;
      this.bitmap.data[idx+3] = 255;
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
