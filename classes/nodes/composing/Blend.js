import NodeImage from '../NodeImage.js';
import BlendProperties from './BlendProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';

export default class Blend extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Blend', BlendProperties);

    this.inputs = [
      new InputImage(this, 0, 'Foreground'),
      new InputImage(this, 1, 'Background')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.BlendX = 0;
    this.BlendY = 0;
    this.mode = Jimp.BLEND_MULTIPLY;
    this.opacitySource = 1;
    this.opacityDest = 1;
  }


  run() {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
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
