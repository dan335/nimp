import NodeImage from '../NodeImage.js';
import ColorRangeSelectProperties from './ColorRangeSelectProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
const tinycolor = require("tinycolor2");


export default class ColorRangeSelect extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Color Range Select', ColorRangeSelectProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Tolerance', 'hasToleranceInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.targetColor = typeof settings.targetColor !== 'undefined' ? settings.targetColor : '#ff0000';
    this.tolerance = typeof settings.tolerance !== 'undefined' ? settings.tolerance : 30;
    this.softness = typeof settings.softness !== 'undefined' ? settings.softness : 10;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let tolerance = this.tolerance;
      if (this.inputs[1].number != null) tolerance = this.inputs[1].number;
      tolerance = Math.max(0, Math.min(255, tolerance));

      const softness = Math.max(0, Math.min(100, this.softness));

      const tc = tinycolor(this.targetColor);
      const target = tc.isValid() ? tc.toRgb() : { r: 255, g: 0, b: 0 };

      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      for (let i = 0; i < data.length; i += 4) {
        const dr = data[i] - target.r;
        const dg = data[i + 1] - target.g;
        const db = data[i + 2] - target.b;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);

        let mask;
        if (dist <= tolerance) {
          mask = 255;
        } else if (softness > 0 && dist <= tolerance + softness) {
          mask = Math.round(255 * (1 - (dist - tolerance) / softness));
        } else {
          mask = 0;
        }

        // Output as greyscale mask
        data[i] = mask;
        data[i + 1] = mask;
        data[i + 2] = mask;
        data[i + 3] = 255;
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
    json.settings.targetColor = this.targetColor;
    json.settings.tolerance = this.tolerance;
    json.settings.softness = this.softness;
    return json;
  }
}
