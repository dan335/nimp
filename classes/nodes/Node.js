import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';
var ObjectId = require('bson-objectid');


export default class Node {
  constructor(className, graph, x, y, title, propertiesComponent, nodeSettings) {
    this.className = className;
    this.id = new ObjectId().toHexString();
    this.graph = graph;
    this.inputs = [];
    this.outputs = [];
    this.x = x - settings.nodeWidth / 2;
    this.y = y - settings.nodeHeight / 2;
    this.title = title;
    this.propertiesComponent = propertiesComponent;
    this.isInsideALoop = false;
    this.createSvgElm();
    this.lastClick = 0;
    this.isMouseDown = false;
    this.lastMousePos = {x:0,y:0};
    this.isHelpTextVisible = false;
    this.run = this.run.bind(this);
    this.name = typeof nodeSettings.name !== 'undefined' ? nodeSettings.name : '';
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

    this.bg.onmousedown = (event) => {
      this.graph.component.svgLastMousePos = functions.getPointFromEvent(event);
      this.graph.component.mouseState = {
        type: 'draggingNode',
        data: this
      }
    }

    this.bg.onmouseenter = (event) => {
      this.showConnectionHelpText();
    }

    this.bg.onmouseleave = (event) => {
      this.isMouseDown = false;
      this.hideConnectionHelpText();
    }

    this.g.appendChild(this.bg);

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, 'x', settings.nodeWidth / 2);
    text.setAttributeNS(null, 'y', settings.nodeHeight / 2 + 5);
    text.setAttributeNS(null, 'fill', '#fff');
    text.textContent = this.title;
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

    // for number nodes
    this.textPreview = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.textPreview.setAttributeNS(null, 'x', settings.nodeWidth/2);
    this.textPreview.setAttributeNS(null, 'y', settings.nodeHeight*1.6);
    this.textPreview.setAttributeNS(null, 'width', settings.nodeWidth);
    this.textPreview.setAttributeNS(null, 'height', settings.nodeWidth);
    this.textPreview.setAttribute('style', 'pointer-events:none;');
    this.textPreview.setAttributeNS(null, 'fill', '#fff');
    this.textPreview.setAttributeNS(null, 'font-size', 14);
    this.textPreview.setAttributeNS(null, 'text-anchor', 'middle');
    this.textPreview.textContent = '';
    this.textPreview.style.display = 'none';
    this.g.appendChild(this.textPreview);

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


  onClick() {
    const now = new Date().getTime();
    if (now - this.lastClick < 400) {
      this.graph.viewNode(this);
    }
    this.graph.selectNode(this);
    this.lastClick = now;
  }


  select() {
    this.bg.classList.add('selected');
    this.graph.component.setState({
      properties:{component:this.propertiesComponent, node:this},
      propertiesKey: Math.random()
    });
  }


  view() {

  }


  deselect() {
    this.bg.classList.remove('selected');
    this.graph.component.setState({properties:null});
  }


  delete() {
    this.removeAllConnections();

    this.inputs.forEach(input => {
      input.delete();
    })

    this.outputs.forEach(output => {
      output.delete();
    })

    this.bg.oncontextmenu = undefined;
    this.bg.onclick = undefined;
    this.bg.onmouseup = undefined;
    this.bg.onmousedown = undefined;
    this.bg.onmousemove = undefined;
    this.bg.onmouseenter = undefined;
    this.bg.onmouseleave = undefined;

    while (this.g.firstChild) {
      this.g.removeChild(this.g.firstChild);
    }

    this.graph.svg.removeChild(this.g);
  }


  removeAllConnections() {
    this.inputs.forEach(input => {
      if (input.parent) {
        input.parent.removeConnection(input, false);
      }
    })

    this.outputs.forEach(output => {
      output.connections.forEach(conn => {
        output.removeConnection(conn, true);
      })
    })
  }


  toJson() {
    let json = {
      className: this.className,
      id: this.id,
      x: this.x,
      y: this.y,
      inputs: [],
      outputs: [],
      settings: {
        name: this.name
      }
    };

    this.inputs.forEach(input => {
      json.inputs.push(input.toJson());
    })

    this.outputs.forEach(output => {
      json.outputs.push(output.toJson());
    })

    return json;
  }


  showConnectionHelpText() {
    if (!this.isHelpTextVisible) {
      this.inputs.forEach(input => {
        input.showHelpText();
      })
      this.outputs.forEach(output => {
        output.showHelpText();
      })
    }

    this.isHelpTextVisible = true;
  }


  hideConnectionHelpText() {
    if (this.isHelpTextVisible) {
      this.inputs.forEach(input => {
        input.hideHelpText();
      })
      this.outputs.forEach(output => {
        output.hideHelpText();
      })
    }

    this.isHelpTextVisible = false;
  }


  connectionMade() {
  }

  connectionRemoved() {
  }


  renderName() {
    this.bmpSize.textContent = this.name;
  }
}
