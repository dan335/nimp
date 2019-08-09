import Connection from './Connection.js';
import settings from '../../lib/settings.js';
import Input from './Input.js';
import functions from '../../lib/functions.js';


export default class Output extends Connection {
  constructor(node, index, name, type) {
    super(node, index, name, type);
    this.connections = [];
    this.connectionsSplines = [];
    this.isInput = false;
  }


  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', settings.nodeWidth + 16);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2 + settings.connectionSpaceBetween * this.index);
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    this.helpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.helpText.setAttributeNS(null, 'x', settings.nodeWidth + 30);
    this.helpText.setAttributeNS(null, 'y', settings.nodeHeight * 0.65 + settings.connectionSpaceBetween * this.index);
    this.helpText.setAttributeNS(null, 'fill', 'hsl(209, 10%, 80%)');
    this.helpText.textContent = this.type+' : '+this.title;
    this.helpText.setAttribute('style', 'pointer-events:none;');
    this.helpText.setAttributeNS(null, 'text-anchor', 'start');
    this.helpText.setAttributeNS(null, 'font-size', 12);
    this.node.g.prepend(this.helpText);
    this.helpText.style.display = 'none';

    this.dot.onmousedown = (event) => {
      event.stopPropagation();
      this.node.graph.component.mouseState = {
        type: 'draggingNewConnection',
        data: {
          from: this,
          to: null,
          isFromOutput: true
        }
      };
    }

    this.dot.onmouseenter = (event) => {
      if (this.node.graph.component.mouseState && this.node.graph.component.mouseState.type == 'draggingNewConnection') {
        if (!this.node.graph.component.mouseState.data.isFromOutput) {
          this.node.graph.component.mouseState.data.to = this;
        }
      }

      this.node.showConnectionHelpText();
    }

    this.dot.onmouseleave = (event) => {
      if (this.node.graph.component.mouseState && this.node.graph.component.mouseState.type == 'draggingNewConnection') {
        if (this != this.node.graph.component.mouseState.data.from) {
          if (!this.node.graph.component.mouseState.data.isFromOutput) {
            this.node.graph.component.mouseState.data.to = null;
          }
        }
      }

      this.node.hideConnectionHelpText();
    }
  }



  makeConnection(inputConnection) {
    if (this.connections.includes(inputConnection)) return;
    if (this == inputConnection) return;

    if (inputConnection.parent) {
      inputConnection.parent.removeConnection(inputConnection, false);
    }

    if (!(inputConnection instanceof Input)) return;
    if (inputConnection.node == this.node) return;
    if (functions.isNodeInParents(this.node, inputConnection.node)) return;

    if (this.type != inputConnection.type) return;

    this.connections.push(inputConnection);
    inputConnection.parent = this;
    this.removeConnectionSplines();
    this.createConnectionSplines();
    inputConnection.connectionMade();
    this.connectionMade();

    this.node.isInsideALoop = functions.isInsideALoop(this.node);
    inputConnection.node.isInsideALoop = functions.isInsideALoop(inputConnection.node);

    this.node.passToChildren();
    //this.node.run();
  }


  removeConnection(inputConnection, run) {
    this.connections = this.connections.filter(conn => {
      return conn != inputConnection;
    })
    inputConnection.parent = null;
    inputConnection.image = null;
    inputConnection.connectionRemoved();
    this.connectionRemoved();
    this.removeConnectionSplines();
    this.createConnectionSplines();

    this.node.isInsideALoop = functions.isInsideALoop(this.node);
    inputConnection.node.isInsideALoop = functions.isInsideALoop(inputConnection.node);

    if (run) {
      inputConnection.node.run(null);
    }
  }


  removeConnectionSplines() {
    this.connectionsSplines.forEach(spline => {
      spline.parentNode.removeChild(spline);
    })
    this.connectionsSplines = [];
  }


  createConnectionSplines() {
    this.connections.forEach(conn => {
      const pos = this.getPosition();
      const oPos = conn.getPosition();
      let spline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      let d = 'M'+pos.x+','+pos.y;
      d += ' C'+(pos.x+100)+','+pos.y;
      d += ' '+(oPos.x-100)+','+oPos.y;
      d += ' '+oPos.x+','+oPos.y;
      spline.setAttributeNS(null, 'd', d);
      spline.classList.add('nodeConnectionSpline');
      spline.onclick = () => {
        this.removeConnection(conn, true);
      }
      this.node.graph.svg.prepend(spline);
      this.connectionsSplines.push(spline);
    })
  }


  connectionMade() {}
  connectionRemoved() {}


  toJson() {
    let json = super.toJson();

    json.connections = [];

    this.connections.forEach(input => {
      json.connections.push(input.id);
    })

    return json;
  }
}
