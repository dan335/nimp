import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class WorleyProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Worley Noise</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[0]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Seed" varName={'seed'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Num Points" varName={'numPoints'} input={this.props.node.inputs[3]} min={1} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
