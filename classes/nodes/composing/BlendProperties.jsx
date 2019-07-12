import Properties from '../Properties.js';

export default class BlendProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasXInput: props.node.inputs[2].parent ? true : false,
      hasYInput: props.node.inputs[3].parent ? true : false,
      hasTopOpacityInput: props.node.inputs[4].parent ? true : false,
      hasBottomOpacityInput: props.node.inputs[5].parent ? true : false
    }

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
    this.modeChange = this.modeChange.bind(this);
    this.sourceOpacityChange = this.sourceOpacityChange.bind(this);
    this.destinationOpacitychange = this.destinationOpacitychange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.BlendX = Number(elm.value);
    this.props.node.run();
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.BlendY = Number(elm.value);
    this.props.node.run();
  }

  modeChange(event) {
    const elm = document.getElementById('blendInput');
    this.props.node.mode = elm.value;
    this.props.node.run();
  }

  sourceOpacityChange(event) {
    const elm = document.getElementById('sourceOpacityInput');
    this.props.node.opacitySource = Number(elm.value);
    this.props.node.run();
  }

  destinationOpacitychange(event) {
    const elm = document.getElementById('destinationOpacityInput');
    this.props.node.opacityDest = Number(elm.value);
    this.props.node.run();
  }


  renderX() {
    if (!this.state.hasXInput) {
      return (
        <div>
          X &nbsp;
          <input id="xInput" type="number" defaultValue={this.props.node.BlendX} onChange={(event) => {this.xChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderY() {
    if (!this.state.hasYInput) {
      return (
        <div>
          Y &nbsp;
          <input id="yInput" type="number" defaultValue={this.props.node.BlendY} onChange={(event) => {this.yChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderTopOpacity() {
    if (!this.state.hasTopOpacityInput) {
      return (
        <div>
          Top Image Opacity<br/>
          <input id="sourceOpacityInput"  defaultValue={this.props.node.opacitySource} step="0.05" style={{width:'100%'}} type="range" min="0" max="1" onChange={(event) => {this.sourceOpacityChange(event);}} />
          <br/><br/>
        </div>
      )
    }
  }


  renderBottomOpacity() {
    if (!this.state.hasBottomOpacityInput) {
      return (
        <div>
          Bottom Image Opacity<br/>
          <input id="destinationOpacityInput"  defaultValue={this.props.node.opacityDest} step="0.05" style={{width:'100%'}} type="range" min="0" max="1" onChange={(event) => {this.destinationOpacitychange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Blend</div>
        <div style={{padding:'10px'}}>
          <div>Position of image.</div>

          {this.renderX()}
          {this.renderY()}

          <br/>

          Blend mode.<br/>
          <select id="blendInput" defaultValue={this.props.node.mode} onChange={(event) => {this.modeChange(event)}}>
            <option value={Jimp.BLEND_SOURCE_OVER}>Background Over</option>
            <option value={Jimp.BLEND_DESTINATION_OVER}>Foreground Over</option>
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

          {this.renderTopOpacity()}
          {this.renderBottomOpacity()}

        </div>
      </div>
    )
  }
}
