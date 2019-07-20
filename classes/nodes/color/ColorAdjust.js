import NodeColor from '../NodeColor.js';
import ColorAdjustProperties from './ColorAdjustProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputNumberHue from './InputNumberHue.js';
import InputNumberSaturation from './InputNumberSaturation.js';
import InputNumberLightness from './InputNumberLightness.js';
import InputNumberBrightness from './InputNumberBrightness.js';
import InputColor from '../InputColor.js';


export default class ColorAdjust extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Adjust', ColorAdjustProperties);

    this.inputs = [
      new InputColor(this, 0, 'Input'),
      new InputNumberHue(this, 1, 'Hue'),
      new InputNumberSaturation(this, 2, 'Saturation'),
      new InputNumberLightness(this, 3, 'Lightness'),
      new InputNumberBrightness(this, 4, 'Brightness'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
    ];

    this.hue = typeof settings.hue !== 'undefined' ? settings.hue : 0;
    this.saturation = typeof settings.saturation !== 'undefined' ? settings.saturation : 0;
    this.lightness = typeof settings.lightness !== 'undefined' ? settings.lightness : 0;
    this.brightness = typeof settings.brightness !== 'undefined' ? settings.brightness : 0;
  }


  toJson() {
    let json = super.toJson();

    json.settings.hue = this.hue;
    json.settings.saturation = this.saturation;
    json.settings.lightness = this.lightness;
    json.settings.brightness = this.brightness;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    if (this.inputs[0].color) {
      this.color = this.inputs[0].color.clone();

      let hue = this.hue;
      let saturation = this.saturation;
      let lightness = this.lightness;
      let brightness = this.brightness;

      if (this.inputs[1].number != null) {
        hue = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        saturation = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        lightness = this.inputs[3].number;
      }

      if (this.inputs[4].number != null) {
        brightness = this.inputs[4].number;
      }

      hue = Math.min(360, Math.max(-360, hue));
      saturation = Math.min(1, Math.max(-1, saturation));
      lightness = Math.min(1, Math.max(-1, lightness));
      brightness = Math.min(1, Math.max(-1, brightness));

      saturation *= 100;
      lightness *= 100;
      brightness *= 100;

      if (hue > 0 || hue < 0) {
        this.color = this.color.spin(hue);
      }

      if (saturation > 0) {
        this.color = this.color.saturate(saturation);
      } else if (saturation < 0) {
        this.color = this.color.desaturate(saturation*-1);
      }

      if (lightness > 0) {
        this.color = this.color.lighten(lightness);
      } else if (lightness < 0) {
        this.color = this.color.darken(lightness*-1);
      }

      if (brightness > 0) {
        this.color = this.color.brighten(brightness);
      } else if (lightness < 0) {
        this.color = this.color.darken(brightness*-1);
      }

    } else {
      this.color = tinycolor('#000');
    }

    super.run(inputThatTriggered);
  }
}
