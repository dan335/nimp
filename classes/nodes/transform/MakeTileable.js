import NodeImage from '../NodeImage.js';
import MakeTileableProperties from './MakeTileableProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class MakeTileable extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Make Tileable', MakeTileableProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Blend Width', 'hasBlendWidth')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.blendWidth = typeof settings.blendWidth !== 'undefined' ? settings.blendWidth : 0.25;
  }


  toJson() {
    let json = super.toJson();

    json.settings.blendWidth = this.blendWidth;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let blendWidth = this.blendWidth;

      if (this.inputs[1].number != null) {
        blendWidth = this.inputs[1].number;
      }

      const image = this.inputs[0].image.clone();
      const w = image.bitmap.width;
      const h = image.bitmap.height;
      const data = image.bitmap.data;
      const srcData = [...this.inputs[0].image.bitmap.data];
      const bw = Math.round(Math.min(0.5, Math.max(0.01, blendWidth)) * w);
      const bh = Math.round(Math.min(0.5, Math.max(0.01, blendWidth)) * h);

      // Horizontal blending
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < bw; x++) {
          const t = (Math.cos(Math.PI * x / bw) + 1) / 2;
          const leftIdx = (y * w + x) * 4;
          const rightIdx = (y * w + (w - bw + x)) * 4;
          for (let c = 0; c < 4; c++) {
            data[leftIdx + c] = Math.round(srcData[leftIdx + c] * (1 - t) + srcData[rightIdx + c] * t);
            data[rightIdx + c] = Math.round(srcData[rightIdx + c] * (1 - t) + srcData[leftIdx + c] * t);
          }
        }
      }

      // Vertical blending (use data from horizontal pass)
      const hData = [...data];
      for (let x = 0; x < w; x++) {
        for (let y = 0; y < bh; y++) {
          const t = (Math.cos(Math.PI * y / bh) + 1) / 2;
          const topIdx = (y * w + x) * 4;
          const bottomIdx = ((h - bh + y) * w + x) * 4;
          for (let c = 0; c < 4; c++) {
            data[topIdx + c] = Math.round(hData[topIdx + c] * (1 - t) + hData[bottomIdx + c] * t);
            data[bottomIdx + c] = Math.round(hData[bottomIdx + c] * (1 - t) + hData[topIdx + c] * t);
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
}
