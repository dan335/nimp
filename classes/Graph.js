var ObjectId = require('bson-objectid');
import functions from '../lib/functions.js';


export default class Graph {
  constructor(svg, component) {
    this.id = new ObjectId().toHexString();
    this.svg = svg;
    this.component = component; // link to pages/index.jsx
    this.nodes = [];
    this.selectedNode = null;
    this.viewedNode = null;
    this.title = 'New Graph';

    // set after graph is saved
    this.url = null;
    this.slug = null;

    // update name in GraphProperties.jsx
    const elm = document.getElementById('graphTitleInput');
    if (elm) {
      elm.value = this.title;
    }
  }


  createNode(className, classObject, x, y, settings) {
    let node = new classObject(className, this, x, y, settings);
    this.nodes.push(node);
    return node;
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
      title: this.title,
      nodes: []
    };

    this.nodes.forEach(node => {
      json.nodes.push(node.toJson());
    })

    return json;
  }


  fromJson(json) {
    this.id = json.id;
    this.title = json.title;

    // update name in GraphProperties.jsx
    const elm = document.getElementById('graphTitleInput');
    if (elm) {
      elm.value = this.title;
    }

    // create nodes
    json.nodes.forEach(node => {
      const classObject = functions.getClassFromName(node.className);
      if (classObject) {
        const createdNode = this.createNode(node.className, classObject, node.x, node.y, node.settings);

        createdNode.id = node.id;

        // assign ids to inputs
        for (let n = 0; n < createdNode.inputs.length; n++) {
          if (node.inputs[n]) {
            createdNode.inputs[n].id = node.inputs[n].id;
          } else {
            console.error('Could not get input.');
          }
        }

        // assign ids to outputs
        for (let n = 0; n < createdNode.outputs.length; n++) {
          if (node.outputs[n]) {
            createdNode.outputs[n].id = node.outputs[n].id;
          } else {
            console.error('Could not get output.');
          }
        }

        createdNode.tempJson = node;  // store so that later we can create connections

      } else {
        console.error('Could not find class', node.className);
      }
    })

    // create connections
    this.nodes.forEach(node => {

    })
  }
}
