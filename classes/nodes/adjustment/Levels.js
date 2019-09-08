import NodeImage from '../NodeImage.js';
import LevelsProperties from './LevelsProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import Jimp from 'jimp';
const tinycolor = require("tinycolor2");
import InputNumber from '../InputNumber.js';


export default class Levels extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Input Levels', LevelsProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Min', 'hasMinInput'),
      new InputNumber(this, 2, 'Max', 'hasMaxInput'),
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
    const mult = 255 / range;
    const newValue = value * mult - min * mult;
    return Math.max(0, Math.min(255, Math.round(newValue)));
  }


  toJson() {
    let json = super.toJson();

    json.settings.min = this.min;
    json.settings.max = this.max;

    return json;
  }
}
