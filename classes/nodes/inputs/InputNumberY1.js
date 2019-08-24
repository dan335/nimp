import InputNumber from '../InputNumber.js';


export default class InputNumberY1 extends InputNumber {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasY1Input:true});
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasY1Input:false});
    }
  }
}
