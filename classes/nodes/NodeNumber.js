import Node from './Node.js';


export default class NodeNumber extends Node {
  constructor(className, graph, x, y, name, propertiesComponent, settings) {
    super(className, graph, x, y, name, propertiesComponent, settings);

    this.number = 1;

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
        if (this.number == null || isNaN(this.number)) {
          conn.number = null;
        } else {
          conn.number = this.number;
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
    if (this.number != null) {
      this.textPreview.textContent = this.number;
    } else {
      this.textPreview.textContent = '';
    }
  }
}
