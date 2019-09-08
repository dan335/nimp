import Node from './Node.js';


export default class NodeString extends Node {
  constructor(className, graph, x, y, name, propertiesComponent, settings) {
    super(className, graph, x, y, name, propertiesComponent, settings);

    this.string = 'Nimp';

    this.textPreview.style.display = 'block';
    this.renderName();
  }


  view() {
    // do nothing
  }

  deView() {
    // do nothing
  }


  passToChildren() {
    this.outputs.forEach(output => {
      output.connections.forEach(conn => {
        if (this.string == null) {
          conn.string = null;
        } else {
          conn.string = this.string;
        }
        conn.runNode();
      })
    })
  }


  run(inputThatTriggered) {
    this.timer.textContent = (Date.now() - this.runTimer) + 'ms';
    this.bg.classList.remove('running');
    this.passToChildren();
    this.renderPreview();
  }


  renderPreview() {
    if (this.string != null) {
      this.textPreview.textContent = this.string;
    } else {
      this.textPreview.textContent = '';
    }
  }
}
