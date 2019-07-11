import Node from '../Node.js';
import UrlImageProperties from './UrlImageProperties.jsx';
import NodeOutput from '../NodeOutput.js';
import Jimp from 'jimp';
import fetch from 'isomorphic-unfetch';


export default class UniformColor extends Node {
  constructor(graph, x, y) {
    super(graph, x, y, 'Image from Url', UrlImageProperties);

    this.inputs = [];
    this.outputs = [
      new NodeOutput(this, 0, 'Output')
    ];

    //this.url = 'https://i.imgur.com/e2Kmd.jpg';
    this.url = 'https://i.imgur.com/mdlwVuL.jpg';

    this.run();
  }


  run() {
    this.bg.classList.add('running');
    this.runTimer = Date.now();
    Jimp.read(this.url).then(image => {
      this.image = image;
      super.run();
    }).catch(error => {
      console.log(error);
    })
  }
}
