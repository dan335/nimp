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
      new InputNumber(this, 0, 'Input', 'hasNumber'),
      new InputColor(this, 1, 'Input', 'hasColor'),
      new InputImage(this, 2, 'Input', 'hasImage'),
      new InputString(this, 3, 'Input', 'hasString')
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Counter')
    ];

    this.number = 0;
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    this.number++;
    this.runTimer = Date.now();
    super.run(inputThatTriggered);
  }
}
