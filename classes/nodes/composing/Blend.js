import Node from '../Node.js';
import BlendProperties from './BlendProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import NodeInput from '../NodeInput.js';

export default class Blend extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Blend', BlendProperties);

    this.inputs = [
      new NodeInput(this, 0),
      new NodeInput(this, 1)
    ];
    this.outputs = [
      new NodeOutput(this, 0)
    ];

    this.BlendX = 0;
    this.BlendY = 0;
    this.mode = Jimp.BLEND_MULTIPLY;
    this.opacitySource = 1;
    this.opacityDest = 1;
  }


  run() {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        image.composite(this.inputs[1].image, this.BlendX, this.BlendY, {
          mode: this.mode,
          opacitySource: this.opacitySource,
          opacityDest: this.opacityDest
        }, (error, image) => {
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
