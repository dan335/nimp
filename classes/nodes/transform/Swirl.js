import NodeImage from '../NodeImage.js';
import SwirlProperties from './SwirlProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";

export default class Swirl extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Swirl', SwirlProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Angle', 'hasAngle'),
      new InputNumber(this, 2, 'Radius', 'hasRadius')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.angle = typeof settings.angle !== 'undefined' ? settings.angle : 180;
    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 0.5;
  }


  toJson() {
    let json = super.toJson();

    json.settings.angle = this.angle;
    json.settings.radius = this.radius;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let angle = this.angle;
      let radius = this.radius;

      if (this.inputs[1].number != null) {
        angle = this.inputs[1].number;
      }
      if (this.inputs[2].number != null) {
        radius = this.inputs[2].number;
      }

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const image = new Jimp({ width: w, height: h });
      const srcData = src.bitmap.data;
      const dstData = image.bitmap.data;
      const cx = w / 2;
      const cy = h / 2;
      const maxRadius = Math.min(w, h) * radius / 2;
      const angleRad = angle * Math.PI / 180;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let srcX, srcY;
          if (dist < maxRadius) {
            const factor = 1 - dist / maxRadius;
            const theta = factor * factor * angleRad;
            const cosT = Math.cos(theta);
            const sinT = Math.sin(theta);
            srcX = Math.round(cx + dx * cosT - dy * sinT);
            srcY = Math.round(cy + dx * sinT + dy * cosT);
          } else {
            srcX = x;
            srcY = y;
          }

          srcX = Math.max(0, Math.min(w - 1, srcX));
          srcY = Math.max(0, Math.min(h - 1, srcY));
          const si = (srcY * w + srcX) * 4;
          const di = (y * w + x) * 4;
          dstData[di] = srcData[si];
          dstData[di+1] = srcData[si+1];
          dstData[di+2] = srcData[si+2];
          dstData[di+3] = srcData[si+3];
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
