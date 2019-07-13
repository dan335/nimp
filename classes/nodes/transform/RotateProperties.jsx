import Properties from '../Properties.js';

export default class RotateProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasDegreesInput: props.node.inputs[1].parent ? true : false,
      resize: props.node.resize
    }

    this.degreesChange = this.degreesChange.bind(this);
    this.resizeChanged = this.resizeChanged.bind(this);
    this.modeChange = this.modeChange.bind(this);
  }


  degreesChange(event) {
    const elm = document.getElementById('degreesInput');
    this.props.node.degrees = Number(elm.value);
    this.props.node.run(null);
  }

  resizeChanged(event) {
    const elm = document.getElementById('resizeInput');
    if (elm.checked) {
      this.props.node.resize = true;
      this.setState({resize: true});
    } else {
      this.setState({resize: false});
      this.props.node.resize = false;
    }
    this.props.node.run(null);
  }

  modeChange(event) {
    const elm = document.getElementById('modeInput');
    this.props.node.mode = elm.value;
    this.props.node.run(null);
  }


  renderDegrees() {
    if (!this.state.hasDegreesInput) {
      return (
        <div>
          Degrees<br/>
          <input id="degreesInput" type="number" defaultValue={this.props.node.degrees} onChange={(event) => {this.degreesChange(event);}} />
        </div>
      )
    }
  }

  renderResize() {
    return (
      <div>
        Resize Image<br/>
        <input id="resizeInput" type="checkbox" defaultChecked={this.props.node.resize} onChange={(event) => {this.resizeChanged(event);}} />
      </div>
    )
  }

  renderMode() {
    if (this.state.resize) {
      return (
        <div>
          Mode to use when resizing.<br/>
          <select id="modeInput" defaultValue={this.props.node.mode} onChange={(event) => {this.modeChange(event)}}>
            <option value={Jimp.RESIZE_NEAREST_NEIGHBOR}>Nearest Neighbor</option>
            <option value={Jimp.RESIZE_BILINEAR}>Bilinear</option>
            <option value={Jimp.RESIZE_BICUBIC}>Bicubic</option>
            <option value={Jimp.RESIZE_HERMITE}>Hermite</option>
            <option value={Jimp.RESIZE_BEZIER}>Bezier</option>
          </select>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Rotate Image</div>
        <div style={{padding:'10px'}}>
          {this.renderDegrees()}
          <br/><br/>
          {this.renderResize()}
          <br/>
          {this.renderMode()}
        </div>
      </div>
    )
  }
}
