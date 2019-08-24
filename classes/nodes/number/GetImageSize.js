import NodeNumber from '../NodeNumber.js';
import GetImageSizeProperties from './GetImageSizeProperties.jsx';
import InputImage from '../InputImage.js';
import OutputNumber from '../OutputNumber.js';

export default class GetImageSize extends NodeNumber {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Get Image Size', GetImageSizeProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputNumber(this, 0, 'Width'),
      new OutputNumber(this, 1, 'Height')
    ];
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image != null) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();
      this.number = this.inputs[0].image.bitmap.width+' x '+this.inputs[0].image.bitmap.height;
      super.run(inputThatTriggered);
    } else {
      this.runTimer = Date.now();
      this.number = null;
      super.run(inputThatTriggered);
    }
  }


  passToChildren() {
    this.outputs[0].connections.forEach(conn => {
      if (this.inputs[0].image == null) {
        conn.number = null;
      } else {
        conn.number = this.inputs[0].image.bitmap.width;
      }
      conn.runNode();
    })

    this.outputs[1].connections.forEach(conn => {
      if (this.inputs[0].image == null) {
        conn.number = null;
      } else {
        conn.number = this.inputs[0].image.bitmap.height;
      }
      conn.runNode();
    })
  }
}
