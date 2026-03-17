import NodeImage from '../NodeImage.js';
import StarburstPatternProperties from './StarburstPatternProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';


export default class StarburstPattern extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Starburst Pattern', StarburstPatternProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Rays', 'hasRaysInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.rays = typeof settings.rays !== 'undefined' ? settings.rays : 12;
  }


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.rays = this.rays;
    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let rays = this.rays;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) rays = this.inputs[2].number;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    rays = Math.max(2, Math.min(100, Math.round(rays)));

    const image = new Jimp({ width, height, color: 0x000000ff });
    const data = image.bitmap.data;
    const cx = width / 2;
    const cy = height / 2;
    const sliceAngle = Math.PI / rays;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        let angle = Math.atan2(dy, dx) + Math.PI;
        const slice = Math.floor(angle / sliceAngle);
        const v = (slice % 2 === 0) ? 255 : 0;

        const idx = (y * width + x) * 4;
        data[idx] = v;
        data[idx + 1] = v;
        data[idx + 2] = v;
        data[idx + 3] = 255;
      }
    }

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
