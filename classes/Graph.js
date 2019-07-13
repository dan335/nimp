var ObjectId = require('bson-objectid');


export default class Graph {
  constructor(svg, component) {
    this.id = new ObjectId().toHexString();
    this.svg = svg;
    this.component = component;
    this.nodes = [];
    this.selectedNode = null;
    this.viewedNode = null;
  }


  createNode(className, classObject, x, y) {
    this.nodes.push(new classObject(className, this, x, y));
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


  toJson() {
    let json = {
      id: this.id,
      nodes: []
    };

    this.nodes.forEach(node => {
      json.nodes.push(node.toJson());
    })

    return json;
  }
}
