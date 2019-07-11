import Node from '../Node.js';
import BlurProperties from './BlurProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Blur extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Blur', BlurProperties);

    this.inputs = [
      new NodeInput(this, 0, 'Input')
    ];
    this.outputs = [
      new NodeOutput(this, 0, 'Output')
    ];

    this.radius = 10;
  }


  run() {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.blur(this.radius, (error, image) => {
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
