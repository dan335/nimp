import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import Input from '../Input.js';
import functions from '../../../lib/functions.js';



export default class LoopOutputImageLoopInput extends OutputImage {
  constructor(node, index, name) {
    super(node, index, name);
  }


  connectionMade() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasLoopInput:true});
    }
  }


  connectionRemoved() {
    if (this.node.bg.classList.contains('selected')) {
      this.node.propertiesComponentInstance.setState({hasLoopInput:false});
    }
  }


  // makeConnection(inputConnection) {
  //   if (!inputConnection) {
  //     console.error('No input connection');
  //     console.log(inputConnection);
  //   }
  //   if (this.connections.includes(inputConnection)) return;
  //   if (this == inputConnection) return;
  //
  //   if (inputConnection.parent) {
  //     inputConnection.parent.removeConnection(inputConnection, false);
  //   }
  //
  //   if (!(inputConnection instanceof InputImage)) return;
  //   if (inputConnection.node == this.node) return;
  //   //if (functions.isNodeInParents(this.node, inputConnection.node)) return;
  //
  //   if (this.type != inputConnection.type) return;
  //
  //   this.connections.push(inputConnection);
  //   inputConnection.parent = this;
  //   this.removeConnectionSplines();
  //   this.createConnectionSplines();
  //   inputConnection.connectionMade();
  //   this.connectionMade();
  //   this.node.passToChildren();
  // }


  makeConnection(inputConnection) {
    if (this.connections.includes(inputConnection)) return;
    if (this == inputConnection) return;

    if (inputConnection.parent) {
      inputConnection.parent.removeConnection(inputConnection, false);
    }

    if (!(inputConnection instanceof Input)) return;
    if (inputConnection.node == this.node) return;
    //if (functions.isNodeInParents(this.node, inputConnection.node)) return;

    if (this.type != inputConnection.type) return;

    this.connections.push(inputConnection);
    inputConnection.parent = this;
    this.removeConnectionSplines();
    this.createConnectionSplines();
    inputConnection.connectionMade();
    this.connectionMade();

    this.node.isInsideALoop = functions.isInsideALoop(this.node);
    inputConnection.node.isInsideALoop = functions.isInsideALoop(inputConnection.node);

    this.node.passToChildren();
    //this.node.run();
  }
}
