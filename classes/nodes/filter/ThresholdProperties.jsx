import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ThresholdProperties extends Properties {

  constructor(props) {
    super(props);
    this.autoGreyscaleChange = this.autoGreyscaleChange.bind(this);
  }

  autoGreyscaleChange(event) {
    this.props.node.autoGreyscale = event.target.checked;
    this.props.node.run(null);
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Threshold</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Max" varName={'max'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          <br/>
          <label>
            <input type="checkbox" defaultChecked={this.props.node.autoGreyscale} onChange={this.autoGreyscaleChange} />
            {' '}Auto Greyscale
          </label>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
