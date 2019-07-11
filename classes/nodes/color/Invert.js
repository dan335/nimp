import Node from '../Node.js';
import InvertProperties from './InvertProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Invert extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Invert', InvertProperties);

    this.inputs = [
      new NodeInput(this, 0)
    ];
    this.outputs = [
      new NodeOutput(this, 0)
    ];
  }


  run() {
    if (this.inputs[0].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.invert((error, image) => {
          this.image = image;
          super.run();
        });
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run();
    }
  }
}
