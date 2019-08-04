import NodeImage from '../NodeImage.js';
import ChannelMergeProperties from './ChannelMergeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';


export default class ChannelMerge extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Channel Merge', ChannelMergeProperties);

    this.inputs = [
      new InputImage(this, 0, 'Red'),
      new InputImage(this, 1, 'Green'),
      new InputImage(this, 2, 'Blue'),
      new InputImage(this, 3, 'Alpha'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image && this.inputs[2].image && this.inputs[3].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      if (this.isInsideALoop) {
        this.image = this.createImage(this.inputs[0].image.clone().greyscale(), this.inputs[1].image.clone().greyscale(), this.inputs[2].image.clone().greyscale(), this.inputs[3].image.clone().greyscale());
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(async image => {
          let red = await Jimp.read(this.inputs[0].image);
          let green = await Jimp.read(this.inputs[1].image);
          let blue = await Jimp.read(this.inputs[2].image);
          let alpha = await Jimp.read(this.inputs[3].image);

          red = await red.greyscale();
          green = await green.greyscale();
          blue = await blue.greyscale();
          alpha = await alpha.greyscale();

          this.image = this.createImage(red, green, blue, alpha);
          super.run(inputThatTriggered);
        })
      }
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  createImage(red, green, blue, alpha) {
    let image = new Jimp(red.bitmap.width, red.bitmap.height, '#000');

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, (x, y, idx) => {
      image.bitmap.data[idx] = red.bitmap.data[idx];
      image.bitmap.data[idx+1] = green.bitmap.data[idx];
      image.bitmap.data[idx+2] = blue.bitmap.data[idx];
      image.bitmap.data[idx+3] = alpha.bitmap.data[idx];
    });

    return image;
  }


  toJson() {
    let json = super.toJson();

    json.settings.radius = this.radius;

    return json;
  }
}
