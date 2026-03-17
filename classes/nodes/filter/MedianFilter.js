import NodeImage from '../NodeImage.js';
import MedianFilterProperties from './MedianFilterProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class MedianFilter extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Median Filter', MedianFilterProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Radius', 'hasRadiusInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let radius = this.radius;
      if (this.inputs[1].number != null) radius = this.inputs[1].number;
      radius = Math.max(1, Math.min(10, Math.round(radius)));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      const size = (2 * radius + 1) * (2 * radius + 1);
      const rArr = new Uint8Array(size);
      const gArr = new Uint8Array(size);
      const bArr = new Uint8Array(size);

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          let count = 0;

          for (let ky = -radius; ky <= radius; ky++) {
            for (let kx = -radius; kx <= radius; kx++) {
              const sx = Math.min(w - 1, Math.max(0, x + kx));
              const sy = Math.min(h - 1, Math.max(0, y + ky));
              const si = (sy * w + sx) * 4;
              rArr[count] = srcData[si];
              gArr[count] = srcData[si + 1];
              bArr[count] = srcData[si + 2];
              count++;
            }
          }

          rArr.sort();
          gArr.sort();
          bArr.sort();

          const mid = count >> 1;
          const idx = (y * w + x) * 4;
          outData[idx] = rArr[mid];
          outData[idx + 1] = gArr[mid];
          outData[idx + 2] = bArr[mid];
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
    json.settings.radius = this.radius;
    return json;
  }
}
