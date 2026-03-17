import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class MirrorProperties extends Properties {

  constructor(props) {
    super(props);
    this.axisChange = this.axisChange.bind(this);
  }

  axisChange(event) {
    this.props.node.axis = event.target.value;
    this.props.node.run(null);
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Mirror</div>
        <div style={{padding:'10px'}}>
          Axis<br/>
          <select defaultValue={this.props.node.axis} onChange={this.axisChange}>
            <option value="horizontal">Horizontal</option>
            <option value="vertical">Vertical</option>
          </select>
          <br/><br/>
          <PropertiesInputNumber node={this.props.node} name="Axis Position" varName={'axisPosition'} input={this.props.node.inputs[1]} min={0} max={1} step={0.01} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
