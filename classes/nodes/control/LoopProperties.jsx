import Properties from '../Properties.js';

export default class LoopProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasLoopOutput: props.node.inputs[2].parent ? true : false,
      hasLoopInput: props.node.outputs[1].connections.length ? true : false,
      hasNumLoopsInput: props.node.inputs[1].parent ? true : false,
    }

    this.numLoopsChange = this.numLoopsChange.bind(this);
  }


  numLoopsChange(event) {
    const elm = document.getElementById('numLoopsInput');
    this.props.node.numLoops = Number(elm.value);
    this.props.node.run(null);
  }


  renderNumLoops() {
    if (!this.state.hasNumLoopsInput) {
      return (
        <div>
          Number of Loops<br/>
          <input id="numLoopsInput" type="number" min="1" defaultValue={this.props.node.numLoops} onChange={(event) => {this.numLoopsChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Loop</div>
        <div style={{padding:'10px'}}>
          This node creates a loop that runs n times.
          <br/><br/>
          The loop starts with the "loop start" output and ends with the "loop end" input.  Loop start and loop end should connect to each other with nodes in between.
          <br/><br/>
          After the loop is finished the output image will be set.
          <br/><br/>
          {this.renderNumLoops()}
          <br/><br/>
          Increment output starts with 0 and adds 1 each loop.
        </div>
      </div>
    )
  }
}
