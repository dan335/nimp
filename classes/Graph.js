export default class Graph {
  constructor(svg, component) {
    this.svg = svg;
    this.component = component;
    this.nodes = [];
    this.selectedNode = null;
    this.viewedNode = null;
  }


  createNode(classObject, x, y) {
    this.nodes.push(new classObject(this, x, y));
  }


  selectNode(node) {
    if (this.selectedNode) {
      this.selectedNode.deselect();
    }
    this.selectedNode = node;
    node.select();
  }


  viewNode(node) {
    if (this.viewedNode) {
      this.viewedNode.deView();
    }
    this.viewedNode = node;
    node.view();
  }
}
