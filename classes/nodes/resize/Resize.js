import NodeImage from '../NodeImage.js';
import ResizeProperties from './ResizeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import ResizeInputNumberX from './ResizeInputNumberX.js';
import ResizeInputNumberY from './ResizeInputNumberY.js';

export default class Resize extends NodeImage {
  constructor(graph, x, y) {
    super(graph, x, y, 'Resize', ResizeProperties);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new ResizeInputNumberX(this, 1, 'Width'),
      new ResizeInputNumberY(this, 2, 'Height')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.resizeX = 256;
    this.resizeY = 256;
    this.mode = Jimp.RESIZE_BICUBIC;
  }


  run() {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      Jimp.read(this.inputs[0].image).then(image => {
        let resizeX = this.resizeX;
        let resizeY = this.resizeY;

        if (this.inputs[1].number != null) {
          resizeX = this.inputs[1].number;
        }

        if (this.inputs[2].number != null) {
          resizeY = this.inputs[2].number;
        }


        image.resize(resizeX, resizeY, this.mode, (error, image) => {
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
