import React from 'react';

export default class BlurProperties extends React.Component {

  constructor(props) {
    super(props);

    this.brightnessChange = this.brightnessChange.bind(this);
    this.contrastChange = this.contrastChange.bind(this);
  }


  brightnessChange(event) {
    const elm = document.getElementById('brightnessSlider');
    this.props.node.brightness = Number(elm.value);
    this.props.node.run();
  }

  contrastChange(event) {
    const elm = document.getElementById('contrastSlider');
    this.props.node.contrast = Number(elm.value);
    this.props.node.run();
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Brightness/Contrast</div>
        <div style={{padding:'5px'}}>
          Brightness<br/>
          <input id="brightnessSlider" step="0.05" style={{width:'100%'}} type="range" min="-1" max="1" defaultValue={this.props.node.brightness} onChange={(event) => {this.brightnessChange(event);}} />
          <br/>
          Contrast<br/>
          <input id="contrastSlider" step="0.05" style={{width:'100%'}} type="range" min="-1" max="1" defaultValue={this.props.node.contrast} onChange={(event) => {this.contrastChange(event);}} />
        </div>
      </div>
    )
  }
}
