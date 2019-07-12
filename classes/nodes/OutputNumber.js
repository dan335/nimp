import Output from './Output.js';


export default class OutputNumber extends Output {
  constructor(node, index, name) {
    super(node, index, name, 'Number');
  }


  removeConnection(inputConnection, run) {
    inputConnection.number = null;
    super.removeConnection(inputConnection, run);
  }
}
