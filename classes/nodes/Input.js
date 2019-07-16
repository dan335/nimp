import Connection from './Connection.js';
import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';


export default class Input extends Connection {
  constructor(node, index, name, type) {
    super(node, index, name, type);
    this.parent = null;

    this.onMouseUp = this.onMouseUp.bind(this);
  }


  onMouseUp(event) {
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


  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', 12 * -1);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2 + settings.connectionSpaceBetween * this.index);
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    this.dot.onmouseup = (event) => {this.onMouseUp(event)}

    this.helpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.helpText.setAttributeNS(null, 'x', 25 * -1);
    this.helpText.setAttributeNS(null, 'y', settings.nodeHeight * 0.65  + settings.connectionSpaceBetween * this.index);
    this.helpText.setAttributeNS(null, 'fill', 'hsl(209, 10%, 60%)');
    this.helpText.textContent = this.type+':'+this.title;
    this.helpText.setAttribute('style', 'pointer-events:none;');
    this.helpText.setAttributeNS(null, 'text-anchor', 'end');
    this.helpText.setAttributeNS(null, 'font-size', 12);
    this.node.g.prepend(this.helpText);
    this.helpText.style.display = 'none';

    super.createSvgElm();
  }


  runNode() {
    // run node.  pass this so node knows which input triggered it
    this.node.run(this);
  }


  connectionMade() {}
  connectionRemoved() {}
}
