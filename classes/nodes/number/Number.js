import NodeNumber from '../NodeNumber.js';
import NumberProperties from './NumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';

export default class Number extends NodeNumber {
  constructor(className, graph, x, y) {
    super(className, graph, x, y, 'Number', NumberProperties);

    this.inputs = [];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.number = 1;
  }


  toJson() {
    let json = super.toJson();

    json.number = this.number;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    super.run(inputThatTriggered);
  }
}
