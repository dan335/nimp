import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class PaddingProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Padding</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Top" varName={'top'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Right" varName={'right'} input={this.props.node.inputs[2]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Bottom" varName={'bottom'} input={this.props.node.inputs[3]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Left" varName={'left'} input={this.props.node.inputs[4]} min={0} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
