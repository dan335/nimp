import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';

export default class SampleProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Sample</div>
        <div style={{padding:'10px'}}>
          Get color of image at pixel x,y.<br/>
          <br/>
          <PropertiesInputNumber node={this.props.node} name="X" varName={'xValue'} input={this.props.node.inputs[1]} min={0} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Y" varName={'yValue'} input={this.props.node.inputs[2]} min={0} step={1} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
