import Output from './Output.js';


export default class OutputString extends Output {
  constructor(node, index, name) {
    super(node, index, name, 'String');
  }


  removeConnection(inputConnection, run) {
    inputConnection.string = null;
    super.removeConnection(inputConnection, run);
  }
}
