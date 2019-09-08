import NodeImage from '../NodeImage.js';
import CropProperties from './CropProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';
import OutputNumber from '../OutputNumber.js';

export default class Crop extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Crop', CropProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'X', 'hasXInput'),
      new InputNumber(this, 2, 'Y', 'hasYInput'),
      new InputNumber(this, 3, 'Width', 'hasWidthInput'),
      new InputNumber(this, 4, 'Height', 'hasHeightInput'),
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'X'),
      new OutputNumber(this, 2, 'Y'),
      new OutputNumber(this, 3, 'Width'),
      new OutputNumber(this, 4, 'Height'),
    ];

    this.cropX = typeof settings.cropX !== 'undefined' ? settings.cropX : 0;
    this.cropY = typeof settings.cropY !== 'undefined' ? settings.cropY : 0;
    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
  }


  toJson() {
    let json = super.toJson();

    json.settings.cropX = this.cropX;
    json.settings.cropY = this.cropY;
    json.settings.width = this.width;
    json.settings.height = this.height;

    return json;
  }


  run(inputThatTriggered) {
    this.runTimer = Date.now();

    if (this.inputs[0].image) {
      this.bg.classList.add('running');

      let cropX = this.cropX;
      let cropY = this.cropY;
      let width = this.width;
      let height = this.height;

      if (this.inputs[1].number != null) {
        cropX = this.inputs[1].number;
      }

      if (this.inputs[2].number != null) {
        cropY = this.inputs[2].number;
      }

      if (this.inputs[3].number != null) {
        width = this.inputs[3].number;
      }

      if (this.inputs[4].number != null) {
        height = this.inputs[4].number;
      }

      cropX = Math.max(0, cropX);
      cropY = Math.max(0, cropY);
      width = Math.max(0, width);
      height = Math.max(0, height);

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.crop(cropX, cropY, width, height);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.crop(cropX, cropY, width, height, (error, image) => {
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
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  passToChildren() {
    this.outputs[1].connections.forEach(conn => {
      conn.number = this.cropX;
      conn.runNode();
    })

    this.outputs[2].connections.forEach(conn => {
      conn.number = this.cropY;
      conn.runNode();
    })

    this.outputs[3].connections.forEach(conn => {
      conn.number = this.width;
      conn.runNode();
    })

    this.outputs[4].connections.forEach(conn => {
      conn.number = this.height;
      conn.runNode();
    })

    super.passToChildren();
  }
}
