import Connection from './Connection.js';
import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';


export default class Input extends Connection {
  constructor(node, index, name, type) {
    super(node, index, name, type);
    this.parent = null;
  }

  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', 12 * -1);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2 + settings.connectionSpaceBetween * this.index);
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    this.dot.onmouseup = (event) => {
      event.stopPropagation();
      event.preventDefault();
      if (this.node.graph.component.state.mouseState && this.node.graph.component.state.mouseState.type == 'draggingNewConnection') {
        if (this.node.graph.component.state.mouseState.data) {
          this.node.graph.component.state.mouseState.data.makeConnection(this);
        }
      }

      this.node.graph.component.setState({
        mouseState: null
      })
    }

    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttributeNS(null, 'x', 25 * -1);
    text.setAttributeNS(null, 'y', settings.nodeHeight * 0.65  + settings.connectionSpaceBetween * this.index);
    text.setAttributeNS(null, 'fill', 'hsl(209, 10%, 60%)');
    text.textContent = this.type+':'+this.name;
    text.setAttribute('style', 'pointer-events:none;');
    text.setAttributeNS(null, 'text-anchor', 'end');
    text.setAttributeNS(null, 'font-size', 12);
    this.node.g.prepend(text);

    super.createSvgElm();
  }


  runNode() {
    // run node.  pass this so node knows which input triggered it
    this.node.run(this);
  }


  connectionMade() {}
  connectionRemoved() {}
}
