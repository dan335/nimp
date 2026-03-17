import NodeImage from '../NodeImage.js';
import PaddingProperties from './PaddingProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";


export default class Padding extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Padding', PaddingProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Top', 'hasTopInput'),
      new InputNumber(this, 2, 'Right', 'hasRightInput'),
      new InputNumber(this, 3, 'Bottom', 'hasBottomInput'),
      new InputNumber(this, 4, 'Left', 'hasLeftInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.top = typeof settings.top !== 'undefined' ? settings.top : 10;
    this.right = typeof settings.right !== 'undefined' ? settings.right : 10;
    this.bottom = typeof settings.bottom !== 'undefined' ? settings.bottom : 10;
    this.left = typeof settings.left !== 'undefined' ? settings.left : 10;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let top = this.top, right = this.right, bottom = this.bottom, left = this.left;
      if (this.inputs[1].number != null) top = this.inputs[1].number;
      if (this.inputs[2].number != null) right = this.inputs[2].number;
      if (this.inputs[3].number != null) bottom = this.inputs[3].number;
      if (this.inputs[4].number != null) left = this.inputs[4].number;

      top = Math.max(0, Math.round(top));
      right = Math.max(0, Math.round(right));
      bottom = Math.max(0, Math.round(bottom));
      left = Math.max(0, Math.round(left));

      const src = this.inputs[0].image;
      const sw = src.bitmap.width;
      const sh = src.bitmap.height;
      const nw = sw + left + right;
      const nh = sh + top + bottom;

      const image = new Jimp({ width: nw, height: nh, color: 0x00000000 });

      // Copy source into padded image
      const srcData = src.bitmap.data;
      const outData = image.bitmap.data;

      for (let y = 0; y < sh; y++) {
        for (let x = 0; x < sw; x++) {
          const si = (y * sw + x) * 4;
          const di = ((y + top) * nw + (x + left)) * 4;
          outData[di] = srcData[si];
          outData[di + 1] = srcData[si + 1];
          outData[di + 2] = srcData[si + 2];
          outData[di + 3] = srcData[si + 3];
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
    json.settings.top = this.top;
    json.settings.right = this.right;
    json.settings.bottom = this.bottom;
    json.settings.left = this.left;
    return json;
  }
}
