import { Jimp } from 'jimp';
import NodeImage from '../NodeImage.js';
import TileRepeatProperties from './TileRepeatProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class TileRepeat extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Tile Repeat', TileRepeatProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Repeat X', 'hasRepeatX'),
      new InputNumber(this, 2, 'Repeat Y', 'hasRepeatY')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.repeatX = typeof settings.repeatX !== 'undefined' ? settings.repeatX : 2;
    this.repeatY = typeof settings.repeatY !== 'undefined' ? settings.repeatY : 2;
  }


  toJson() {
    let json = super.toJson();

    json.settings.repeatX = this.repeatX;
    json.settings.repeatY = this.repeatY;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let repeatX = this.repeatX;
      let repeatY = this.repeatY;

      if (this.inputs[1].number != null) {
        repeatX = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        repeatY = this.inputs[2].number;
      }

      repeatX = Math.max(1, Math.round(repeatX));
      repeatY = Math.max(1, Math.round(repeatY));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const image = new Jimp({ width: w * repeatX, height: h * repeatY });

      for (let ty = 0; ty < repeatY; ty++) {
        for (let tx = 0; tx < repeatX; tx++) {
          image.blit({ src: src, x: tx * w, y: ty * h });
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
