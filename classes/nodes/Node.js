import settings from '../../lib/settings.js';


export default class Node {
  constructor(graph, x, y, id, name, propertiesComponent) {
    this.graph = graph;
    this.inputs = [];
    this.outputs = [];
    this.x = x - settings.nodeWidth / 2;
    this.y = y - settings.nodeHeight / 2;
    this.id = id;
    this.name = name;
    this.propertiesComponent = propertiesComponent;
    this.image = null;
    this.createSvgElm();
    this.graph.selectNode(this);
    this.run = this.run.bind(this);
  }


  createSvgElm() {
    this.g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    this.g.setAttributeNS(null, 'transform', 'translate('+this.x+' '+this.y+')');
    this.g.classList.add('node');
    this.graph.svg.appendChild(this.g);

    this.bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    this.bg.setAttributeNS(null, 'x', 0);
    this.bg.setAttributeNS(null, 'y', 0);
    this.bg.setAttributeNS(null, 'width', settings.nodeWidth);
    this.bg.setAttributeNS(null, 'height', settings.nodeHeight);
    this.bg.setAttributeNS(null, 'fill', settings.nodeBackgroundColor);
    this.bg.classList.add('nodeBg');
    this.bg.onclick = () => {this.graph.selectNode(this);}
    this.g.appendChild(this.bg);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, 'x', 5);
    text.setAttributeNS(null, 'y', settings.nodeHeight / 2 + 5);
    text.setAttributeNS(null, 'fill', '#fff');
    text.textContent = this.name;
    text.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(text);

    this.preview = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.preview.setAttributeNS(null, 'x', 0);
    this.preview.setAttributeNS(null, 'y', settings.nodeHeight+5);
    this.preview.setAttributeNS(null, 'width', settings.nodeWidth);
    this.preview.setAttributeNS(null, 'height', settings.nodeWidth);
    this.preview.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMin meet');
    this.preview.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(this.preview);

    this.timer = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.timer.setAttributeNS(null, 'x', settings.nodeWidth);
    this.timer.setAttributeNS(null, 'y', settings.nodeHeight * 0.25 * -1);
    this.timer.setAttributeNS(null, 'fill', '#fff');
    this.timer.setAttributeNS(null, 'text-anchor', 'end');
    this.timer.setAttributeNS(null, 'font-size', 11);
    this.timer.textContent = '';
    this.timer.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(this.timer);

    this.bmpSize = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.bmpSize.setAttributeNS(null, 'x', 0);
    this.bmpSize.setAttributeNS(null, 'y', settings.nodeHeight * 0.25 * -1);
    this.bmpSize.setAttributeNS(null, 'fill', '#fff');
    this.bmpSize.setAttributeNS(null, 'font-size', 11);
    this.bmpSize.textContent = '';
    this.bmpSize.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(this.bmpSize);
  }


  select() {
    this.bg.classList.add('selected');
    this.graph.component.setState({properties:{component:this.propertiesComponent, node:this}});
    this.view();
  }


  view() {
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


  deselect() {
    this.bg.classList.remove('selected');
    this.graph.component.setState({properties:null});
  }


  passImageToChildren() {
    this.outputs.forEach(output => {
      output.connections.forEach(conn => {
        if (this.image) {
          conn.image = this.image.clone();
          conn.node.run();
        } else {
          conn.image = null;
          conn.node.run();
        }
      })
    })
  }


  run() {
    this.timer.textContent = (Date.now() - this.runTimer) + 'ms';

    if (this.image) {
      this.bmpSize.textContent = this.image.bitmap.width+'x'+this.image.bitmap.height;
    } else {
      this.bmpSize.textContent = '';
    }

    if (this.graph.selectedNode == this) {
      this.view();
    }

    if (this.image) {
      this.image.getBufferAsync(Jimp.MIME_PNG).then(i => {
        this.preview.setAttributeNS(null, 'href', 'data:'+Jimp.MIME_PNG+';base64,'+i.toString('base64'));
      })
    } else {
      this.preview.setAttributeNS(null, 'href', '');
    }

    this.passImageToChildren();
  }
}
