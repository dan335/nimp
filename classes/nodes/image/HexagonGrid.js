import NodeImage from '../NodeImage.js';
import HexagonGridProperties from './HexagonGridProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class HexagonGrid extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Hexagon Grid', HexagonGridProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Cell Size', 'hasCellSize'),
      new InputNumber(this, 3, 'Gap', 'hasGap')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.cellSize = typeof settings.cellSize !== 'undefined' ? settings.cellSize : 30;
    this.gap = typeof settings.gap !== 'undefined' ? settings.gap : 2;
  }


  toJson() {
    let json = super.toJson();

    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.cellSize = this.cellSize;
    json.settings.gap = this.gap;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let cellSize = this.cellSize;
    let gap = this.gap;

    if (this.inputs[0].number != null) {
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      height = this.inputs[1].number;
    }

    if (this.inputs[2].number != null) {
      cellSize = this.inputs[2].number;
    }

    if (this.inputs[3].number != null) {
      gap = this.inputs[3].number;
    }

    width = Math.max(1, width);
    height = Math.max(1, height);
    cellSize = Math.max(1, cellSize);
    gap = Math.max(0, gap);

    const image = new Jimp({ width, height });
    const size = cellSize;
    const sqrt3 = Math.sqrt(3);

    image.scan((x, y, idx) => {
      const q = (x * sqrt3 / 3 - y / 3) / size;
      const r = (y * 2 / 3) / size;

      let rx = Math.round(q);
      let ry = Math.round(r);
      let rz = Math.round(-q - r);

      const qDiff = Math.abs(rx - q);
      const rDiff = Math.abs(ry - r);
      const zDiff = Math.abs(rz - (-q - r));

      if (qDiff > rDiff && qDiff > zDiff) {
        rx = -ry - rz;
      } else if (rDiff > zDiff) {
        ry = -rx - rz;
      }

      const hexCenterX = size * (sqrt3 * rx + sqrt3 / 2 * ry);
      const hexCenterY = size * (3 / 2 * ry);
      const distX = x - hexCenterX;
      const distY = y - hexCenterY;
      const dist = Math.sqrt(distX * distX + distY * distY);
      const innerRadius = size * sqrt3 / 2 - gap;
      const val = dist < innerRadius ? 255 : 0;

      image.bitmap.data[idx] = val;
      image.bitmap.data[idx + 1] = val;
      image.bitmap.data[idx + 2] = val;
      image.bitmap.data[idx + 3] = 255;
    });

    this.image = image;
    super.run(inputThatTriggered);
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      })
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      })
    }

    super.passToChildren();
  }
}
