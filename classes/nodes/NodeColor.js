import Node from './Node.js';
const tinycolor = require("tinycolor2");


export default class NodeColor extends Node {
  constructor(className, graph, x, y, name, propertiesComponent) {
    super(className, graph, x, y, name, propertiesComponent);

    this.color = tinycolor('#fff');
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
        if (this.color == null) {
          conn.color = null;
        } else {
          conn.color = this.color;
        }
        conn.runNode();
      })
    })
  }


  run(inputThatTriggered) {
    this.timer.textContent = (Date.now() - this.runTimer) + 'ms';
    this.bg.classList.remove('running');
    this.passToChildren();
  }
}
