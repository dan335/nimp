import NodeNumber from '../NodeNumber.js';
import ExponentNumbersProperties from './ExponentNumbersProperties.jsx';
import ExponentNumbersInputNumberA from './ExponentNumbersInputNumberA.js';
import ExponentNumbersInputNumberB from './ExponentNumbersInputNumberB.js';
import OutputNumber from '../OutputNumber.js';

export default class ExponentNumbers extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Exponent', ExponentNumbersProperties);

    this.inputs = [
      new ExponentNumbersInputNumberA(this, 0, 'a'),
      new ExponentNumbersInputNumberB(this, 1, 'b'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.a = null;
    this.b = null;
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
      this.number = Math.pow(this.a, this.b);
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
