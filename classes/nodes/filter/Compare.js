import NodeImage from '../NodeImage.js';
import CompareProperties from './CompareProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class Compare extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Compare', CompareProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Image A'),
      new InputImage(this, 1, 'Image B'),
      new InputNumber(this, 2, 'Split', 'hasSplitInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.split = typeof settings.split !== 'undefined' ? settings.split : 0.5;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let split = this.split;
      if (this.inputs[2].number != null) split = this.inputs[2].number;
      split = Math.max(0, Math.min(1, split));

      const srcA = this.inputs[0].image;
      const srcB = this.inputs[1].image;
      const w = Math.max(srcA.bitmap.width, srcB.bitmap.width);
      const h = Math.max(srcA.bitmap.height, srcB.bitmap.height);

      const image = new Jimp({ width: w, height: h, color: 0x000000ff });
      const outData = image.bitmap.data;
      const splitX = Math.round(w * split);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const idx = (y * w + x) * 4;
          const src = x < splitX ? srcA : srcB;
          const sw = src.bitmap.width;
          const sh = src.bitmap.height;

          if (x < sw && y < sh) {
            const si = (y * sw + x) * 4;
            outData[idx] = src.bitmap.data[si];
            outData[idx + 1] = src.bitmap.data[si + 1];
            outData[idx + 2] = src.bitmap.data[si + 2];
            outData[idx + 3] = src.bitmap.data[si + 3];
          }

          // Draw split line
          if (Math.abs(x - splitX) < 1) {
            outData[idx] = 255;
            outData[idx + 1] = 255;
            outData[idx + 2] = 255;
            outData[idx + 3] = 255;
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
    json.settings.split = this.split;
    return json;
  }
}
