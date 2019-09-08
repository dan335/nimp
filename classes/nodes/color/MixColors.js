import NodeColor from '../NodeColor.js';
import MixColorsProperties from './MixColorsProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputNumber from '../InputNumber.js';
import InputColorState from '../InputColorState.js';



export default class MixColors extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Mix Colors', MixColorsProperties, settings);

    this.inputs = [
      new InputColorState(this, 0, 'Color A', 'hasColorAInput'),
      new InputColorState(this, 1, 'Color B', 'hasColorBInput'),
      new InputNumber(this, 2, 'Amount', 'hasAmountInput')
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Output'),
    ];

    this.amount = typeof settings.amount !== 'undefined' ? settings.amount : 0.5;
    this.colorA = typeof settings.colorA !== 'undefined' ? settings.colorA : 'hsla(0, 0, 0, 1)';
    this.colorB = typeof settings.colorB !== 'undefined' ? settings.colorB : 'hsla(0, 0, 1, 1)';
  }


  toJson() {
    let json = super.toJson();

    json.settings.amount = this.amount;
    json.settings.colorA = this.colorA;
    json.settings.colorB = this.colorB;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let colorA = tinycolor(this.colorA);
    let colorB = tinycolor(this.colorB);
    let amount = this.amount;

    if (this.inputs[0].color) {
      colorA = this.inputs[0].color.clone();
    }

    if (this.inputs[1].color) {
      colorB = this.inputs[1].color.clone();
    }

    if (this.inputs[2].number != null) {
      amount = this.inputs[2].number;
    }

    if (!colorA.isValid()) {
      colorA = tinycolor('#000');
    }

    if (!colorB.isValid()) {
      colorB = tinycolor('#fff');
    }

    amount = Math.min(1, Math.max(0, amount));

    this.color = tinycolor.mix(colorA, colorB, amount*100);

    super.run(inputThatTriggered);
  }


  // renderPreview() {
  //   new Jimp(1, 1, this.color.toHex8String(), (error, image) => {
  //     if (error) {
  //       console.log(error);
  //     } else {
  //       image.getBufferAsync(Jimp.MIME_JPEG).then(i => {
  //         this.preview.setAttributeNS(null, 'href', 'data:'+Jimp.MIME_JPEG+';base64,'+i.toString('base64'));
  //       });
  //     }
  //   })
  // }


  // passToChildren() {
  //   this.outputs[0].connections.forEach(conn => {
  //     conn.color = this.colors[0];
  //     conn.runNode();
  //   })
  // }
}
