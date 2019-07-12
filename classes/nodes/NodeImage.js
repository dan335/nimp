import Node from './Node.js';
import OutputImage from './OutputImage.js';

export default class NodeImage extends Node {
  constructor(graph, x, y, name, propertiesComponent) {
    super(graph, x, y, name, propertiesComponent);

    this.image = null;
  }


  view() {
    this.bg.classList.add('viewed');
    const elm = document.getElementById('nodeViewImage');
    if (elm) {
      if (this.image) {
        this.image.getBufferAsync(Jimp.MIME_PNG).then(i => {
          elm.src = 'data:'+Jimp.MIME_PNG+';base64,'+i.toString('base64');
        })
      } else {
        elm.src = '';
      }
    }
  }


  deView() {
    this.bg.classList.remove('viewed');
    const elm = document.getElementById('nodeViewImage');
    if (elm) {
      elm.src = '';
    }
  }


  passToChildren() {
    this.outputs.forEach(output => {
      if (output instanceof OutputImage) {
        output.connections.forEach(conn => {
          if (this.image) {
            conn.image = this.image;
            conn.runNode();
          } else {
            conn.image = null;
            conn.runNode();
          }
        })
      }
    })
  }


  run(inputThatTriggered) {
    this.timer.textContent = (Date.now() - this.runTimer) + 'ms';
    this.bg.classList.remove('running');

    if (this.image) {
      this.bmpSize.textContent = this.image.bitmap.width+'x'+this.image.bitmap.height;
    } else {
      this.bmpSize.textContent = '';
    }

    if (this.graph.viewedNode == this) {
      this.view();
    }

    if (this.image) {
      this.image.getBufferAsync(Jimp.MIME_PNG).then(i => {
        this.preview.setAttributeNS(null, 'href', 'data:'+Jimp.MIME_PNG+';base64,'+i.toString('base64'));
      })
    } else {
      this.preview.setAttributeNS(null, 'href', '');
    }

    this.passToChildren();
  }
}
