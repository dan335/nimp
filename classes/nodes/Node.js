import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';
var ObjectId = require('bson-objectid');


export default class Node {
  constructor(className, graph, x, y, title, propertiesComponent) {
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


  toJson() {
    let json = {
      className: this.className,
      id: this.id,
      x: this.x,
      y: this.y,
      inputs: [],
      outputs: []
    };

    this.inputs.forEach(input => {
      json.inputs.push(input.toJson());
    })

    this.outputs.forEach(output => {
      json.outputs.push(output.toJson());
    })

    return json;
  }

}
