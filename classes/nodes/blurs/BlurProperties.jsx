import React from 'react';

export default class BlurProperties extends React.Component {

  constructor(props) {
    super(props);

    this.blurRadiusChange = this.blurRadiusChange.bind(this);
  }


  blurRadiusChange(event) {
    const elm = document.getElementById('radiusSlider');
    this.props.node.radius = Number(elm.value);
    this.props.node.run();
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Blur</div>
        <div style={{padding:'5px'}}>
          Radius<br/>
          <input id="radiusSlider" style={{width:'100%'}} type="range" min="1" max="100" defaultValue={this.props.node.radius} onChange={(event) => {this.blurRadiusChange(event);}} />
        </div>
      </div>
    )
  }
}
