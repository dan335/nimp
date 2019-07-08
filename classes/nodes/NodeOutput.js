import NodeConnection from './NodeConnection.js';
import settings from '../../lib/settings.js';


export default class NodeOutput extends NodeConnection {
  constructor(node, index) {
    super(node, index);
    this.connections = [];
    this.connectionsSplines = [];
  }


  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', settings.nodeWidth + 10);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2);
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    this.dot.onmouseup = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (this.node.graph.component.state.mouseState && this.node.graph.component.state.mouseState.type == 'draggingNewConnection') {
        this.makeConnection(this.node.graph.component.state.mouseState.data);
      }

      this.node.graph.component.setState({
        mouseState: null
      })
    }

    super.createSvgElm();
  }



  makeConnection(inputConnection) {
    if (this.connections.includes(inputConnection)) return;
    if (this == inputConnection) return;

    if (inputConnection.parent) {
      inputConnection.parent.removeConnection(inputConnection, false);
    }

    this.connections.push(inputConnection);
    inputConnection.parent = this;
    this.removeConnectionSplines();
    this.createConnectionSplines();
    this.node.passImageToChildren();
  }


  removeConnection(inputConnection, run) {
    this.connections = this.connections.filter(conn => {
      return conn != inputConnection;
    })
    inputConnection.parent = null;
    inputConnection.image = null;
    this.removeConnectionSplines();
    this.createConnectionSplines();

    if (run) {
      inputConnection.node.run();
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
      d += ' C'+(pos.x+60)+','+pos.y;
      d += ' '+(oPos.x-60)+','+oPos.y;
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
}
