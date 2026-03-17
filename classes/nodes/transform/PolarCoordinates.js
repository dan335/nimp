import NodeImage from '../NodeImage.js';
import PolarCoordinatesProperties from './PolarCoordinatesProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import { Jimp } from "jimp";

export default class PolarCoordinates extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Polar Coordinates', PolarCoordinatesProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.mode = typeof settings.mode !== 'undefined' ? settings.mode : 'toPolar';
  }


  toJson() {
    let json = super.toJson();

    json.settings.mode = this.mode;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let mode = this.mode;

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const image = new Jimp({ width: w, height: h });
      const srcData = src.bitmap.data;
      const dstData = image.bitmap.data;
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.sqrt(cx * cx + cy * cy);

      if (mode === 'toPolar') {
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const dx = x - cx;
            const dy = y - cy;
            const radius = Math.sqrt(dx * dx + dy * dy);
            let angle = Math.atan2(dy, dx);
            if (angle < 0) angle += 2 * Math.PI;

            const srcX = Math.round(angle / (2 * Math.PI) * w) % w;
            const srcY = Math.round(radius / maxRadius * h);
            const clampY = Math.max(0, Math.min(h - 1, srcY));
            const si = (clampY * w + srcX) * 4;
            const di = (y * w + x) * 4;
            dstData[di] = srcData[si];
            dstData[di+1] = srcData[si+1];
            dstData[di+2] = srcData[si+2];
            dstData[di+3] = srcData[si+3];
          }
        }
      } else {
        // toCartesian
        for (let y = 0; y < h; y++) {
          for (let x = 0; x < w; x++) {
            const angle = (x / w) * 2 * Math.PI;
            const radius = (y / h) * maxRadius;
            const srcX = Math.round(cx + radius * Math.cos(angle));
            const srcY = Math.round(cy + radius * Math.sin(angle));
            const clampX = Math.max(0, Math.min(w - 1, srcX));
            const clampY = Math.max(0, Math.min(h - 1, srcY));
            const si = (clampY * w + clampX) * 4;
            const di = (y * w + x) * 4;
            dstData[di] = srcData[si];
            dstData[di+1] = srcData[si+1];
            dstData[di+2] = srcData[si+2];
            dstData[di+3] = srcData[si+3];
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
