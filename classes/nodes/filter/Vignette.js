import NodeImage from '../NodeImage.js';
import VignetteProperties from './VignetteProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Vignette extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Vignette', VignetteProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Amount', 'hasAmountInput'),
      new InputNumber(this, 2, 'Radius', 'hasRadiusInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.amount = typeof settings.amount !== 'undefined' ? settings.amount : 50;
    this.radius = typeof settings.radius !== 'undefined' ? settings.radius : 0.75;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let amount = this.amount;
      let radius = this.radius;
      if (this.inputs[1].number != null) amount = this.inputs[1].number;
      if (this.inputs[2].number != null) radius = this.inputs[2].number;
      amount = Math.max(-100, Math.min(100, amount));
      radius = Math.max(0.1, Math.min(2, radius));

      const image = this.inputs[0].image.clone();
      const w = image.bitmap.width;
      const h = image.bitmap.height;
      const data = image.bitmap.data;
      const cx = w / 2;
      const cy = h / 2;
      const maxDist = Math.sqrt(cx * cx + cy * cy);
      const scale = amount / 100;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const dx = (x - cx) / cx;
          const dy = (y - cy) / cy;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let factor;
          if (dist < radius) {
            factor = 1;
          } else {
            const t = (dist - radius) / (1.414 - radius);
            factor = 1 - t * scale;
          }
          factor = Math.max(0, Math.min(2, factor));

          const idx = (y * w + x) * 4;
          data[idx] = Math.max(0, Math.min(255, Math.round(data[idx] * factor)));
          data[idx + 1] = Math.max(0, Math.min(255, Math.round(data[idx + 1] * factor)));
          data[idx + 2] = Math.max(0, Math.min(255, Math.round(data[idx + 2] * factor)));
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
    json.settings.radius = this.radius;
    return json;
  }
}
