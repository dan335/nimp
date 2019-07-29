import NodeImage from '../NodeImage.js';
import PasteImageProperties from './PasteImageProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';
import fetch from 'isomorphic-unfetch';


export default class PasteImage extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Image from Url', PasteImageProperties);

    this.inputs = [];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    this.onPaste = this.onPaste.bind(this);
  }


  onPaste(event) {
    let blob = null;
    this.runTimer = Date.now();

    var items = (event.clipboardData || event.originalEvent.clipboardData).items;

    for (const item of items) {
      if (item.type.indexOf('image') === 0) {
        blob = item.getAsFile();
      }
    }

    if (blob) {
      const reader = new FileReader();
      reader.onload = (event) => {
        Jimp.read(event.target.result).then(image => {
          this.image = image;
          super.run(null);
        })
      }

      reader.readAsDataURL(blob);
    }
  }


  select() {
    window.removeEventListener("paste", this.onPaste);
    window.addEventListener("paste", this.onPaste);
    super.select();
  }


  deselect() {
    window.removeEventListener("paste", this.onPaste);
    super.deselect();
  }


  delete() {
    window.removeEventListener("paste", this.onPaste);
    super.delete();
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    // this.bg.classList.add('running');
    // this.runTimer = Date.now();
    // Jimp.read(this.url).then(image => {
    //   this.image = image;
    //   super.run(inputThatTriggered);
    // }).catch(error => {
    //   console.log(error);
    // })
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
