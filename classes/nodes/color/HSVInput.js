import NodeColor from '../NodeColor.js';
import HSVInputProperties from './HSVInputProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputNumberHue from './InputNumberHue.js';
import InputNumberSaturation from './InputNumberSaturation.js';
import InputNumberValue from './InputNumberValue.js';
import InputNumberAlpha from './InputNumberAlpha.js';


export default class HSVInput extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'HSV Input', HSVInputProperties);

    this.inputs = [
      new InputNumberHue(this, 0, 'Hue'),
      new InputNumberSaturation(this, 1, 'Saturation'),
      new InputNumberValue(this, 2, 'Value'),
      new InputNumberAlpha(this, 3, 'Alpha'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
    ];

    this.hue = typeof settings.hue !== 'undefined' ? settings.hue : 0;
    this.saturation = typeof settings.saturation !== 'undefined' ? settings.saturation : 0.5;
    this.value = typeof settings.value !== 'undefined' ? settings.value : 0.5;
    this.alpha = typeof settings.alpha !== 'undefined' ? settings.alpha : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.hue = this.hue;
    json.settings.saturation = this.saturation;
    json.settings.value = this.value;
    json.settings.alpha = this.alpha;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let hue = this.hue;
    let saturation = this.saturation;
    let value = this.value;
    let alpha = this.alpha;

    if (this.inputs[0].number != null) {
      hue = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      saturation = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      value = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      alpha = this.inputs[3].number;
    }

    // hue = Math.min(255, Math.max(0, hue));
    // saturation = Math.min(255, Math.max(0, saturation));
    // value = Math.min(255, Math.max(0, value));
    // alpha = Math.min(255, Math.max(0, alpha));

    this.color = tinycolor({ h:hue, s:saturation, v:value, a:alpha });

    super.run(inputThatTriggered);
  }
}
