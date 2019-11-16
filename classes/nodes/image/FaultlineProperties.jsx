import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class FaultlineProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Faultline Noise</div>
        <div style={{padding:'10px'}}>
          Generate noise using fault line formation algorithm.<br/><br/>

          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={1} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Iterations" varName={'iterations'} input={this.props.node.inputs[2]} min={1} step={1} />

          {this.renderRun()}

          <br/><br/>
          For each iteration pick two random points to create a line.  Raise or lower pixel depending on which side of the line it is on.
        </div>
      </div>
    )
  }
}
