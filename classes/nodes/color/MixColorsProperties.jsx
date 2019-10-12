import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class MixColorsProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasColorAInput: props.node.inputs[0].parent ? true : false,
      hasColorBInput: props.node.inputs[1].parent ? true : false
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
        <div className="propertiesTitle">Mix Colors</div>

        <div style={{padding:'10px'}}>
          {this.renderColorA()}
          {this.renderColorB()}
          <br/>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[2]} min={0} max={1} step={0.01} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
