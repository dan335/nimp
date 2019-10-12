import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class BlitProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Pixelate</div>
        <div style={{padding:'10px'}}>
          Apply a pixelation effect to the image or a region.
          <br/><br/>
          <PropertiesInputNumber node={this.props.node} name="Size" varName={'size'} input={this.props.node.inputs[1]} />
          <PropertiesInputNumber node={this.props.node} name="X" varName={'valueX'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Y" varName={'valueY'} input={this.props.node.inputs[3]} />
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'width'} input={this.props.node.inputs[4]} min={0} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'height'} input={this.props.node.inputs[5]} min={0} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
