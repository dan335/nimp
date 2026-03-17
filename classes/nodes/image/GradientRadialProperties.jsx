import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class GradientRadialProperties extends Properties {
  constructor(props) {
    super(props);
    this.state = {
      hasColorAInput: props.node.inputs[2].parent ? true : false,
      hasColorBInput: props.node.inputs[3].parent ? true : false,
    }
  }

  colorAChange() {
    const elm = document.getElementById('gradientRadialColorAInput');
    this.props.node.colorA = elm.value;
    this.props.node.run(null);
  }

  colorBChange() {
    const elm = document.getElementById('gradientRadialColorBInput');
    this.props.node.colorB = elm.value;
    this.props.node.run(null);
  }

  renderColorA() {
    if (!this.state.hasColorAInput) {
      return (
        <div>
          Center Color &nbsp;
          <input id="gradientRadialColorAInput" type="text" defaultValue={this.props.node.colorA} onChange={(event) => {this.colorAChange(event);}} />
        </div>
      )
    }
  }

  renderColorB() {
    if (!this.state.hasColorBInput) {
      return (
        <div>
          Edge Color &nbsp;
          <input id="gradientRadialColorBInput" type="text" defaultValue={this.props.node.colorB} onChange={(event) => {this.colorBChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Gradient Radial</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <br/><br/>
          {this.renderColorA()}
          {this.renderColorB()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
