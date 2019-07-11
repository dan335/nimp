export default class Connection {
  constructor(node, index, name, type) {
    this.node = node;
    this.index = index;
    this.name = name;
    this.type = type;
    this.createSvgElm();
  }


  createSvgElm() {
    this.dot.onmousedown = (event) => {
      event.stopPropagation();
      this.node.graph.component.setState({
        mouseState: {
          type: 'draggingNewConnection',
          data: this
        }
      })
    }
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
}
