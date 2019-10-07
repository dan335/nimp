import NodeString from '../NodeString.js';
import ElseStringProperties from './ElseStringProperties.jsx';
import OutputString from '../OutputString.js';
import InputNumber from '../InputNumber.js';
import InputString from '../InputString.js';


export default class ElseString extends NodeString {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'String If Else', ElseStringProperties, settings);

    this.inputs = [
      new InputString(this, 0, 'Input A'),
      new InputString(this, 1, 'Input B'),
      new InputNumber(this, 2, 'Test', 'hasAInput')
    ];
    this.outputs = [
      new OutputString(this, 0, 'Output')
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

    if (this.inputs[0].string != null && this.inputs[1].string != null) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      this.string = null;
      if (a) {
        if (this.inputs[0].string != null) {
          this.string = this.inputs[0].string;
        }
      } else {
        if (this.inputs[1].string != null) {
          this.string = this.inputs[1].string;
        }
      }

      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.string = null;
      super.run(inputThatTriggered);
    }
  }
}
