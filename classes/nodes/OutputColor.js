import Output from './Output.js';


export default class OutputColor extends Output {
  constructor(node, index, name) {
    super(node, index, name, 'Color');
  }


  removeConnection(inputConnection, run) {
    inputConnection.color = null;
    super.removeConnection(inputConnection, run);
  }
}
