import NodeColor from '../NodeColor.js';
import SampleProperties from './SampleProperties.jsx';
import OutputColor from '../OutputColor.js';
import InputImage from '../InputImage.js';
import InputNumberX from '../inputs/InputNumberX.js';
import InputNumberY from '../inputs/InputNumberY.js';
const tinycolor = require("tinycolor2");


export default class Sample extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Sample Pixel', SampleProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumberX(this, 1, 'X'),
      new InputNumberY(this, 2, 'Y'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
    ];

    this.xValue = typeof settings.xValue !== 'undefined' ? settings.xValue : 0;
    this.yValue = typeof settings.yValue !== 'undefined' ? settings.yValue : 0;
  }


  toJson() {
    let json = super.toJson();

    json.settings.xValue = this.xValue;
    json.settings.yValue = this.yValue;

    return json;
  }


  run(inputThatTriggered) {
    this.runTimer = Date.now();

    if (this.inputs[0].image && !isNaN(this.xValue) && !isNaN(this.yValue)) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let xValue = this.xValue;
      let yValue = this.yValue;

      if (this.inputs[1].number != null) {
        xValue = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        yValue = this.inputs[2].number;
      }

      xValue = Math.max(0, xValue);
      yValue = Math.max(0, yValue);

      const pixel = this.inputs[0].image.getPixelIndex(xValue, yValue);

      this.color = tinycolor('rgba '+this.inputs[0].image.bitmap.data[pixel]+' '+this.inputs[0].image.bitmap.data[pixel+1]+' '+this.inputs[0].image.bitmap.data[pixel+2]+' '+(this.inputs[0].image.bitmap.data[pixel+3]/255))

      super.run(inputThatTriggered);

    } else {
      this.color = tinycolor('#000');
      super.run(inputThatTriggered);
    }
  }
}
