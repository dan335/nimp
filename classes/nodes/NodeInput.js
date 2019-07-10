import NodeConnection from './NodeConnection.js';
import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';


export default class NodeInput extends NodeConnection {
  constructor(node, index) {
    super(node, index);
    this.parent = null;
    this.image = null;
  }

  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', 10 * -1);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2 + (settings.nodeHeight * this.index));
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    this.dot.onmouseup = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (this.node.graph.component.state.mouseState && this.node.graph.component.state.mouseState.type == 'draggingNewConnection') {
        this.node.graph.component.state.mouseState.data.makeConnection(this);
      }

      this.node.graph.component.setState({
        mouseState: null
      })
    }

    super.createSvgElm();
  }
}
