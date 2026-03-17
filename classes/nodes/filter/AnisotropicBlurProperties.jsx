import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class AnisotropicBlurProperties extends Properties {

  render() {
    return (
      <div>
        <div className="propertiesTitle">Anisotropic Blur</div>
        <div style={{padding:'10px'}}>
          <PropertiesInputNumber node={this.props.node} name="Iterations" varName={'iterations'} input={this.props.node.inputs[1]} min={1} max={30} step={1} />
          <PropertiesInputNumber node={this.props.node} name="Strength" varName={'strength'} input={this.props.node.inputs[2]} min={0.01} max={0.5} step={0.01} />
          <br/>
          Edge-preserving smoothing using anisotropic diffusion (Perona-Malik).
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
