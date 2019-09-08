// need to eventually merge InputNumber with this and update all nodes to use this


import InputColor from './InputColor.js';


export default class InputColorState extends InputColor {
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
