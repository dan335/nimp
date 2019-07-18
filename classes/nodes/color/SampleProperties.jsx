import Properties from '../Properties.js';

export default class SampleProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasXInput: props.node.inputs[1].parent ? true : false,
      hasYInput: props.node.inputs[2].parent ? true : false,
    }

    this.xChange = this.xChange.bind(this);
    this.yChange = this.yChange.bind(this);
  }


  xChange(event) {
    const elm = document.getElementById('xInput');
    this.props.node.xValue = Number(elm.value);
    this.props.node.run(null);
  }

  yChange(event) {
    const elm = document.getElementById('yInput');
    this.props.node.yValue = Number(elm.value);
    this.props.node.run(null);
  }



  renderX() {
    if (!this.state.hasXInput) {
      return (
        <div>
          X &nbsp;
          <input id="xInput" type="number" min="0" defaultValue={this.props.node.xValue} onChange={(event) => {this.xChange(event);}} />
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
          <input id="yInput" type="number" min="0" defaultValue={this.props.node.yValue} onChange={(event) => {this.yChange(event);}} />
          <br/>
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Sample</div>
        <div style={{padding:'10px'}}>
          Get color of image at pixel x,y.<br/>
          <br/>
          {this.renderX()}
          {this.renderY()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
