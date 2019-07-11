import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';


export default class Node {
  constructor(graph, x, y, name, propertiesComponent) {
    this.graph = graph;
    this.inputs = [];
    this.outputs = [];
    this.x = x - settings.nodeWidth / 2;
    this.y = y - settings.nodeHeight / 2;
    this.name = name;
    this.propertiesComponent = propertiesComponent;
    this.image = null;
    this.createSvgElm();
    this.graph.selectNode(this);
    this.run = this.run.bind(this);
    this.lastClick = 0;
    this.graph.viewNode(this);
    this.isMouseDown = false;
    this.lastMousePos = {x:0,y:0};
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
    this.bg.onclick = () => {
      const now = new Date().getTime();
      if (now - this.lastClick < 400) {
        this.graph.viewNode(this);
      }
      this.graph.selectNode(this);
      this.lastClick = now;
    }
    this.bg.onmousedown = (event) => {
      this.isMouseDown = true;
      this.lastMousePos = functions.getPointFromEvent(event);
    }
    this.bg.onmouseup = (event) => {
      this.isMouseDown = false;
    }
    this.bg.onmousemove =(event) => {
      if (this.isMouseDown) {
        const mousePos = functions.getPointFromEvent(event);

        const delta = {
          x: (mousePos.x - this.lastMousePos.x) * this.graph.component.svgZoom,
          y: (mousePos.y - this.lastMousePos.y) * this.graph.component.svgZoom
        }

        this.g.setAttributeNS(null, 'transform', 'translate('+(this.x+delta.x)+' '+(this.y+delta.y)+')');
        this.x += delta.x;
        this.y += delta.y;

        this.lastMousePos = mousePos;

        this.outputs.forEach(conn => {
          conn.removeConnectionSplines();
          conn.createConnectionSplines();
        })

        this.inputs.forEach(conn => {
          if (conn.parent) {
            conn.parent.removeConnectionSplines();
            conn.parent.createConnectionSplines();
          }
        })
      }
    }
    this.bg.onmouseleave = (event) => {
      this.isMouseDown = false;
    }
    this.g.appendChild(this.bg);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, 'x', settings.nodeWidth / 2);
    text.setAttributeNS(null, 'y', settings.nodeHeight / 2 + 5);
    text.setAttributeNS(null, 'fill', '#fff');
    text.textContent = this.name;
    text.setAttribute('style', 'pointer-events:none;');
    text.setAttributeNS(null, 'text-anchor', 'middle');
    this.g.appendChild(text);

    this.preview = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    this.preview.setAttributeNS(null, 'x', 0);
    this.preview.setAttributeNS(null, 'y', settings.nodeHeight+2);
    this.preview.setAttributeNS(null, 'width', settings.nodeWidth);
    this.preview.setAttributeNS(null, 'height', settings.nodeWidth);
    this.preview.setAttributeNS(null, 'preserveAspectRatio', 'xMidYMin meet');
    this.preview.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(this.preview);

    this.timer = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.timer.setAttributeNS(null, 'x', settings.nodeWidth);
    this.timer.setAttributeNS(null, 'y', settings.nodeHeight * 0.24 * -1);
    this.timer.setAttributeNS(null, 'fill', '#fff');
    this.timer.setAttributeNS(null, 'text-anchor', 'end');
    this.timer.setAttributeNS(null, 'font-size', 11);
    this.timer.textContent = '';
    this.timer.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(this.timer);

    this.bmpSize = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.bmpSize.setAttributeNS(null, 'x', 0);
    this.bmpSize.setAttributeNS(null, 'y', settings.nodeHeight * 0.24 * -1);
    this.bmpSize.setAttributeNS(null, 'fill', '#fff');
    this.bmpSize.setAttributeNS(null, 'font-size', 11);
    this.bmpSize.textContent = '';
    this.bmpSize.setAttribute('style', 'pointer-events:none;');
    this.g.appendChild(this.bmpSize);
  }


  select() {
    this.bg.classList.add('selected');
    this.graph.component.setState({properties:{component:this.propertiesComponent, node:this}});
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


  deselect() {
    this.bg.classList.remove('selected');
    this.graph.component.setState({properties:null});
  }


  deView() {
    this.bg.classList.remove('viewed');
    const elm = document.getElementById('nodeViewImage');
    if (elm) {
      elm.src = '';
    }
  }


  passImageToChildren() {
    this.outputs.forEach(output => {
      output.connections.forEach(conn => {
        if (this.image) {
          conn.image = this.image;
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

    this.passImageToChildren();
  }
}
