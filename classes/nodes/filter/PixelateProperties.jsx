import Properties from '../Properties.js';

export default class BlitProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasSizeInput: props.node.inputs[1].parent ? true : false,
      hasXInput: props.node.inputs[2].parent ? true : false,
      hasYInput: props.node.inputs[3].parent ? true : false,
      hasWidthInput: props.node.inputs[4].parent ? true : false,
      hasHeightInput: props.node.inputs[5].parent ? true : false,
    }
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.valueX = Number(elm.value);
    this.props.node.run(null);
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.valueY = Number(elm.value);
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

  sizeChange(event) {
    const elm = document.getElementById('sizeInput');
    this.props.node.size = Number(elm.value);
    this.props.node.run(null);
  }


  renderX() {
    if (!this.state.hasXInput) {
      return (
        <div>
          X &nbsp;
          <input id="xInput" type="number" defaultValue={this.props.node.valueX} onChange={(event) => {this.xChange(event);}} />
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
          <input id="yInput" type="number" defaultValue={this.props.node.valueY} onChange={(event) => {this.yChange(event);}} />
        </div>
      )
    }
  }

  renderWidth() {
    if (!this.state.hasWidthInput) {
      return (
        <div>
          Width &nbsp;
          <input id="widthInput" type="number" defaultValue={this.props.node.width} onChange={(event) => {this.widthChange(event);}} />
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
          <input id="heightInput" type="number" defaultValue={this.props.node.height} onChange={(event) => {this.heightChange(event);}} />
        </div>
      )
    }
  }

  renderSize() {
    if (!this.state.hasSrcWidthInput) {
      return (
        <div>
          Size &nbsp;
          <input id="sizeInput" type="number" defaultValue={this.props.node.size} onChange={(event) => {this.sizeChange(event);}} />
          <br/>
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Pixelate</div>
        <div style={{padding:'10px'}}>
          Apply a pixelation effect to the image or a region.
          <br/><br/>
          {this.renderSize()}
          <br/>
          {this.renderX()}
          {this.renderY()}
          <br/>
          {this.renderWidth()}
          {this.renderHeight()}
          <br/>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
