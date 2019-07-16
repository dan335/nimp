import Input from './Input.js';


export default class InputColor extends Input {
  constructor(node, index, name) {
    super(node, index, name, 'Color');
    this.color = null;
  }
}
