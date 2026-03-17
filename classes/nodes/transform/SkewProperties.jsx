import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class SkewProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Skew</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Shear X" varName={'shearX'} input={this.props.node.inputs[1]} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Shear Y" varName={'shearY'} input={this.props.node.inputs[2]} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
