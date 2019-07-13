classes\nodes\number\import NodeNumber from '../NodeNumber.js';
import CeilProperties from './CeilProperties.jsx';
import CeilInputNumberA from './CeilInputNumberA.js';
import OutputNumber from '../OutputNumber.js';

export default class Ceil extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Ceil', CeilProperties);

    this.inputs = [
      new CeilInputNumberA(this, 0, 'a'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.a = null;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].number == null) {
      this.a = null;
    } else {
      this.a = this.inputs[0].number;
    }

    if (this.a != null && !isNaN(this.a)) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.number = Math.ceil(this.a);
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
