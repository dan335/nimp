import NodeImage from '../NodeImage.js';
import TextProperties from './TextProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';
import InputString from '../InputString.js';
import InputNumber from '../InputNumber.js';


export default class Text extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Text', TextProperties, settings);

    this.inputs = [
      new InputNumber(this, 0, 'Width', 'hasWidthInput'),
      new InputNumber(this, 1, 'Height', 'hasHeightInput'),
      new InputString(this, 2, 'String', 'hasStringInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height'),
    ];

    this.hasWidth = typeof settings.hasWidth !== 'undefined' ? settings.hasWidth : false;
    this.hasHeight = typeof settings.hasHeight !== 'undefined' ? settings.hasHeight : false;
    this.width = typeof settings.width !== 'undefined' ? settings.width : 256;
    this.height = typeof settings.height !== 'undefined' ? settings.height : 256;
    this.alignmentX = typeof settings.alignmentX !== 'undefined' ? settings.alignmentX : Jimp.HORIZONTAL_ALIGN_LEFT;
    this.alignmentY = typeof settings.alignmentY !== 'undefined' ? settings.alignmentY : Jimp.VERTICAL_ALIGN_MIDDLE;
    this.string = typeof settings.string !== 'undefined' ? settings.string : 'Nimp';
    this.font = typeof settings.font !== 'undefined' ? settings.font : '/static/fonts/open-sans/open-sans-32-white/open-sans-32-white.fnt';
  }


  toJson() {
    let json = super.toJson();

    json.settings.hasWidth = this.hasWidth;
    json.settings.hasHeight = this.hasHeight;
    json.settings.width = this.width;
    json.settings.height = this.height;
    json.settings.alignmentX = this.alignmentX;
    json.settings.alignmentY = this.alignmentY;
    json.settings.string = this.string;
    json.settings.font = this.font;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    let hasWidth = this.hasWidth;
    let hasHeight = this.hasHeight;
    let width = this.width;
    let height = this.height;
    let string = this.string;

    if (this.inputs[0].number != null) {
      hasWidth = true;
      width = this.inputs[0].number;
    }

    if (this.inputs[1].number != null) {
      hasHeight = true;
      height = this.inputs[1].number;
    }

    if (this.inputs[2].string != null) {
      string = this.inputs[2].string;
    }

    Jimp.loadFont(this.font).then(font => {
      if (!hasWidth) {
        width = Jimp.measureText(font, string);
      }

      if (!hasHeight) {
        height = Jimp.measureTextHeight(font, string, width);
      }

      new Jimp(width, height, '#00000000', (error, image) => {
        if (error) {
          console.log(error);
          this.image = null;
          super.run(inputThatTriggered);
        } else {
          image.print(font, 0, 0, {text: string, alignmentX: this.alignmentX, alignmentY: this.alignmentY}, width, height, (error, image, {x, y}) => {
              if (error) {
                console.log(error);
                this.image = null;
                super.run(inputThatTriggered);
              } else {
                this.image = image;
                super.run(inputThatTriggered);
              }
            }
          )
        }
      })
    }).catch(error => {
      console.log(error);
      this.image = null;
      super.run(inputThatTriggered);
    })
  }


  passToChildren() {
    if (this.image) {
      this.outputs[1].connections.forEach(conn => {
        conn.number = this.image.bitmap.width;
        conn.runNode();
      })
      this.outputs[2].connections.forEach(conn => {
        conn.number = this.image.bitmap.height;
        conn.runNode();
      })
    }

    super.passToChildren();
  }
}
