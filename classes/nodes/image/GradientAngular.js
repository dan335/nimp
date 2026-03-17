import NodeImage from '../NodeImage.js';
import GradientAngularProperties from './GradientAngularProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
const tinycolor = require("tinycolor2");
import InputNumber from '../InputNumber.js';
import InputColorState from '../InputColorState.js';

export default class GradientAngular extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Gradient Angular', GradientAngularProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputColorState(this, 2, 'Color A', 'hasColorAInput'),
      new InputColorState(this, 3, 'Color B', 'hasColorBInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.colorA = typeof settings.colorA !== 'undefined' ? settings.colorA : 'hsla(0, 0, 0, 1)';
    this.colorB = typeof settings.colorB !== 'undefined' ? settings.colorB : 'hsla(0, 0, 1, 1)';
  }

  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.colorA = this.colorA;
    json.settings.colorB = this.colorB;
    return json;
  }

  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let colorA = tinycolor(this.colorA);
    let colorB = tinycolor(this.colorB);

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].color != null) colorA = this.inputs[2].color.clone();
    if (this.inputs[3].color != null) colorB = this.inputs[3].color.clone();

    width = Math.max(1, width);
    height = Math.max(1, height);

    if (!colorA.isValid()) colorA = tinycolor('#000');
    if (!colorB.isValid()) colorB = tinycolor('#fff');

    const rgbA = colorA.toRgb();
    const rgbB = colorB.toRgb();

    const image = new Jimp({ width, height, color: 0x000000ff });
    const cx = width / 2;
    const cy = height / 2;

    image.scan((x, y, idx) => {
      const dx = x - cx;
      const dy = y - cy;
      // atan2 gives -PI to PI, normalize to 0-1
      let angle = Math.atan2(dy, dx);
      let t = (angle + Math.PI) / (2 * Math.PI);

      image.bitmap.data[idx] = Math.round(rgbA.r + (rgbB.r - rgbA.r) * t);
      image.bitmap.data[idx + 1] = Math.round(rgbA.g + (rgbB.g - rgbA.g) * t);
      image.bitmap.data[idx + 2] = Math.round(rgbA.b + (rgbB.b - rgbA.b) * t);
      image.bitmap.data[idx + 3] = Math.round((rgbA.a + (rgbB.a - rgbA.a) * t) * 255);
    });

    this.image = image;
    super.run(inputThatTriggered);
  }

  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      });
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      });
    }
    super.passToChildren();
  }
}
