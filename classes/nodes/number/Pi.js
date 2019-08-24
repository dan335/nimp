import NodeNumber from '../NodeNumber.js';
import PiProperties from './PiProperties.jsx';
import OutputNumber from '../OutputNumber.js';

export default class Pi extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Pi', PiProperties, settings);

    this.inputs = [];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.number = Math.PI;
  }


  toJson() {
    let json = super.toJson();

    json.settings.number = this.number;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    super.run(inputThatTriggered);
  }
}
