import Connection from './Connection.js';
import settings from '../../lib/settings.js';
import Input from './Input.js';
import functions from '../../lib/functions.js';


export default class Output extends Connection {
  constructor(node, index, name, type) {
    super(node, index, name, type);
    this.connections = [];
    this.connectionsSplines = [];

    this.onMouseUp = this.onMouseUp.bind(this);
  }


  onMouseUp(event) {
    event.stopPropagation();
    event.preventDefault();

    if (this.node.graph.component.state.mouseState && this.node.graph.component.state.mouseState.type == 'draggingNewConnection') {
      if (this.node.graph.component.state.mouseState.data) {
        this.makeConnection(this.node.graph.component.state.mouseState.data);
      }
    }

    this.node.graph.component.setState({
      mouseState: null
    })
  }


  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', settings.nodeWidth + 12);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2 + settings.connectionSpaceBetween * this.index);
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    this.dot.onmouseup = (event) => {this.onMouseUp(event)}

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, 'x', settings.nodeWidth + 25);
    text.setAttributeNS(null, 'y', settings.nodeHeight * 0.65 + settings.connectionSpaceBetween * this.index);
    text.setAttributeNS(null, 'fill', 'hsl(209, 10%, 60%)');
    text.textContent = this.type+':'+this.title;
    text.setAttribute('style', 'pointer-events:none;');
    text.setAttributeNS(null, 'text-anchor', 'start');
    text.setAttributeNS(null, 'font-size', 12);
    this.node.g.prepend(text);

    super.createSvgElm();
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
