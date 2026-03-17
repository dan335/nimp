import NodeImage from '../NodeImage.js';
import TileGeneratorProperties from './TileGeneratorProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class TileGenerator extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Tile Generator', TileGeneratorProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidth'),
      new InputNumber(this, 1, 'Height', 'hasHeight'),
      new InputNumber(this, 2, 'Tile Size', 'hasTileSize'),
      new InputNumber(this, 3, 'Gap', 'hasGap')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.tileSize = typeof settings.tileSize !== 'undefined' ? settings.tileSize : 32;
    this.gap = typeof settings.gap !== 'undefined' ? settings.gap : 2;
    this.mode = typeof settings.mode !== 'undefined' ? settings.mode : 'brick';
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let width = this.width;
    let height = this.height;
    let tileSize = this.tileSize;
    let gap = this.gap;

    if (this.inputs[0].number != null) width = this.inputs[0].number;
    if (this.inputs[1].number != null) height = this.inputs[1].number;
    if (this.inputs[2].number != null) tileSize = this.inputs[2].number;
    if (this.inputs[3].number != null) gap = this.inputs[3].number;

    width = Math.max(1, width);
    height = Math.max(1, height);
    tileSize = Math.max(1, tileSize);
    gap = Math.max(0, gap);

    const image = new Jimp({ width, height });
    const data = image.bitmap.data;
    const step = tileSize + gap;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const idx = (y * width + x) * 4;
        let isTile = false;

        if (this.mode === 'brick') {
          const row = Math.floor(y / step);
          const offset = (row % 2) * Math.floor(step / 2);
          const lx = (x + offset) % step;
          const ly = y % step;
          isTile = lx < tileSize && ly < tileSize;
        } else if (this.mode === 'herringbone') {
          // Herringbone: alternating horizontal and vertical tiles
          const tw = tileSize * 2;
          const th = tileSize;
          const unitW = tw + gap;
          const unitH = th + gap;
          const cellY = Math.floor(y / unitH);
          const ly = y % unitH;
          // Offset alternating rows
          const offsetX = (cellY % 2) * (tileSize + Math.floor(gap / 2));
          const ax = ((x + offsetX) % unitW + unitW) % unitW;
          isTile = ax < tw && ly < th;
        } else if (this.mode === 'basketWeave') {
          // Basket weave: alternating horizontal and vertical pairs
          const unit = tileSize * 2 + gap;
          const cx = ((x % unit) + unit) % unit;
          const cy = ((y % unit) + unit) % unit;
          const inTopLeft = cx < tileSize * 2 && cy < tileSize;
          const inBottomRight = cx >= tileSize + gap && cy >= tileSize + gap;
          if (inTopLeft) {
            // Horizontal tile (skip gap in middle)
            isTile = !(gap > 0 && cx >= tileSize && cx < tileSize + gap);
          } else if (inBottomRight) {
            // Vertical tile (skip gap in middle)
            const lx = cx - tileSize - gap;
            const ly = cy - tileSize - gap;
            isTile = lx < tileSize && ly < tileSize * 2;
            if (gap > 0 && ly >= tileSize && ly < tileSize + gap) isTile = false;
          }
        } else if (this.mode === 'hexagon') {
          // Proper hexagon grid using pointy-top hex math
          const size = tileSize / 2;
          const hexH = size * 2;
          const hexW = Math.sqrt(3) * size;
          const stepY = hexH * 0.75 + gap;
          const stepX = hexW + gap;
          const row = Math.floor(y / stepY);
          const offset = (row % 2) * (stepX / 2);
          const cx = ((x - offset) % stepX + stepX) % stepX - stepX / 2;
          const cy = (y % stepY) - stepY / 2;
          // Hexagon test: max(|cx|/w, |cy|/h, (|cx|/w + |cy|/h)) <= 0.5
          const qx = Math.abs(cx) / hexW;
          const qy = Math.abs(cy) / hexH;
          isTile = qx <= 0.5 && qy <= 0.5 && (qx + qy) <= 0.75 - gap / (hexW + hexH);
        }

        const val = isTile ? 255 : 0;
        data[idx] = val;
        data[idx+1] = val;
        data[idx+2] = val;
        data[idx+3] = 255;
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


  toJson() {
    let json = super.toJson();
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.tileSize = this.tileSize;
    json.settings.gap = this.gap;
    json.settings.mode = this.mode;
    return json;
  }
}
