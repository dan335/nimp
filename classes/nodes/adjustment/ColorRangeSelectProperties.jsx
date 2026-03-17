import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class ColorRangeSelectProperties extends Properties {

  targetColorChange() {
    const elm = document.getElementById('colorRangeTargetInput');
    this.props.node.targetColor = elm.value;
    this.props.node.run(null);
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Color Range Select</div>
        <div style={{padding:'10px'}}>
          Target Color &nbsp;
          <input id="colorRangeTargetInput" type="text" defaultValue={this.props.node.targetColor} onChange={(event) => {this.targetColorChange(event);}} />
          <br/><br/>
          <PropertiesInputNumber node={this.props.node} name="Tolerance" varName={'tolerance'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Softness" varName={'softness'} min={0} max={100} step={1} />
          <br/>
          Outputs a greyscale mask where white = matching pixels.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
