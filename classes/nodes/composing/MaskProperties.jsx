import Properties from '../Properties.js';

export default class MaskProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasXInput: props.node.inputs[2].parent ? true : false,
      hasYInput: props.node.inputs[3].parent ? true : false,
    }

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.maskX = Number(elm.value);
    this.props.node.run();
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.maskY = Number(elm.value);
    this.props.node.run();
  }


  renderX() {
    if (!this.state.hasXInput) {
      return (
        <div>
          X &nbsp;
          <input id="xInput" type="number" defaultValue={this.props.node.maskX} onChange={(event) => {this.xChange(event);}} />
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
          <input id="yInput" type="number" defaultValue={this.props.node.maskY} onChange={(event) => {this.yChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Mask</div>
        <div style={{padding:'10px'}}>
          Position of image.<br/>
          {this.renderX()}
          {this.renderY()}          
        </div>
      </div>
    )
  }
}
