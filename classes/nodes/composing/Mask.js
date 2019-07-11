import Node from '../Node.js';
import MaskProperties from './MaskProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Mask extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Mask', MaskProperties);

    this.inputs = [
      new NodeInput(this, 0, 'Input'),
      new NodeInput(this, 1, 'Mask')
    ];
    this.outputs = [
      new NodeOutput(this, 0, 'Output')
    ];

    this.maskX = 0;
    this.maskY = 0;
  }


  run() {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.mask(this.inputs[1].image, this.maskX, this.maskY, (error, image) => {
          this.image = image;
          super.run();
        })
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run();
    }
  }
}
