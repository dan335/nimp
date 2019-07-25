import Properties from '../Properties.js';

export default class OutputLevelsProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasMinInput: props.node.inputs[1].parent ? true : false,
      hasMaxInput: props.node.inputs[2].parent ? true : false,
    }
  }


  minChange(event) {
    const elm = document.getElementById('minInput');
    this.props.node.min = Number(elm.value);
    this.props.node.run(null);
  }

  maxChange(event) {
    const elm = document.getElementById('maxInput');
    this.props.node.max = Number(elm.value);
    this.props.node.run(null);
  }


  renderMin() {
    if (!this.state.hasMinInput) {
      return (
        <div>
          Min &nbsp; 0 - 255<br/>
          <input id="minInput" type="number" min="0" max="255" step="1" defaultValue={this.props.node.min} onChange={(event) => {this.minChange(event);}} />
        </div>
      )
    }
  }

  renderMax() {
    if (!this.state.hasMaxInput) {
      return (
        <div>
          Max &nbsp; 0 - 255<br/>
          <input id="maxInput" type="number" min="0" max="255" step="1" defaultValue={this.props.node.max} onChange={(event) => {this.maxChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Output Levels</div>
        <div style={{padding:'10px'}}>
          {this.renderMin()}
          <br/>
          {this.renderMax()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
