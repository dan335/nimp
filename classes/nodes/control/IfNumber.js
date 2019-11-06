import NodeNumber from '../NodeNumber.js';
import IfNumberProperties from './IfNumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';


export default class IfNumber extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Number If', IfNumberProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Input'),
      new InputNumber(this, 1, 'Test', 'hasAInput')
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Output')
    ];

    this.a = typeof settings.a !== 'undefined' ? settings.a : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.a = this.a;

    return json;
  }


  run(inputThatTriggered) {
    let a = this.a;

    if (this.inputs[1].number != null) {
      a = this.inputs[1].number;
    }

    if (a) {
      if (this.inputs[0].number != null) {
        this.bg.classList.add('running');
        this.runTimer = Date.now();
        this.number = this.inputs[0].number;
        super.run(inputThatTriggered);
      } else {
        this.runTimer = Date.now();
        this.number = null;
        super.run(inputThatTriggered);
      }
    }
  }
}
