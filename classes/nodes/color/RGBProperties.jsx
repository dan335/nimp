import Properties from '../Properties.js';
import PropertiesInputSlider from '../../../components/PropertiesInputSlider.jsx';

export default class RGBProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">RGB Input</div>

        <div style={{padding:'10px'}}>
          <PropertiesInputSlider node={this.props.node} name="Red" varName={'red'} input={this.props.node.inputs[0]} min={0} max={255} step={1} />
          <PropertiesInputSlider node={this.props.node} name="Green" varName={'green'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          <PropertiesInputSlider node={this.props.node} name="Blue" varName={'blue'} input={this.props.node.inputs[2]} min={0} max={255} step={1} />
          <PropertiesInputSlider node={this.props.node} name="Alpha" varName={'alpha'} input={this.props.node.inputs[3]} min={0} max={255} step={1} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
