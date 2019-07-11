import InputNumber from '../InputNumber.js';


export default class ResizeInputNumberX extends InputNumber {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      if (this.node.propertiesComponentInstance) {  // not sure why this wouldn't be set
        this.node.propertiesComponentInstance.setState({hasXInput:true});
      }
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      if (this.node.propertiesComponentInstance) {
        this.node.propertiesComponentInstance.setState({hasXInput:false});
      }
    }
  }
}
