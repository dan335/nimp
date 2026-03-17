import NodeImage from '../NodeImage.js';
import HalftoneProperties from './HalftoneProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Halftone extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Halftone', HalftoneProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Dot Size', 'hasDotSizeInput'),
      new InputNumber(this, 2, 'Angle', 'hasAngleInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.dotSize = typeof settings.dotSize !== 'undefined' ? settings.dotSize : 6;
    this.angle = typeof settings.angle !== 'undefined' ? settings.angle : 45;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let dotSize = this.dotSize;
      let angle = this.angle;
      if (this.inputs[1].number != null) dotSize = this.inputs[1].number;
      if (this.inputs[2].number != null) angle = this.inputs[2].number;
      dotSize = Math.max(2, Math.min(30, Math.round(dotSize)));

      const rad = angle * Math.PI / 180;
      const cosA = Math.cos(rad);
      const sinA = Math.sin(rad);

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          // Rotate coordinates
          const rx = x * cosA + y * sinA;
          const ry = -x * sinA + y * cosA;

          // Find grid cell center
          const cellX = Math.floor(rx / dotSize) * dotSize + dotSize / 2;
          const cellY = Math.floor(ry / dotSize) * dotSize + dotSize / 2;

          // Sample average brightness at cell center (inverse rotate)
          const sx = Math.round(cellX * cosA - cellY * sinA);
          const sy = Math.round(cellX * sinA + cellY * cosA);
          const csx = Math.min(w - 1, Math.max(0, sx));
          const csy = Math.min(h - 1, Math.max(0, sy));
          const si = (csy * w + csx) * 4;
          const brightness = (srcData[si] * 0.299 + srcData[si + 1] * 0.587 + srcData[si + 2] * 0.114) / 255;

          // Distance from cell center
          const dx = rx - cellX;
          const dy = ry - cellY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Dot radius based on brightness (darker = larger dot)
          const maxRadius = dotSize * 0.7;
          const dotRadius = maxRadius * (1 - brightness);

          const idx = (y * w + x) * 4;
          if (dist < dotRadius) {
            outData[idx] = 0;
            outData[idx + 1] = 0;
            outData[idx + 2] = 0;
          } else {
            outData[idx] = 255;
            outData[idx + 1] = 255;
            outData[idx + 2] = 255;
          }
          outData[idx + 3] = 255;
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
    json.settings.dotSize = this.dotSize;
    json.settings.angle = this.angle;
    return json;
  }
}
