import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class VignetteProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Vignette</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Amount" varName={'amount'} input={this.props.node.inputs[1]} min={-100} max={100} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[2]} min={0.1} max={2} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
