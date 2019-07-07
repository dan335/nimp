import NodeConnection from './NodeConnection.js';
import settings from '../../lib/settings.js';

export default class NodeOutput extends NodeConnection {
  constructor(node, index) {
    super(node, index);
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
        this.connectTo(this.node.graph.component.state.mouseState.data);
      }

      this.node.graph.component.setState({
        mouseState: null
      })
    }

    super.createSvgElm();
  }
}
