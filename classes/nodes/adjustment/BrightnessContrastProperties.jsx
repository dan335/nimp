import Properties from '../Properties.js';

export default class BrightnessContrastProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasBrightnessInput: props.node.inputs[1].parent ? true : false,
      hasContrastInput: props.node.inputs[2].parent ? true : false,
    }

    this.brightnessChange = this.brightnessChange.bind(this);
    this.contrastChange = this.contrastChange.bind(this);
  }


  brightnessChange(event) {
    const elm = document.getElementById('brightnessSlider');
    this.props.node.brightness = Number(elm.value);
    this.props.node.run(null);
  }

  contrastChange(event) {
    const elm = document.getElementById('contrastSlider');
    this.props.node.contrast = Number(elm.value);
    this.props.node.run(null);
  }


  renderBrightness() {
    if (!this.state.hasBrightnessInput) {
      return (
        <div>
          Brightness<br/>
          <input id="brightnessSlider" step="0.05" style={{width:'100%'}} type="range" min="-1" max="1" defaultValue={this.props.node.brightness} onChange={(event) => {this.brightnessChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderContrast() {
    if (!this.state.hasContrastInput) {
      return (
        <div>
          Contrast<br/>
          <input id="contrastSlider" step="0.05" style={{width:'100%'}} type="range" min="-1" max="1" defaultValue={this.props.node.contrast} onChange={(event) => {this.contrastChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Brightness/Contrast</div>
        <div style={{padding:'10px'}}>
          {this.renderBrightness()}
          {this.renderContrast()}

          <br/><br/>
          Value from -1 to 1.

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
