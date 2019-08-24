import NodeNumber from '../NodeNumber.js';
import DivideNumbersProperties from './DivideNumbersProperties.jsx';
import DivideNumbersInputNumberA from './DivideNumbersInputNumberA.js';
import DivideNumbersInputNumberB from './DivideNumbersInputNumberB.js';
import OutputNumber from '../OutputNumber.js';

export default class DivideNumbers extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Divide', DivideNumbersProperties, settings);

    this.inputs = [
      new DivideNumbersInputNumberA(this, 0, 'a'),
      new DivideNumbersInputNumberB(this, 1, 'b'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.a = typeof settings.a !== 'undefined' ? settings.a : null;
    this.b = typeof settings.b !== 'undefined' ? settings.b : null;
  }


  toJson() {
    let json = super.toJson();

    json.settings.a = this.a;
    json.settings.b = this.b;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].number == null) {
      this.a = null;
    } else {
      this.a = this.inputs[0].number;
    }

    if (this.inputs[1].number == null) {
      this.b = null;
    } else {
      this.b = this.inputs[1].number;
    }

    if (this.a != null && this.b != null && !isNaN(this.a) && !isNaN(this.b)) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.number = this.a / this.b;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
