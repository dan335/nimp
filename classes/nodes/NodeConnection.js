export default class NodeConnection {
  constructor(node, index) {
    this.node = node;
    this.index = index;
    this.connection = null;
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


  connectTo(otherConnection) {
    if (this.connection == otherConnection) return;
    this.connection = otherConnection;
    this.createConnectionSpline();
    this.node.passImageToChildren();
  }


  createConnectionSpline() {
    const pos = this.getPosition();
    const oPos = this.connection.getPosition();
    this.connectionSpline = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    let d = 'M'+pos.x+','+pos.y;
    d += ' C'+(pos.x+60)+','+pos.y;
    d += ' '+(oPos.x-60)+','+oPos.y;
    d += ' '+oPos.x+','+oPos.y;
    this.connectionSpline.setAttributeNS(null, 'd', d);
    this.connectionSpline.classList.add('nodeConnectionSpline');
    this.node.graph.svg.prepend(this.connectionSpline);
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
