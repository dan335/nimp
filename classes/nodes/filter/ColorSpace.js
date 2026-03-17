import NodeImage from '../NodeImage.js';
import ColorSpaceProperties from './ColorSpaceProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
const tinycolor = require("tinycolor2");


export default class ColorSpace extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Color Space', ColorSpaceProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.fromSpace = typeof settings.fromSpace !== 'undefined' ? settings.fromSpace : 'rgb';
    this.toSpace = typeof settings.toSpace !== 'undefined' ? settings.toSpace : 'hsl';
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;
      const w = image.bitmap.width;
      const h = image.bitmap.height;

      for (let i = 0; i < w * h; i++) {
        const idx = i * 4;
        let r = data[idx], g = data[idx + 1], b = data[idx + 2];

        // If fromSpace is not RGB, interpret channels as that space and convert to RGB first
        if (this.fromSpace === 'hsv') {
          const rgb = tinycolor({h: r / 255 * 360, s: g / 255, v: b / 255}).toRgb();
          r = rgb.r; g = rgb.g; b = rgb.b;
        } else if (this.fromSpace === 'hsl') {
          const rgb = tinycolor({h: r / 255 * 360, s: g / 255, l: b / 255}).toRgb();
          r = rgb.r; g = rgb.g; b = rgb.b;
        }

        // Convert from RGB to target space
        if (this.toSpace === 'rgb') {
          data[idx] = r;
          data[idx + 1] = g;
          data[idx + 2] = b;
        } else if (this.toSpace === 'hsv') {
          const hsv = tinycolor({r, g, b}).toHsv();
          data[idx] = Math.round(hsv.h / 360 * 255);
          data[idx + 1] = Math.round(hsv.s * 255);
          data[idx + 2] = Math.round(hsv.v * 255);
        } else if (this.toSpace === 'hsl') {
          const hsl = tinycolor({r, g, b}).toHsl();
          data[idx] = Math.round(hsl.h / 360 * 255);
          data[idx + 1] = Math.round(hsl.s * 255);
          data[idx + 2] = Math.round(hsl.l * 255);
        }
      }

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
    json.settings.fromSpace = this.fromSpace;
    json.settings.toSpace = this.toSpace;
    return json;
  }
}
