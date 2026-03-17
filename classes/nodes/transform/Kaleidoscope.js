import NodeImage from '../NodeImage.js';
import KaleidoscopeProperties from './KaleidoscopeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import { Jimp } from "jimp";

export default class Kaleidoscope extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Kaleidoscope', KaleidoscopeProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Segments', 'hasSegments')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.segments = typeof settings.segments !== 'undefined' ? settings.segments : 6;
  }


  toJson() {
    let json = super.toJson();

    json.settings.segments = this.segments;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let segments = this.segments;

      if (this.inputs[1].number != null) {
        segments = this.inputs[1].number;
      }

      segments = Math.max(2, Math.round(segments));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const image = new Jimp({ width: w, height: h });
      const srcData = src.bitmap.data;
      const dstData = image.bitmap.data;
      const cx = w / 2;
      const cy = h / 2;
      const segAngle = (2 * Math.PI) / segments;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          let theta = Math.atan2(dy, dx);
          if (theta < 0) theta += 2 * Math.PI;

          let segIndex = Math.floor(theta / segAngle);
          let localAngle = theta - segIndex * segAngle;
          if (segIndex % 2 === 1) {
            localAngle = segAngle - localAngle;
          }

          const srcX = Math.round(cx + dist * Math.cos(localAngle));
          const srcY = Math.round(cy + dist * Math.sin(localAngle));
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
      this.image = image;
      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
