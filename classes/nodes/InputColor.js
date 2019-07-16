import Input from './Input.js';


export default class InputColor extends Input {
  constructor(node, index, name) {
    super(node, index, name, 'Color');
    this.color = null;
  }

  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasColorInput:true});
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasColorInput:false});
    }
  }
}
