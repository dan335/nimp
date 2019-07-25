import NodeImage from '../NodeImage.js';
import OutputLevelsProperties from './OutputLevelsProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumberMin from '../inputs/InputNumberMin.js';
import InputNumberMax from '../inputs/InputNumberMax.js';
import Jimp from 'jimp';
const tinycolor = require("tinycolor2");


export default class OutputLevels extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Output Levels', OutputLevelsProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumberMin(this, 1, 'Min'),
      new InputNumberMax(this, 2, 'Min'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.min = typeof settings.min !== 'undefined' ? settings.min : 0;
    this.max = typeof settings.max !== 'undefined' ? settings.max : 255;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let min = this.min;
      let max = this.max;

      if (this.inputs[1].number != null) {
        min = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        max = this.inputs[2].number;
      }

      min = Math.max(0, Math.min(255, min));
      max = Math.max(0, Math.min(255, max));

      min = Math.min(min, max);
      max = Math.max(min, max);

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        this.image = this.levels(image, min, max);
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          this.image = this.levels(image, min, max);
          super.run(inputThatTriggered);
        })
      }
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  levels(image, min, max) {
    const self = this;

    image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
      image.bitmap.data[idx] = self.adjustColor(image.bitmap.data[idx], min, max);
      image.bitmap.data[idx+1] = self.adjustColor(image.bitmap.data[idx+1], min, max);
      image.bitmap.data[idx+2] = self.adjustColor(image.bitmap.data[idx+2], min, max);
    })

    return image;
  }


  adjustColor(value, min, max) {
    const range = max - min;
    const mult = range / 255;
    const newValue = value * mult + min;
    return Math.max(0, Math.min(255, Math.round(newValue)));
  }


  toJson() {
    let json = super.toJson();

    json.settings.min = this.min;
    json.settings.max = this.max;

    return json;
  }
}
