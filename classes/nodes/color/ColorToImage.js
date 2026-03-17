import NodeImage from '../NodeImage.js';
import ColorToImageProperties from './ColorToImageProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputColor from '../InputColor.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";
const tinycolor = require("tinycolor2");


export default class ColorToImage extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Color to Image', ColorToImageProperties, settings);

    this.inputs = [
      new InputColor(this, 0, 'Color'),
      new InputNumber(this, 1, 'Width', 'hasWidthInput'),
      new InputNumber(this, 2, 'Height', 'hasHeightInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
    ];

    this.hexColor = typeof settings.hexColor !== 'undefined' ? settings.hexColor : 'hsla(0, 100%, 50%, 1)';
    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
  }


  toJson() {
    let json = super.toJson();
    json.settings.hexColor = this.hexColor;
    json.settings.width = this.width;
    json.settings.height = this.height;
    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let hexColor = this.hexColor;
    let width = this.width;
    let height = this.height;

    if (this.inputs[0].color != null) hexColor = this.inputs[0].color;
    if (this.inputs[1].number != null) width = this.inputs[1].number;
    if (this.inputs[2].number != null) height = this.inputs[2].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));

    const tc = tinycolor(hexColor);
    const rgb = tc.isValid() ? tc.toRgb() : { r: 255, g: 0, b: 0, a: 1 };

    const colorInt = ((rgb.r << 24) | (rgb.g << 16) | (rgb.b << 8) | Math.round(rgb.a * 255)) >>> 0;

    const image = new Jimp({ width, height, color: colorInt });
    this.image = image;
    super.run(inputThatTriggered);
  }
}
