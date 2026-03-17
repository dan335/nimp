import Node from './Node.js';
const tinycolor = require("tinycolor2");
var debounce = require('lodash.debounce');
import { Jimp } from "jimp";


export default class NodeColor extends Node {
  constructor(className, graph, x, y, name, propertiesComponent, settings) {
    super(className, graph, x, y, name, propertiesComponent, settings);

    this.color = tinycolor('#fff');

    this.debouncedRenderPreview = debounce(this.renderPreview, 300);
    this.renderName();
  }


  view() {
    // do nothing
  }

  deView() {
    // do nothing
  }


  passToChildren() {
    this.outputs.forEach(output => {
      output.connections.forEach(conn => {
        if (this.color == null) {
          conn.color = null;
        } else {
          conn.color = this.color;
        }
        conn.runNode();
      })
    })
  }


  run(inputThatTriggered) {
    this.timer.textContent = (Date.now() - this.runTimer) + 'ms';
    this.bg.classList.remove('running');
    this.passToChildren();

    if (this.color) {
      this.debouncedRenderPreview();
    } else {
      this.preview.setAttributeNS(null, 'href', '');
    }
  }


  renderPreview() {
    const image = new Jimp({ width: 1, height: 1, color: parseInt(this.color.toHex8(), 16) });
    image.getBuffer("image/png").then(i => {
      this.preview.setAttributeNS(null, 'href', 'data:image/png;base64,'+i.toString('base64'));
    });
  }
}
