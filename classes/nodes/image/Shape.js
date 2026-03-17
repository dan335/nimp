import NodeImage from '../NodeImage.js';
import ShapeProperties from './ShapeProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import { Jimp } from "jimp";
import InputNumber from '../InputNumber.js';
import InputColor from '../InputColor.js';
const tinycolor = require("tinycolor2");


export default class Shape extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Shape', ShapeProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputNumber(this, 2, 'Sides', 'hasSidesInput'),
      new InputNumber(this, 3, 'Inner Radius', 'hasInnerRadiusInput'),
      new InputColor(this, 4, 'Color'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.sides = typeof settings.sides !== 'undefined' ? settings.sides : 6;
    this.innerRadius = typeof settings.innerRadius !== 'undefined' ? settings.innerRadius : 1;
    this.hexColor = typeof settings.hexColor !== 'undefined' ? settings.hexColor : 'hsla(0, 0, 1, 1)';
  }


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.sides = this.sides;
    json.settings.innerRadius = this.innerRadius;
    json.settings.hexColor = this.hexColor;
    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let sides = this.sides;
    let innerRadius = this.innerRadius;
    let hexColor = this.hexColor;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) sides = this.inputs[2].number;
    if (this.inputs[3].number != null) innerRadius = this.inputs[3].number;
    if (this.inputs[4].color != null) hexColor = this.inputs[4].color;

    width = Math.max(1, Math.round(width));
    height = Math.max(1, Math.round(height));
    sides = Math.max(3, Math.min(64, Math.round(sides)));
    innerRadius = Math.max(0.01, Math.min(1, innerRadius));

    const tc = tinycolor(hexColor);
    const rgb = tc.isValid() ? tc.toRgb() : { r: 255, g: 255, b: 255, a: 1 };
    const colorNum = parseInt(tc.isValid() ? tc.toHex8() : 'ffffffff', 16);

    const image = new Jimp({ width, height, color: 0x00000000 });
    const cx = width / 2;
    const cy = height / 2;
    const outerR = Math.min(cx, cy) - 1;

    // Generate polygon vertices (alternating outer/inner for star shapes)
    const vertices = [];
    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * Math.PI * 2 - Math.PI / 2;
      vertices.push({
        x: cx + Math.cos(angle) * outerR,
        y: cy + Math.sin(angle) * outerR
      });

      if (innerRadius < 1) {
        const midAngle = ((i + 0.5) / sides) * Math.PI * 2 - Math.PI / 2;
        vertices.push({
          x: cx + Math.cos(midAngle) * outerR * innerRadius,
          y: cy + Math.sin(midAngle) * outerR * innerRadius
        });
      }
    }

    // Point-in-polygon test using ray casting
    image.scan((x, y, idx) => {
      const px = x + 0.5;
      const py = y + 0.5;
      let inside = false;
      const n = vertices.length;

      for (let i = 0, j = n - 1; i < n; j = i++) {
        const xi = vertices[i].x, yi = vertices[i].y;
        const xj = vertices[j].x, yj = vertices[j].y;

        if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
          inside = !inside;
        }
      }

      if (inside) {
        image.bitmap.data[idx] = rgb.r;
        image.bitmap.data[idx + 1] = rgb.g;
        image.bitmap.data[idx + 2] = rgb.b;
        image.bitmap.data[idx + 3] = Math.round(rgb.a * 255);
      }
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
