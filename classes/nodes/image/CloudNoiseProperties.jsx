import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class CloudNoiseProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Cloud Noise</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Seed" varName={'seed'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Scale" varName={'scale'} input={this.props.node.inputs[3]} min={0.00001} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Warp Strength" varName={'warpStrength'} input={this.props.node.inputs[4]} min={0} step={0.1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
