import NodeColor from '../NodeColor.js';
import HSLInputProperties from './HSLInputProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputNumber from '../InputNumber.js';


export default class HSLInput extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'HSL Input', HSLInputProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Hue', 'hasHueInput'),
      new InputNumber(this, 1, 'Saturation', 'hasSaturationInput'),
      new InputNumber(this, 2, 'Lightness', 'hasLightnessInput'),
      new InputNumber(this, 3, 'Alpha', 'hasAlphaInput'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
    ];

    this.hue = typeof settings.hue !== 'undefined' ? settings.hue : 0;
    this.saturation = typeof settings.saturation !== 'undefined' ? settings.saturation : 0.5;
    this.lightness = typeof settings.lightness !== 'undefined' ? settings.lightness : 0.5;
    this.alpha = typeof settings.alpha !== 'undefined' ? settings.alpha : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.hue = this.hue;
    json.settings.saturation = this.saturation;
    json.settings.lightness = this.lightness;
    json.settings.alpha = this.alpha;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let hue = this.hue;
    let saturation = this.saturation;
    let lightness = this.lightness;
    let alpha = this.alpha;

    if (this.inputs[0].number != null) {
      hue = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      saturation = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      lightness = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      alpha = this.inputs[3].number;
    }

    // hue = Math.min(255, Math.max(0, hue));
    // saturation = Math.min(255, Math.max(0, saturation));
    // value = Math.min(255, Math.max(0, value));
    // alpha = Math.min(255, Math.max(0, alpha));

    this.color = tinycolor({ h:hue, s:saturation, l:lightness, a:alpha });

    super.run(inputThatTriggered);
  }
}
