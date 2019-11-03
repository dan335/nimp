import NodeNumber from '../NodeNumber.js';
import CounterProperties from './CounterProperties.jsx';
import InputNumber from '../InputNumber.js';
import InputColor from '../InputColor.js';
import InputImage from '../InputImage.js';
import InputString from '../InputString.js';
import OutputNumber from '../OutputNumber.js';

export default class Counter extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Counter', CounterProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Increment', 'hasNumber'),
      new InputColor(this, 1, 'Increment', 'hasColor'),
      new InputImage(this, 2, 'Increment', 'hasImage'),
      new InputString(this, 3, 'Increment', 'hasString'),
      new InputNumber(this, 4, 'Reset', 'hasNumberReset'),
      new InputColor(this, 5, 'Reset', 'hasColorReset'),
      new InputImage(this, 6, 'Reset', 'hasImageReset'),
      new InputString(this, 7, 'Reset', 'hasStringReset'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Counter')
    ];

    this.number = -1;
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    if (inputThatTriggered && inputThatTriggered.index >= 4) {
      this.number = 0
    } else {
      this.number++;
    }
    this.runTimer = Date.now();
    super.run(inputThatTriggered);
  }
}
