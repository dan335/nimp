import NodeNumber from '../NodeNumber.js';
import GetAlphaProperties from './GetAlphaProperties.jsx';
import OutputNumber from '../OutputNumber.js';
const tinycolor = require("tinycolor2");
import InputColor from '../InputColor.js';


export default class GetAlpha extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Get Alpha', GetAlphaProperties, settings);

    this.inputs = [
      new InputColor(this, 0, 'Input')
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Alpha')
    ];
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    if (this.inputs[0].color) {

      this.number = this.inputs[0].color.clone().getAlpha();

    } else {

      this.color = null
    }

    super.run(inputThatTriggered);
  }
}
