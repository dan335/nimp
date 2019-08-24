import InputNumber from '../InputNumber.js';


export default class InputNumberLineWidth extends InputNumber {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasLineWidthInput:true});
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasLineWidthInput:false});
    }
  }
}
