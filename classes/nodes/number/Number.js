import NodeNumber from '../NodeNumber.js';
import NumberProperties from './NumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';

export default class Number extends NodeNumber {
  constructor(graph, x, y) {
    super(graph, x, y, 'Number', NumberProperties);

    this.inputs = [];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.number = 1;
  }


  run() {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    super.run();
  }
}
