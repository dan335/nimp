// need to eventually merge InputNumber with this and update all nodes to use this


import InputNumber from './InputNumber.js';


export default class InputNumberState extends InputNumber {
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
