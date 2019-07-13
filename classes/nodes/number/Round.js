import NodeNumber from '../NodeNumber.js';
import RoundProperties from './RoundProperties.jsx';
import RoundInputNumberA from './RoundInputNumberA.js';
import OutputNumber from '../OutputNumber.js';

export default class Round extends NodeNumber {
  constructor(className, graph, x, y) {
    super(className, graph, x, y, 'Round', RoundProperties);

    this.inputs = [
      new RoundInputNumberA(this, 0, 'a'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Result')
    ];

    this.a = null;
  }


  toJson() {
    let json = super.toJson();

    json.a = this.a;

    return json;
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
      this.number = Math.round(this.a);
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
