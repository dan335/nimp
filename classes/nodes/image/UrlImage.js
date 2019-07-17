import NodeImage from '../NodeImage.js';
import UrlImageProperties from './UrlImageProperties.jsx';
import OutputImage from '../OutputImage.js';
import OutputNumber from '../OutputNumber.js';
import Jimp from 'jimp';
import fetch from 'isomorphic-unfetch';


export default class UrlImage extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Image from Url', UrlImageProperties);

    this.inputs = [];
    this.outputs = [
      new OutputImage(this, 0, 'Output'),
      new OutputNumber(this, 1, 'Width'),
      new OutputNumber(this, 2, 'Height')
    ];

    //this.url = 'https://i.imgur.com/mdlwVuL.jpg';
    this.url = typeof settings.url !== 'undefined' ? settings.url : 'https://i.imgur.com/3aDSTiB.jpg';
  }


  toJson() {
    let json = super.toJson();

    json.settings.url = this.url;

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    Jimp.read(this.url).then(image => {
      this.image = image;
      super.run(inputThatTriggered);
    }).catch(error => {
      console.log(error);
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
