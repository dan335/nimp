import NodeImage from '../NodeImage.js';
import TilePreviewProperties from './TilePreviewProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class TilePreview extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Tile Preview', TilePreviewProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Tiles', 'hasTilesInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.tiles = typeof settings.tiles !== 'undefined' ? settings.tiles : 3;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let tiles = this.tiles;
      if (this.inputs[1].number != null) tiles = this.inputs[1].number;
      tiles = Math.max(1, Math.min(8, Math.round(tiles)));

      const src = this.inputs[0].image;
      const sw = src.bitmap.width;
      const sh = src.bitmap.height;
      const nw = sw * tiles;
      const nh = sh * tiles;

      const image = new Jimp({ width: nw, height: nh, color: 0x000000ff });
      const srcData = src.bitmap.data;
      const outData = image.bitmap.data;

      for (let ty = 0; ty < tiles; ty++) {
        for (let tx = 0; tx < tiles; tx++) {
          for (let y = 0; y < sh; y++) {
            for (let x = 0; x < sw; x++) {
              const si = (y * sw + x) * 4;
              const di = ((ty * sh + y) * nw + (tx * sw + x)) * 4;
              outData[di] = srcData[si];
              outData[di + 1] = srcData[si + 1];
              outData[di + 2] = srcData[si + 2];
              outData[di + 3] = srcData[si + 3];
            }
          }
        }
      }

      this.image = image;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();
    json.settings.tiles = this.tiles;
    return json;
  }
}
