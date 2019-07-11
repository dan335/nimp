import Node from './Node.js';


export default class NodeNumber extends Node {
  constructor(graph, x, y, name, propertiesComponent) {
    super(graph, x, y, name, propertiesComponent);

    this.number = 1;
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
        conn.node.run();
      })
    })
  }


  run() {
    this.timer.textContent = (Date.now() - this.runTimer) + 'ms';
    this.bg.classList.remove('running');
    this.passToChildren();
  }
}
