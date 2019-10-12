import Properties from '../Properties.js';
import PropertiesInputSlider from '../../../components/PropertiesInputSlider.jsx';

export default class BrightnessContrastProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Brightness/Contrast</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputSlider node={this.props.node} name="Brightness" varName={'brightness'} input={this.props.node.inputs[1]} min={-1} max={1} step={0.01} />
          <PropertiesInputSlider node={this.props.node} name="Contrast" varName={'contrast'} input={this.props.node.inputs[2]} min={-1} max={1} step={0.01} />

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
