import NodeImage from '../NodeImage.js';
import GradientMapProperties from './GradientMapProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputColorState from '../InputColorState.js';
const tinycolor = require("tinycolor2");


export default class GradientMap extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Gradient Map', GradientMapProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputColorState(this, 1, 'Color A', 'hasColorAInput'),
      new InputColorState(this, 2, 'Color B', 'hasColorBInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.colorA = typeof settings.colorA !== 'undefined' ? settings.colorA : '#000000';
    this.colorB = typeof settings.colorB !== 'undefined' ? settings.colorB : '#ffffff';
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let colorA = tinycolor(this.colorA);
      let colorB = tinycolor(this.colorB);

      if (this.inputs[1].color != null) {
        colorA = this.inputs[1].color.clone();
      }

      if (this.inputs[2].color != null) {
        colorB = this.inputs[2].color.clone();
      }

      if (!colorA.isValid()) {
        colorA = tinycolor('#000000');
      }

      if (!colorB.isValid()) {
        colorB = tinycolor('#ffffff');
      }

      const rgbA = colorA.toRgb();
      const rgbB = colorB.toRgb();

      const image = this.inputs[0].image.clone();
      image.scan((x, y, idx) => {
        const r = image.bitmap.data[idx];
        const g = image.bitmap.data[idx + 1];
        const b = image.bitmap.data[idx + 2];
        const luminance = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

        image.bitmap.data[idx] = Math.round(rgbA.r + (rgbB.r - rgbA.r) * luminance);
        image.bitmap.data[idx + 1] = Math.round(rgbA.g + (rgbB.g - rgbA.g) * luminance);
        image.bitmap.data[idx + 2] = Math.round(rgbA.b + (rgbB.b - rgbA.b) * luminance);
      });

      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();
    json.settings.colorA = this.colorA;
    json.settings.colorB = this.colorB;
    return json;
  }
}
