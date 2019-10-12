import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class HSLInputProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">HSL Input</div>

        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Hue" varName={'hue'} input={this.props.node.inputs[0]} min={0} max={255} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Saturation" varName={'saturation'} input={this.props.node.inputs[1]} min={0} max={1} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Lightness" varName={'lightness'} input={this.props.node.inputs[2]} min={0} max={1} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Alpha" varName={'alpha'} input={this.props.node.inputs[3]} min={0} max={1} step={0.01} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
