import NodeImage from '../NodeImage.js';
import VibranceProperties from './VibranceProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Vibrance extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Vibrance', VibranceProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Amount', 'hasAmountInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.amount = typeof settings.amount !== 'undefined' ? settings.amount : 50;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let amount = this.amount;
      if (this.inputs[1].number != null) amount = this.inputs[1].number;
      amount = Math.max(-100, Math.min(100, amount));

      const scale = amount / 100;
      const image = this.inputs[0].image.clone();
      const data = image.bitmap.data;

      for (let i = 0; i < data.length; i += 4) {
        const r = data[i] / 255;
        const g = data[i + 1] / 255;
        const b = data[i + 2] / 255;

        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const sat = maxC - minC;

        // Less saturated colors get boosted more
        const boost = scale * (1 - sat);

        const avg = (r + g + b) / 3;
        data[i] = Math.max(0, Math.min(255, Math.round((r + (r - avg) * boost) * 255)));
        data[i + 1] = Math.max(0, Math.min(255, Math.round((g + (g - avg) * boost) * 255)));
        data[i + 2] = Math.max(0, Math.min(255, Math.round((b + (b - avg) * boost) * 255)));
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
