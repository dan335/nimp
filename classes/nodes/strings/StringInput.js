import NodeString from '../NodeString.js';
import StringInputProperties from './StringInputProperties.jsx';
import OutputString from '../OutputString.js';

export default class StringInput extends NodeString {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'String Input', StringInputProperties, settings);

    this.inputs = [];
    this.outputs = [
      new OutputString(this, 0, 'Output')
    ];

    this.string = typeof settings.string !== 'undefined' ? settings.string : 'Nimp';
  }


  toJson() {
    let json = super.toJson();

    json.settings.string = this.string;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    super.run(inputThatTriggered);
  }
}
