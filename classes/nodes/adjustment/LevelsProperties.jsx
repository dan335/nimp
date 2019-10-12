import Properties from '../Properties.js';
import PropertiesInputSlider from '../../../components/PropertiesInputSlider.jsx';

export default class LevelsProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Input Levels</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputSlider node={this.props.node} name="Min" varName={'min'} input={this.props.node.inputs[1]} min={0} max={255} step={1} />
          <PropertiesInputSlider node={this.props.node} name="Max" varName={'max'} input={this.props.node.inputs[2]} min={0} max={255} step={1} />

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
