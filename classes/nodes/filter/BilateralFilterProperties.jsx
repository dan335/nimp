import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class BilateralFilterProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Bilateral Filter</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Radius" varName={'radius'} input={this.props.node.inputs[1]} min={1} max={10} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Sigma Space" varName={'sigmaSpace'} input={this.props.node.inputs[2]} min={0.1} max={20} step={0.1} />
          <PropertiesInputNumber node={this.props.node} name="Sigma Color" varName={'sigmaColor'} input={this.props.node.inputs[3]} min={0.1} max={100} step={1} />
          <br/>
          Edge-preserving smoothing. Higher sigma color = more smoothing across color boundaries.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
