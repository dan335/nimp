import NodeColor from '../NodeColor.js';
import RGBProperties from './RGBProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputNumberRed from './InputNumberRed.js';
import InputNumberGreen from './InputNumberGreen.js';
import InputNumberBlue from './InputNumberBlue.js';
import InputNumberAlpha from './InputNumberAlpha.js';


export default class RGBInput extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'RGB Input', RGBProperties);

    this.inputs = [
      new InputNumberRed(this, 0, 'Red'),
      new InputNumberGreen(this, 1, 'Green'),
      new InputNumberBlue(this, 2, 'Blue'),
      new InputNumberAlpha(this, 3, 'Alpha'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
    ];

    this.red = typeof settings.red !== 'undefined' ? settings.red : 255;
    this.green = typeof settings.green !== 'undefined' ? settings.green : 255;
    this.blue = typeof settings.blue !== 'undefined' ? settings.blue : 255;
    this.alpha = typeof settings.alpha !== 'undefined' ? settings.alpha : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.red = this.red;
    json.settings.green = this.green;
    json.settings.blue = this.blue;
    json.settings.alpha = this.alpha;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let red = this.red;
    let green = this.green;
    let blue = this.blue;
    let alpha = this.alpha;

    if (this.inputs[0].number != null) {
      red = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      green = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      blue = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      alpha = this.inputs[3].number;
    }

    red = Math.min(255, Math.max(0, red));
    green = Math.min(255, Math.max(0, green));
    blue = Math.min(255, Math.max(0, blue));
    alpha = Math.min(1, Math.max(0, alpha));

    this.color = tinycolor({ r:red, g:green, b:blue, a:alpha });

    super.run(inputThatTriggered);
  }
}
