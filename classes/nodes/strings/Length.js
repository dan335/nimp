import NodeNumber from '../NodeNumber.js';
import LengthProperties from './LengthProperties.jsx';
import InputString from '../InputString.js';
import OutputNumber from '../OutputNumber.js';

export default class Length extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'String Length', LengthProperties, settings);

    this.inputs = [
      new InputString(this, 0, 'string', 'String'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.string = typeof settings.string !== 'undefined' ? settings.string : null;
  }


  toJson() {
    let json = super.toJson();

    json.settings.string = this.string;

    return json;
  }


  run(inputThatTriggered) {
    let str = this.string;
    if (this.inputs[0].string != null) {
      str = this.inputs[0].string;
    }

    if (str != null) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.number = str.length;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
