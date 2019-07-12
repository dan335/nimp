import NodeNumber from '../NodeNumber.js';
import DivideNumbersProperties from './DivideNumbersProperties.jsx';
import DivideNumbersInputNumberA from './DivideNumbersInputNumberA.js';
import DivideNumbersInputNumberB from './DivideNumbersInputNumberB.js';
import OutputNumber from '../OutputNumber.js';

export default class DivideNumbers extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Divide', DivideNumbersProperties);

    this.inputs = [
      new DivideNumbersInputNumberA(this, 0, 'a'),
      new DivideNumbersInputNumberB(this, 1, 'b'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.a = null;
    this.b = null;
  }


  run() {
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
      super.run();
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run();
    }
  }
}
