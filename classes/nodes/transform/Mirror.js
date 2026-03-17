import NodeImage from '../NodeImage.js';
import MirrorProperties from './MirrorProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class Mirror extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Mirror', MirrorProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Axis Position', 'hasAxisPosition')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.axis = typeof settings.axis !== 'undefined' ? settings.axis : 'horizontal';
    this.axisPosition = typeof settings.axisPosition !== 'undefined' ? settings.axisPosition : 0.5;
  }


  toJson() {
    let json = super.toJson();

    json.settings.axis = this.axis;
    json.settings.axisPosition = this.axisPosition;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let axis = this.axis;
      let axisPosition = this.axisPosition;

      if (this.inputs[1].number != null) {
        axisPosition = this.inputs[1].number;
      }

      const image = this.inputs[0].image.clone();
      const w = image.bitmap.width;
      const h = image.bitmap.height;
      const data = [...image.bitmap.data];

      if (axis === 'horizontal') {
        const axisX = Math.floor(w * axisPosition);
        for (let y = 0; y < h; y++) {
          for (let x = axisX; x < w; x++) {
            const mirrorX = 2 * axisX - x - 1;
            if (mirrorX >= 0 && mirrorX < w) {
              const srcIdx = (y * w + mirrorX) * 4;
              const dstIdx = (y * w + x) * 4;
              data[dstIdx] = image.bitmap.data[srcIdx];
              data[dstIdx+1] = image.bitmap.data[srcIdx+1];
              data[dstIdx+2] = image.bitmap.data[srcIdx+2];
              data[dstIdx+3] = image.bitmap.data[srcIdx+3];
            }
          }
        }
      } else {
        const axisY = Math.floor(h * axisPosition);
        for (let y = axisY; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const mirrorY = 2 * axisY - y - 1;
            if (mirrorY >= 0 && mirrorY < h) {
              const srcIdx = (mirrorY * w + x) * 4;
              const dstIdx = (y * w + x) * 4;
              data[dstIdx] = image.bitmap.data[srcIdx];
              data[dstIdx+1] = image.bitmap.data[srcIdx+1];
              data[dstIdx+2] = image.bitmap.data[srcIdx+2];
              data[dstIdx+3] = image.bitmap.data[srcIdx+3];
            }
          }
        }
      }

      image.bitmap.data = Buffer.from(data);
      this.image = image;
      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
