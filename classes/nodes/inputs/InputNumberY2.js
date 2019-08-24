import InputNumber from '../InputNumber.js';


export default class InputNumberY2 extends InputNumber {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasY2Input:true});
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasY2Input:false});
    }
  }
}
