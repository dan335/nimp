import NodeImage from '../NodeImage.js';
import EmbossProperties from './EmbossProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Emboss extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Emboss', EmbossProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Strength', 'hasStrengthInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.strength = typeof settings.strength !== 'undefined' ? settings.strength : 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let strength = this.strength;
      if (this.inputs[1].number != null) {
        strength = this.inputs[1].number;
      }
      strength = Math.max(0, Math.min(5, strength));

      const image = this.inputs[0].image.clone();
      const s = strength;
      const kernel = [
        [-2*s, -s, 0],
        [-s, 1, s],
        [0, s, 2*s]
      ];
      image.convolution(kernel);
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
    json.settings.strength = this.strength;
    return json;
  }
}
