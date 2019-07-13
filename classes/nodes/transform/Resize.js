import NodeImage from '../NodeImage.js';
import ResizeProperties from './ResizeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import ResizeInputNumberX from './ResizeInputNumberX.js';
import ResizeInputNumberY from './ResizeInputNumberY.js';

export default class Resize extends NodeImage {
  constructor(className, graph, x, y) {
    super(className, graph, x, y, 'Resize', ResizeProperties);

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


  toJson() {
    let json = super.toJson();

    json.settings.resizeX = this.resizeX;
    json.settings.resizeY = this.resizeY;
    json.settings.mode = this.mode;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let resizeX = this.resizeX;
      let resizeY = this.resizeY;

      if (this.inputs[1].number != null) {
        resizeX = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        resizeY = this.inputs[2].number;
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.resize(resizeX, resizeY, this.mode);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.resize(resizeX, resizeY, this.mode, (error, image) => {
            this.image = image;
            super.run(inputThatTriggered);
          });
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
