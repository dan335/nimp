import NodeColor from '../NodeColor.js';
import ColorInputProperties from './ColorInputProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");


export default class ColorInput extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Color Input', ColorInputProperties, settings);

    this.inputs = [];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
    ];

    this.string = typeof settings.hue !== 'undefined' ? settings.hue : '#fff';
  }


  toJson() {
    let json = super.toJson();

    json.settings.string = this.string;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    // hue = Math.min(255, Math.max(0, hue));
    // saturation = Math.min(255, Math.max(0, saturation));
    // value = Math.min(255, Math.max(0, value));
    // alpha = Math.min(255, Math.max(0, alpha));

    this.color = tinycolor(this.string);

    super.run(inputThatTriggered);
  }
}
