import Node from './Node.js';
const tinycolor = require("tinycolor2");
var debounce = require('lodash.debounce');


export default class NodeColor extends Node {
  constructor(className, graph, x, y, name, propertiesComponent) {
    super(className, graph, x, y, name, propertiesComponent);

    this.color = tinycolor('#fff');

    this.debouncedRenderPreview = debounce(this.renderPreview, 300);
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
    new Jimp(1, 1, this.color.toHex8(), (error, image) => {
      if (error) {
        console.log(error);
      } else {
        image.getBufferAsync(Jimp.MIME_PNG).then(i => {
          this.preview.setAttributeNS(null, 'href', 'data:'+Jimp.MIME_PNG+';base64,'+i.toString('base64'));
        });
      }
    })
  }
}
