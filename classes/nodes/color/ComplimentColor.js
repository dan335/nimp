import NodeColor from '../NodeColor.js';
import ComplimentColorProperties from './ComplimentColorProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputColor from '../InputColor.js';


export default class ComplimentColor extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Compliment Color', ComplimentColorProperties);

    this.inputs = [
      new InputColor(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Compliment 1'),
    ];
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    if (this.inputs[0].color) {
      this.color = this.inputs[0].color.clone().complement();

    } else {
      this.color = tinycolor('#000');
    }

    super.run(inputThatTriggered);
  }


  renderPreview() {
    new Jimp(1, 1, this.color.toHex8String(), (error, image) => {
      if (error) {
        console.log(error);
      } else {
        image.getBufferAsync(Jimp.MIME_JPEG).then(i => {
          this.preview.setAttributeNS(null, 'href', 'data:'+Jimp.MIME_JPEG+';base64,'+i.toString('base64'));
        });
      }
    })
  }


  passToChildren() {
    this.outputs[0].connections.forEach(conn => {
      conn.color = this.colors[0];
      conn.runNode();
    })
  }
}
