import Node from './Node.js';
import OutputProperties from './OutputProperties.jsx';
import OutputNodeInput from './OutputNodeInput.js';

export default class Output extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'output', 'Output', OutputProperties);

    this.inputs = [
      new OutputNodeInput(this, 0)
    ];
    this.outputs = [];
  }


  run() {
    
  }
}
