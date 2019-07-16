import InputNumber from '../InputNumber.js';


export default class CircleInputNumberPadding extends InputNumber {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasPaddingInput:true});
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasPaddingInput:false});
    }
  }
}
