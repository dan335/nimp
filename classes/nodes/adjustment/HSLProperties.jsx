import Properties from '../Properties.js';

export default class HSLProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasHueInput: props.node.inputs[1].parent ? true : false,
      hasSaturationInput: props.node.inputs[2].parent ? true : false,
      hasLightnessInput: props.node.inputs[3].parent ? true : false,
    }

    this.hueChange = this.hueChange.bind(this);
    this.saturationChange = this.saturationChange.bind(this);
    this.lightnessChange = this.lightnessChange.bind(this);
  }


  hueChange(event) {
    const elm = document.getElementById('hueSlider');
    this.props.node.hue = Number(elm.value);
    this.props.node.run(null);
  }

  saturationChange(event) {
    const elm = document.getElementById('saturationSlider');
    this.props.node.saturation = Number(elm.value);
    this.props.node.run(null);
  }

  lightnessChange(event) {
    const elm = document.getElementById('lightnessSlider');
    this.props.node.lightness = Number(elm.value);
    this.props.node.run(null);
  }


  renderHue() {
    if (!this.state.hasHueInput) {
      return (
        <div>
          Hue &nbsp;&nbsp; From -360 to 360<br/>
          <input id="hueSlider" style={{width:'100%'}} type="range" min="-360" max="360" step="1" defaultValue={this.props.node.hue} onChange={(event) => {this.hueChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  renderSaturation() {
    if (!this.state.hasSaturationInput) {
      return (
        <div>
          Saturation &nbsp;&nbsp; From -1 to 1<br/>
          <input id="saturationSlider" step="0.01" style={{width:'100%'}} type="range" min="-1" max="1" defaultValue={this.props.node.saturation} onChange={(event) => {this.saturationChange(event);}} />
        </div>
      )
    }
  }

  renderLightness() {
    if (!this.state.hasLightnessInput) {
      return (
        <div>
          Lightness &nbsp;&nbsp; From -1 to 1<br/>
          <input id="lightnessSlider" step="0.01" style={{width:'100%'}} type="range" min="-1" max="1" defaultValue={this.props.node.lightness} onChange={(event) => {this.lightnessChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Hue Saturation Lightness</div>
        <div style={{padding:'10px'}}>
          {this.renderHue()}
          {this.renderSaturation()}
          {this.renderLightness()}

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
