// need to eventually merge InputNumber with this and update all nodes to use this


import InputImage from './InputImage.js';


export default class InputImageState extends InputImage {
  constructor(node, index, name, stateVariableName) {
    super(node, index, name);
    this.stateVariableName = stateVariableName;
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      const t = {};
      t[this.stateVariableName] = true;
      this.node.propertiesComponentInstance.setState(t);
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      const t = {};
      t[this.stateVariableName] = false;
      this.node.propertiesComponentInstance.setState(t);
    }
  }
}
