var ObjectId = require('bson-objectid');


export default class Connection {
  constructor(node, index, title, type) {
    this.id = new ObjectId().toHexString();
    this.node = node;
    this.index = index;
    this.title = title;
    this.type = type;
    this.createSvgElm();
  }


  onMouseUp(event) {
    if (this.node.graph.component.mouseState && this.node.graph.component.mouseState.type == 'draggingNewConnection') {
      if (this.node.graph.component.mouseState.data.from && this.node.graph.component.mouseState.data.to) {
        if (this.node.graph.component.mouseState.data.isFromOutput) {
          this.node.graph.component.mouseState.data.from.makeConnection(this.node.graph.component.mouseState.data.to);
        } else {
          this.node.graph.component.mouseState.data.to.makeConnection(this.node.graph.component.mouseState.data.from);
        }
      }
    }

    this.node.graph.component.mouseState = null;
    this.node.graph.component.removeTempLine();
  }


  getPosition() {
    const bbox = this.dot.getBBox();
    const middleX = bbox.x + (bbox.width / 2);
    const middleY = bbox.y + (bbox.height / 2);
    const pos = {
      x: this.node.x + middleX,
      y: this.node.y + middleY
    }
    return pos;
  }


  toJson() {
    let json = {
      id: this.id
    };

    return json;
  }


  showHelpText() {
    this.helpText.style.display = 'block';
    if (this.node.graph.component.mouseState && this.node.graph.component.mouseState.type == 'draggingNewConnection') {
      if (this.node.graph.component.mouseState.data.from.type == this.type && this.node.graph.component.mouseState.data.from.isInput != this.isInput) {
        this.dot.classList.add('validConnection');
      } else {
        this.dot.classList.add('invalidConnection');
      }
    }
  }


  hideHelpText() {
    this.helpText.style.display = 'none';
    this.dot.classList.remove('validConnection');
    this.dot.classList.remove('invalidConnection');
  }


  delete() {
    this.dot.onmousedown = undefined;
    this.dot.onmouseenter = undefined;
    this.dot.onmouseleave = undefined;
    this.node.g.removeChild(this.dot);
    this.node.g.removeChild(this.helpText);
  }
}
