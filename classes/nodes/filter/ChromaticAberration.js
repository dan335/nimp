import NodeImage from '../NodeImage.js';
import ChromaticAberrationProperties from './ChromaticAberrationProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class ChromaticAberration extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Chromatic Aberration', ChromaticAberrationProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Amount', 'hasAmountInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.amount = typeof settings.amount !== 'undefined' ? settings.amount : 5;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let amount = this.amount;
      if (this.inputs[1].number != null) amount = this.inputs[1].number;
      amount = Math.max(0, Math.min(50, amount));

      const src = this.inputs[0].image;
      const w = src.bitmap.width;
      const h = src.bitmap.height;
      const srcData = src.bitmap.data;
      const image = src.clone();
      const outData = image.bitmap.data;

      const cx = w / 2;
      const cy = h / 2;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = x - cx;
          const dy = y - cy;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = Math.sqrt(cx * cx + cy * cy);
          const factor = (dist / maxDist) * amount;

          const angle = Math.atan2(dy, dx);
          const offsetX = Math.cos(angle) * factor;
          const offsetY = Math.sin(angle) * factor;

          // Red channel - shifted outward
          const rx = Math.min(w - 1, Math.max(0, Math.round(x + offsetX)));
          const ry = Math.min(h - 1, Math.max(0, Math.round(y + offsetY)));

          // Blue channel - shifted inward
          const bx = Math.min(w - 1, Math.max(0, Math.round(x - offsetX)));
          const by = Math.min(h - 1, Math.max(0, Math.round(y - offsetY)));

          const idx = (y * w + x) * 4;
          const rIdx = (ry * w + rx) * 4;
          const bIdx = (by * w + bx) * 4;

          outData[idx] = srcData[rIdx];         // Red from shifted position
          outData[idx + 1] = srcData[idx + 1];  // Green stays
          outData[idx + 2] = srcData[bIdx + 2]; // Blue from opposite shift
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
    json.settings.amount = this.amount;
    return json;
  }
}
