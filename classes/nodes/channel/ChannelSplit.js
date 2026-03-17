import NodeImage from '../NodeImage.js';
import ChannelSplitProperties from './ChannelSplitProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import { Jimp } from "jimp";


export default class ChannelSplit extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Channel Split', ChannelSplitProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Red'),
      new OutputImage(this, 1, 'Green'),
      new OutputImage(this, 2, 'Blue'),
      new OutputImage(this, 3, 'Alpha'),
    ];
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();

        const images = this.createImages(image);
        this.redImage = images.red;
        this.greenImage = images.green;
        this.blueImage = images.blue;
        this.alphaImage = images.alpha;

        this.image = image;
        super.run(inputThatTriggered);

      } else {
        const image = this.inputs[0].image.clone();
        const images = this.createImages(image);
        this.redImage = images.red;
        this.greenImage = images.green;
        this.blueImage = images.blue;
        this.alphaImage = images.alpha;

        this.image = image;
        super.run(inputThatTriggered);
      }
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  createImages(image) {
    let redImage = new Jimp({ width: image.bitmap.width, height: image.bitmap.height, color: 0x000000ff });
    let greenImage = new Jimp({ width: image.bitmap.width, height: image.bitmap.height, color: 0x000000ff });
    let blueImage = new Jimp({ width: image.bitmap.width, height: image.bitmap.height, color: 0x000000ff });
    let alphaImage = new Jimp({ width: image.bitmap.width, height: image.bitmap.height, color: 0x000000ff });
    image.scan((x, y, idx) => {
      redImage.bitmap.data[idx] = image.bitmap.data[idx];
      redImage.bitmap.data[idx+1] = image.bitmap.data[idx];
      redImage.bitmap.data[idx+2] = image.bitmap.data[idx];
      redImage.bitmap.data[idx+3] = 255;

      greenImage.bitmap.data[idx] = image.bitmap.data[idx+1];
      greenImage.bitmap.data[idx+1] = image.bitmap.data[idx+1];
      greenImage.bitmap.data[idx+2] = image.bitmap.data[idx+1];
      greenImage.bitmap.data[idx+3] = 255;

      blueImage.bitmap.data[idx] = image.bitmap.data[idx+2];
      blueImage.bitmap.data[idx+1] = image.bitmap.data[idx+2];
      blueImage.bitmap.data[idx+2] = image.bitmap.data[idx+2];
      blueImage.bitmap.data[idx+3] = 255;

      alphaImage.bitmap.data[idx] = image.bitmap.data[idx+3];
      alphaImage.bitmap.data[idx+1] = image.bitmap.data[idx+3];
      alphaImage.bitmap.data[idx+2] = image.bitmap.data[idx+3];
      alphaImage.bitmap.data[idx+3] = 255;
    })

    return {
      red: redImage,
      green: greenImage,
      blue: blueImage,
      alpha: alphaImage
    }
  }


  toJson() {
    let json = super.toJson();

    json.settings.radius = this.radius;

    return json;
  }


  passToChildren() {
    this.outputs[0].connections.forEach(conn => {
      if (this.image && this.redImage) {
        conn.image = this.redImage;
        conn.runNode();
      }
    })

    this.outputs[1].connections.forEach(conn => {
      if (this.image && this.greenImage) {
        conn.image = this.greenImage;
        conn.runNode();
      }
    })

    this.outputs[2].connections.forEach(conn => {
      if (this.image && this.blueImage) {
        conn.image = this.blueImage;
        conn.runNode();
      }
    })

    this.outputs[3].connections.forEach(conn => {
      if (this.image && this.alphaImage) {
        conn.image = this.alphaImage;
        conn.runNode();
      }
    })
  }
}
