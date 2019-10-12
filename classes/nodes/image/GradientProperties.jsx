import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class GradientProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasColorAInput: props.node.inputs[2].parent ? true : false,
      hasColorBInput: props.node.inputs[3].parent ? true : false,
    }
  }

  colorAChange() {
    const elm = document.getElementById('colorAInput');
    this.props.node.colorA = elm.value;
    this.props.node.run(null);
  }

  colorBChange() {
    const elm = document.getElementById('colorBInput');
    this.props.node.colorB = elm.value;
    this.props.node.run(null);
  }



  renderColorA() {
    if (!this.state.hasColorAInput) {
      return (
        <div>
          Color A &nbsp;
          <input id="colorAInput" type="text" defaultValue={this.props.node.colorA} onChange={(event) => {this.colorAChange(event);}} />
        </div>
      )
    }
  }

  renderColorB() {
    if (!this.state.hasColorBInput) {
      return (
        <div>
          Color B &nbsp;
          <input id="colorBInput" type="text" defaultValue={this.props.node.colorB} onChange={(event) => {this.colorBChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Gradient</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />

          <br/><br/>
          {this.renderColorA()}
          {this.renderColorB()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
