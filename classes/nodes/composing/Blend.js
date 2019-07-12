import NodeImage from '../NodeImage.js';
import BlendProperties from './BlendProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import BlendInputNumberX from './BlendInputNumberX.js';
import BlendInputNumberY from './BlendInputNumberY.js';
import BlendInputNumberTopOpacity from './BlendInputNumberTopOpacity.js';
import BlendInputNumberBottomOpacity from './BlendInputNumberBottomOpacity.js';

export default class Blend extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Blend', BlendProperties);

    this.inputs = [
      new InputImage(this, 0, 'Background'),
      new InputImage(this, 1, 'Foreground'),
      new BlendInputNumberX(this, 2, 'X'),
      new BlendInputNumberY(this, 3, 'Y'),
      new BlendInputNumberTopOpacity(this, 4, 'Foreground Opacity'),
      new BlendInputNumberBottomOpacity(this, 5, 'Background Opacity'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.blendX = 0;
    this.blendY = 0;
    this.mode = Jimp.BLEND_MULTIPLY;
    this.opacitySource = 1;
    this.opacityDest = 1;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let blendX = this.blendX;
      let blendY = this.blendY;
      let opacitySource = this.opacitySource;
      let opacityDest = this.opacityDest;

      if (this.inputs[2].number != null) {
        blendX = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        blendY = this.inputs[3].number;
      }

      if (this.inputs[4].number != null) {
        opacitySource = this.inputs[4].number;
      }

      if (this.inputs[5].number != null) {
        opacityDest = this.inputs[5].number;
      }

      opacitySource = Math.max(0, opacitySource);
      opacitySource = Math.min(1, opacitySource);

      opacityDest = Math.max(0, opacityDest);
      opacityDest = Math.min(1, opacityDest);

      Jimp.read(this.inputs[0].image).then(image => {
        image.composite(this.inputs[1].image, blendX, blendY, {
          mode: this.mode,
          opacitySource: opacitySource,
          opacityDest: opacityDest
        }, (error, image) => {
          if (error) {
            console.log(error);
          } else {
            this.image = image;
            super.run(inputThatTriggered);
          }
        })
      })
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
