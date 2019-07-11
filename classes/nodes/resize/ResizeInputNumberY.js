import InputNumber from '../InputNumber.js';


export default class ResizeInputNumberY extends InputNumber {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      if (this.node.propertiesComponentInstance) {
        this.node.propertiesComponentInstance.setState({hasYInput:true});
      }
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      if (this.node.propertiesComponentInstance) {
        this.node.propertiesComponentInstance.setState({hasYInput:false});
      }
    }
  }
}
