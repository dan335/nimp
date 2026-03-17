import NodeImage from '../NodeImage.js';
import ClampProperties from './ClampProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Clamp extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Clamp', ClampProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Min', 'hasMinInput'),
      new InputNumber(this, 2, 'Max', 'hasMaxInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.min = typeof settings.min !== 'undefined' ? settings.min : 0;
    this.max = typeof settings.max !== 'undefined' ? settings.max : 255;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let min = this.min;
      let max = this.max;

      if (this.inputs[1].number != null) {
        min = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        max = this.inputs[2].number;
      }

      min = Math.max(0, Math.min(255, Math.round(min)));
      max = Math.max(0, Math.min(255, Math.round(max)));

      const image = this.inputs[0].image.clone();
      image.scan((x, y, idx) => {
        image.bitmap.data[idx] = Math.max(min, Math.min(max, image.bitmap.data[idx]));
        image.bitmap.data[idx + 1] = Math.max(min, Math.min(max, image.bitmap.data[idx + 1]));
        image.bitmap.data[idx + 2] = Math.max(min, Math.min(max, image.bitmap.data[idx + 2]));
      });

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
    json.settings.min = this.min;
    json.settings.max = this.max;
    return json;
  }
}
