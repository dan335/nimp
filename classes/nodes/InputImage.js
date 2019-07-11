import Input from './Input.js';


export default class InputImage extends Input {
  constructor(node, index, name) {
    super(node, index, name, 'Image');
    this.image = null;
  }
}
