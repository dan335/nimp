import NodeString from '../NodeString.js';
import NumberToStringProperties from './NumberToStringProperties.jsx';
import OutputString from '../OutputString.js';
import InputNumber from '../InputNumber.js';

export default class NumberToString extends NodeString {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Number to String', NumberToStringProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Number', 'hasNumberInput')
    ];
    this.outputs = [
      new OutputString(this, 0, 'Output')
    ];

    this.string = typeof settings.string !== 'undefined' ? settings.string : null;
  }


  toJson() {
    let json = super.toJson();

    json.settings.string = this.string;

    return json;
  }


  run(inputThatTriggered) {
    let num = null;

    if (this.inputs[0].number != null) {
      num = this.inputs[0].number;
    }

    this.bg.classList.add('running');
    this.runTimer = Date.now();

    if (num != null) {
      this.string = num.toString();
    } else {
      this.string = null;
    }

    super.run(inputThatTriggered);
  }
}
