import NodeString from '../NodeString.js';
import IfStringProperties from './IfStringProperties.jsx';
import OutputString from '../OutputString.js';
import InputString from '../InputString.js';
import InputNumber from '../InputNumber.js';


export default class IfString extends NodeString {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'String If', IfStringProperties, settings);

    this.inputs = [
      new InputString(this, 0, 'Input'),
      new InputNumber(this, 1, 'Test', 'hasAInput')
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

    if (this.inputs[1].number != null) {
      a = this.inputs[1].number;
    }

    if (a) {
      if (this.inputs[0].string != null) {
        this.bg.classList.add('running');
        this.runTimer = Date.now();
        this.string = this.inputs[0].string;
        super.run(inputThatTriggered);
      } else {
        this.runTimer = Date.now();
        this.string = null;
        super.run(inputThatTriggered);
      }
    }
  }
}
