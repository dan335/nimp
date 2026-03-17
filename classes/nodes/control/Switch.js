import NodeImage from '../NodeImage.js';
import SwitchProperties from './SwitchProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Switch extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Switch', SwitchProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input A'),
      new InputImage(this, 1, 'Input B'),
      new InputImage(this, 2, 'Input C'),
      new InputImage(this, 3, 'Input D'),
      new InputNumber(this, 4, 'Index', 'hasIndexInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.index = typeof settings.index !== 'undefined' ? settings.index : 0;
  }


  toJson() {
    let json = super.toJson();
    json.settings.index = this.index;
    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let index = this.index;
    if (this.inputs[4].number != null) {
      index = this.inputs[4].number;
    }

    index = Math.max(0, Math.min(3, Math.round(index)));

    const selectedInput = this.inputs[index];
    if (selectedInput && selectedInput.image) {
      this.image = selectedInput.image.clone();
    } else {
      this.image = null;
    }

    super.run(inputThatTriggered);
  }
}
