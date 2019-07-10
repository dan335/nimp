import Node from '../Node.js';
import DisplaceProperties from './DisplaceProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Displace extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'displace', 'Displace', DisplaceProperties);

    this.inputs = [
      new NodeInput(this, 0),
      new NodeInput(this, 1)
    ];
    this.outputs = [
      new NodeOutput(this, 0)
    ];

    this.offset = 20;
  }


  run() {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.displace(this.inputs[1].image, this.offset, (error, image) => {
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
