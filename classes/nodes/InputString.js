import Input from './Input.js';


export default class InputString extends Input {
  constructor(node, index, name, stateVariableName) {
    super(node, index, name, 'String');
    this.string = null;
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
