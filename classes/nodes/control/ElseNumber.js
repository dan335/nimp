import NodeNumber from '../NodeNumber.js';
import ElseNumberProperties from './ElseNumberProperties.jsx';
import OutputNumber from '../OutputNumber.js';
import InputNumber from '../InputNumber.js';


export default class ElseNumber extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Number If Else', ElseNumberProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Input A'),
      new InputNumber(this, 1, 'Input B'),
      new InputNumber(this, 2, 'Test', 'hasAInput')
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

    if (this.inputs[2].number != null) {
      a = this.inputs[2].number;
    }

    if (this.inputs[0].number != null && this.inputs[1].number != null) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      this.number = null;
      if (a) {
        if (this.inputs[0].number != null) {
          this.number = this.inputs[0].number;
        }
      } else {
        if (this.inputs[1].number != null) {
          this.number = this.inputs[1].number;
        }
      }

      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }
}
