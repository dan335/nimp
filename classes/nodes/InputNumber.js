import Input from './Input.js';


export default class InputNumber extends Input {
  constructor(node, index, name) {
    super(node, index, name, 'Number');
    this.number = null;
  }
}
