import Properties from '../Properties.js';

export default class BlurProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasRadiusInput: props.node.inputs[1].parent ? true : false
    }

    this.blurRadiusChange = this.blurRadiusChange.bind(this);
  }


  blurRadiusChange(event) {
    const elm = document.getElementById('radiusSlider');
    this.props.node.radius = Number(elm.value);
    this.props.node.run(null);
  }


  renderRadius() {
    if (!this.state.hasRadiusInput) {
      return (
        <div>
          Radius<br/>
          <input id="radiusSlider" style={{width:'100%'}} type="range" min="1" max="100" defaultValue={this.props.node.radius} onChange={(event) => {this.blurRadiusChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Blur</div>
        <div style={{padding:'10px'}}>
          {this.renderRadius()}

          <br/><br/>
          Value is in pixels.

          {this.renderRun()}
        </div>
      </div>
    )
  }
}
