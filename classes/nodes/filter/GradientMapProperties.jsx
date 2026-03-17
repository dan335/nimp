import Properties from '../Properties.js';


export default class GradientMapProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasColorAInput: props.node.inputs[1].parent ? true : false,
      hasColorBInput: props.node.inputs[2].parent ? true : false,
    }
  }

  colorAChange() {
    const elm = document.getElementById('gradientMapColorAInput');
    this.props.node.colorA = elm.value;
    this.props.node.run(null);
  }

  colorBChange() {
    const elm = document.getElementById('gradientMapColorBInput');
    this.props.node.colorB = elm.value;
    this.props.node.run(null);
  }

  renderColorA() {
    if (!this.state.hasColorAInput) {
      return (
        <div>
          Color A &nbsp;
          <input id="gradientMapColorAInput" type="text" defaultValue={this.props.node.colorA} onChange={(event) => {this.colorAChange(event);}} />
        </div>
      )
    }
  }

  renderColorB() {
    if (!this.state.hasColorBInput) {
      return (
        <div>
          Color B &nbsp;
          <input id="gradientMapColorBInput" type="text" defaultValue={this.props.node.colorB} onChange={(event) => {this.colorBChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Gradient Map</div>
        <div style={{padding:'10px'}}>
          {this.renderColorA()}
          {this.renderColorB()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
