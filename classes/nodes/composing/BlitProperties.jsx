import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class BlitProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Blit</div>
        <div style={{padding:'10px'}}>
          Copy an image or part of an image on top of another image.
          <br/><br/>
          <PropertiesInputNumber node={this.props.node} name="X" varName={'blitX'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Y" varName={'blitY'} input={this.props.node.inputs[3]} />
          <PropertiesInputNumber node={this.props.node} name="Source X" varName={'srcX'} input={this.props.node.inputs[4]} />
          <PropertiesInputNumber node={this.props.node} name="Source Y" varName={'srcY'} input={this.props.node.inputs[5]} />
          <PropertiesInputNumber node={this.props.node} name="Width" varName={'srcWidth'} input={this.props.node.inputs[6]} min={0} />
          <PropertiesInputNumber node={this.props.node} name="Height" varName={'srcHeight'} input={this.props.node.inputs[7]} min={0} />
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
