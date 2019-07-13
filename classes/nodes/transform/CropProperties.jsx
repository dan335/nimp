import Properties from '../Properties.js';

export default class CropProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasXInput: props.node.inputs[1].parent ? true : false,
      hasYInput: props.node.inputs[2].parent ? true : false,
      hasWidthInput: props.node.inputs[3].parent ? true : false,
      hasHeightInput: props.node.inputs[4].parent ? true : false,
    }

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.heightChange = this.heightChange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.cropX = Number(elm.value);
    this.props.node.run(null);
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.cropY = Number(elm.value);
    this.props.node.run(null);
  }

  widthChange(event) {
    const elm = document.getElementById('widthInput');
    this.props.node.width = Number(elm.value);
    this.props.node.run(null);
  }

  heightChange(event) {
    const elm = document.getElementById('heightInput');
    this.props.node.height = Number(elm.value);
    this.props.node.run(null);
  }



  renderX() {
    if (!this.state.hasXInput) {
      return (
        <div>
          X &nbsp;
          <input id="xInput" type="number" min="0" defaultValue={this.props.node.cropX} onChange={(event) => {this.xChange(event);}} />
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
          <input id="yInput" type="number" min="0" defaultValue={this.props.node.cropY} onChange={(event) => {this.yChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderWidth() {
    if (!this.state.hasWidthInput) {
      return (
        <div>
          Width &nbsp;
          <input id="widthInput" type="number" min="0" defaultValue={this.props.node.width} onChange={(event) => {this.widthChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  renderHeight() {
    if (!this.state.hasHeightInput) {
      return (
        <div>
          Height &nbsp;
          <input id="heightInput" type="number" min="0" defaultValue={this.props.node.height} onChange={(event) => {this.heightChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Crop</div>
        <div style={{padding:'10px'}}>
          {this.renderX()}
          {this.renderY()}
          <br/>
          {this.renderWidth()}
          {this.renderHeight()}
        </div>
      </div>
    )
  }
}
