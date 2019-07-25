import Connection from './Connection.js';
import settings from '../../lib/settings.js';
import functions from '../../lib/functions.js';


export default class Input extends Connection {
  constructor(node, index, name, type) {
    super(node, index, name, type);
    this.parent = null;
    this.isInput = true;
  }


  createSvgElm() {
    this.dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    this.dot.setAttributeNS(null, 'cx', 16 * -1);
    this.dot.setAttributeNS(null, 'cy', settings.nodeHeight / 2 + settings.connectionSpaceBetween * this.index);
    this.dot.setAttributeNS(null, 'r', settings.nodeConnectionRadius);
    this.dot.classList.add('nodeConnection');
    this.node.g.appendChild(this.dot);

    //this.dot.onmouseup = (event) => {this.onMouseUp(event)}

    this.helpText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    this.helpText.setAttributeNS(null, 'x', 30 * -1);
    this.helpText.setAttributeNS(null, 'y', settings.nodeHeight * 0.65  + settings.connectionSpaceBetween * this.index);
    this.helpText.setAttributeNS(null, 'fill', 'hsl(209, 10%, 80%)');
    this.helpText.textContent = this.type+' : '+this.title;
    this.helpText.setAttribute('style', 'pointer-events:none;');
    this.helpText.setAttributeNS(null, 'text-anchor', 'end');
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
          isFromOutput: false
        }
      };
    }

    this.dot.onmouseenter = (event) => {
      if (this.node.graph.component.mouseState && this.node.graph.component.mouseState.type == 'draggingNewConnection') {
        if (this.node.graph.component.mouseState.data.isFromOutput) {
          this.node.graph.component.mouseState.data.to = this;
        }
      }

      this.node.showConnectionHelpText();
    }

    this.dot.onmouseleave = (event) => {
      if (this.node.graph.component.mouseState && this.node.graph.component.mouseState.type == 'draggingNewConnection') {
        if (this != this.node.graph.component.mouseState.data.from) {
          if (this.node.graph.component.mouseState.data.isFromOutput) {
            this.node.graph.component.mouseState.data.to = null;
          }
        }
      }

      this.node.hideConnectionHelpText();
    }
  }


  runNode() {
    // run node.  pass this so node knows which input triggered it
    this.node.run(this);
  }


  connectionMade() {}
  connectionRemoved() {}
}
