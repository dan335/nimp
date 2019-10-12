import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class OutputLevelsProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Output Levels</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Min" varName={'min'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Max" varName={'max'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
