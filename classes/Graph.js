var ObjectId = require('bson-objectid');
import functions from '../lib/functions.js';
import settings from '../lib/settings.js';
import Jimp from 'jimp';


export default class Graph {
  constructor(svg, component) {
    this.id = new ObjectId().toHexString();
    this.svg = svg;
    this.component = component; // link to GraphView.jsx
    this.nodes = [];
    this.selectedNode = null;
    this.viewedNode = null;

    this.title = 'New Graph';
    this.isPublic = true;
    this.anyoneCanOverwrite = false;
    this.userId = null;

    // set after graph is saved
    this.url = null;
    this.slug = null;

    // update name in GraphProperties.jsx
    const elm = document.getElementById('graphTitleInput');
    if (elm) {
      elm.value = this.title;
    }
  }


  createNode(className, classObject, x, y, settings, run) {
    let node = new classObject(className, this, x, y, settings);
    this.nodes.push(node);
    if (run) {
      node.run(null);
    }
    return node;
  }


  deleteNode(node) {
    this.nodes = this.nodes.filter(n => {
      return n != node;
    })

    node.delete();
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

    // // update name in GraphProperties.jsx
    // const elm = document.getElementById('graphTitleInput');
    // if (elm) {
    //   elm.value = this.title;
    // }

    // create nodes
    json.nodes.forEach(node => {
      const classObject = functions.getClassFromName(node.className);
      if (classObject) {
        const createdNode = this.createNode(node.className, classObject, node.x, node.y, node.settings, false);

        createdNode.id = node.id;

        // assign ids to inputs
        for (let n = 0; n < createdNode.inputs.length; n++) {
          if (node.inputs[n]) {
            createdNode.inputs[n].id = node.inputs[n].id;
          } else {
            console.error('Load error: Could not get input.');
          }
        }

        // assign ids to outputs
        for (let n = 0; n < createdNode.outputs.length; n++) {
          if (node.outputs[n]) {
            createdNode.outputs[n].id = node.outputs[n].id;
          } else {
            console.error('Load error: Could not get output.  Probably an old graph.', createdNode.outputs[n], node);
          }
        }

        createdNode.tempJson = node;  // store so that later we can create connections

      } else {
        console.error('Could not find class', node.className);
      }
    })

    // create connections
    this.nodes.forEach(node => {
      for (let n = 0; n < node.outputs.length; n++) {
        if (node.tempJson.outputs[n]) {
          const connectedInputIds = node.tempJson.outputs[n].connections;
          connectedInputIds.forEach(id => {

            // find input with id
            let input = null;
            this.nodes.forEach(n => {
              n.inputs.forEach(i => {
                if (i.id == id) {
                  input = i;
                }
              })
            })

            if (input) {
              node.outputs[n].makeConnection(input);
            } else {
              console.error('Load error: Could not find input with id.');
            }
          })
        }
      }
    })

    // run root nodes
    let rootNodes = [];
    this.nodes.forEach(node => {
      let isRoot = true;
      node.inputs.forEach(input => {
        if (input.parent) {
          isRoot = false;
        }
      })

      if (isRoot) {
        rootNodes.push(node);
      }
    })

    rootNodes.forEach(node => {
      node.run();
    })

    // view output node
    const outputNode = this.getOutputNode();
    if (outputNode) {
      this.viewNode(outputNode);
    }
  }


  getThumbnail() {
    return new Promise((resolve, reject) => {

      const outputNode = this.getOutputNode();

      if (outputNode && outputNode.image) {
        outputNode.image.clone().cover(settings.thumbnailWidth, settings.thumbnailHeight, (error, image) => {
          if (error) {
            resolve(null);
          } else {
            image.getBufferAsync(Jimp.MIME_JPEG).then(i => {
              resolve('data:'+Jimp.MIME_JPEG+';base64,'+i.toString('base64'));
            })
          }
        })
      } else {
        resolve(null);
      }
    })
  }


  getOutputNode() {
    for (let n = 0; n < this.nodes.length; n++) {
      if (this.nodes[n].className == 'Output') {
        return this.nodes[n];
      }
    }
    return null;
  }
}
