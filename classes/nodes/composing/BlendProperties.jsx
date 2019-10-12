import Properties from '../Properties.js';
import PropertiesInputNumber from '../../../components/PropertiesInputNumber.jsx';


export default class BlendProperties extends Properties {

  constructor(props) {
    super(props);

    this.modeChange = this.modeChange.bind(this);
  }

  modeChange(event) {
    const elm = document.getElementById('blendInput');
    this.props.node.mode = elm.value;
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Blend</div>
        <div style={{padding:'10px'}}>
          <div>Position of image.</div>

          <PropertiesInputNumber node={this.props.node} name="X" varName={'blendX'} input={this.props.node.inputs[2]} />
          <PropertiesInputNumber node={this.props.node} name="Y" varName={'blendY'} input={this.props.node.inputs[3]} />

          <br/>

          Blend mode.<br/>
          <select id="blendInput" defaultValue={this.props.node.mode} onChange={(event) => {this.modeChange(event)}}>
            <option value={Jimp.BLEND_DESTINATION_OVER}>Background Over</option>
            <option value={Jimp.BLEND_SOURCE_OVER}>Foreground Over</option>
            <option value={Jimp.BLEND_MULTIPLY}>Multiply</option>
            <option value={Jimp.BLEND_SCREEN}>Screen</option>
            <option value={Jimp.BLEND_OVERLAY}>Overlay</option>
            <option value={Jimp.BLEND_DARKEN}>Darken</option>
            <option value={Jimp.BLEND_LIGHTEN}>Lighten</option>
            <option value={Jimp.BLEND_HARDLIGHT}>Hard Light</option>
            <option value={Jimp.BLEND_DIFFERENCE}>Difference</option>
            <option value={Jimp.BLEND_EXCLUSION}>Exclusion</option>
          </select>
          <br/>
          <br/>

          <PropertiesInputNumber node={this.props.node} name="Top Opacity" varName={'opacitySource'} input={this.props.node.inputs[4]} min={0} max={1} step={0.01} />
          <PropertiesInputNumber node={this.props.node} name="Bottom Opacity" varName={'opacityDest'} input={this.props.node.inputs[5]} min={0} max={1} step={0.01} />

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
