import NodeImage from '../NodeImage.js';
import BlitProperties from './BlitProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import BlitInputNumberX from './BlitInputNumberX.js';
import BlitInputNumberY from './BlitInputNumberY.js';
import BlitInputNumberSrcX from './BlitInputNumberSrcX.js';
import BlitInputNumberSrcY from './BlitInputNumberSrcY.js';
import BlitInputNumberSrcWidth from './BlitInputNumberSrcWidth.js';
import BlitInputNumberSrcHeight from './BlitInputNumberSrcHeight.js';

export default class Blit extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Blit', BlitProperties);

    this.inputs = [
      new InputImage(this, 0, 'Dest'),
      new InputImage(this, 1, 'Source'),
      new BlitInputNumberX(this, 2, 'X'),
      new BlitInputNumberY(this, 3, 'Y'),
      new BlitInputNumberSrcX(this, 4, 'Source X'),
      new BlitInputNumberSrcY(this, 5, 'Source Y'),
      new BlitInputNumberSrcWidth(this, 6, 'Source Width'),
      new BlitInputNumberSrcHeight(this, 7, 'Source Height'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.blitX = typeof settings.blitX !== 'undefined' ? settings.blitX : 0;
    this.blitY = typeof settings.blitY !== 'undefined' ? settings.blitY : 0;
    this.srcX = typeof settings.srcX !== 'undefined' ? settings.srcX : 0;
    this.srcY = typeof settings.srcY !== 'undefined' ? settings.srcY : 0;
    this.srcWidth = typeof settings.srcWidth !== 'undefined' ? settings.srcWidth : 0;
    this.srcHeight = typeof settings.srcHeight !== 'undefined' ? settings.srcHeight : 0;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let blitX = this.blitX;
      let blitY = this.blitY;
      let srcX = this.srcX;
      let srcY = this.srcY;
      let srcWidth = this.srcWidth;
      let srcHeight = this.srcHeight;

      if (this.inputs[2].number != null) {
        blitX = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        blitY = this.inputs[3].number;
      }

      if (this.inputs[4].number != null) {
        srcX = this.inputs[4].number;
      }

      if (this.inputs[5].number != null) {
        srcY = this.inputs[5].number;
      }

      if (this.inputs[6].number != null) {
        srcWidth = this.inputs[6].number;
      }

      if (this.inputs[7].number != null) {
        srcHeight = this.inputs[7].number;
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.blit(this.inputs[1].image, blitX, blitY, srcX, srcY, srcWidth, srcHeight);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.blit(this.inputs[1].image, blitX, blitY, srcX, srcY, srcWidth, srcHeight, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              this.image = image;
              super.run(inputThatTriggered);
            }
          })
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();

    json.settings.blitX = this.blitX;
    json.settings.blitY = this.blitY;
    json.settings.srcX = this.srcX;
    json.settings.srcY = this.srcY;
    json.settings.srcWidth = this.srcWidth;
    json.settings.srcHeight = this.srcHeight;

    return json;
  }
}
