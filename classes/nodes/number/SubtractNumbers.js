import NodeNumber from '../NodeNumber.js';
import SubtractNumbersProperties from './SubtractNumbersProperties.jsx';
import SubtractNumbersInputNumberA from './SubtractNumbersInputNumberA.js';
import SubtractNumbersInputNumberB from './SubtractNumbersInputNumberB.js';
import OutputNumber from '../OutputNumber.js';

export default class SubtractNumbers extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Subtract', SubtractNumbersProperties);

    this.inputs = [
      new SubtractNumbersInputNumberA(this, 0, 'a'),
      new SubtractNumbersInputNumberB(this, 1, 'b'),
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
      this.number = this.a - this.b;
      super.run();
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run();
    }
  }
}
