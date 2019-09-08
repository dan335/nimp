import NodeColor from '../NodeColor.js';
import ElseColorProperties from './ElseColorProperties.jsx';
import OutputColor from '../OutputColor.js';
import InputColor from '../InputColor.js';
const tinycolor = require("tinycolor2");
import InputNumber from '../InputNumber.js';


export default class ElseColor extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Color If Else', ElseColorProperties, settings);

    this.inputs = [
      new InputColor(this, 0, 'Input A'),
      new InputColor(this, 1, 'Input B'),
      new InputNumber(this, 2, 'Test', 'hasAInput')
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output')
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

    if (this.inputs[0].color && this.inputs[1].color) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      this.color = tinycolor('#000');
      if (a) {
        if (this.inputs[0].color) {
          this.color = this.inputs[0].color;
        }
      } else {
        if (this.inputs[1].color) {
          this.color = this.inputs[1].color;
        }
      }

      super.run(inputThatTriggered);

    } else {
      this.runTimer = Date.now();
      this.color = tinycolor('#000');
      super.run(inputThatTriggered);
    }
  }
}
