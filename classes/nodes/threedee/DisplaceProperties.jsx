import Properties from '../Properties.js';

export default class DisplaceProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasOffsetInput: props.node.inputs[2].parent ? true : false,
    }

    this.offsetChange = this.offsetChange.bind(this);
  }


  offsetChange(event) {
    const elm = document.getElementById('offsetInput');
    this.props.node.offset = Number(elm.value);
    this.props.node.run();
  }


  renderOffset() {
    if (!this.state.hasOffsetInput) {
      return (
        <div>
          Offset &nbsp;
          <input id="offsetInput" type="number" defaultValue={this.props.node.offset} onChange={(event) => {this.offsetChange(event);}} />
        </div>
      )
    }
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Displace</div>
        <div style={{padding:'10px'}}>
          Displace the image pixels based on the provided displacement map.<br/>
          <br/>
          {this.renderOffset()}
        </div>
      </div>
    )
  }
}
