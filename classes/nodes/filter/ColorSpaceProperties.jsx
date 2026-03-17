import Properties from '../Properties.js';


export default class ColorSpaceProperties extends Properties {
  constructor(props) {
    super(props);
    this.fromChange = this.fromChange.bind(this);
    this.toChange = this.toChange.bind(this);
  }

  fromChange(event) {
    this.props.node.fromSpace = event.target.value;
    this.props.node.run(null);
  }

  toChange(event) {
    this.props.node.toSpace = event.target.value;
    this.props.node.run(null);
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Color Space</div>
        <div style={{padding:'10px'}}>
          From<br/>
          <select defaultValue={this.props.node.fromSpace} onChange={this.fromChange}>
            <option value="rgb">RGB</option>
            <option value="hsv">HSV</option>
            <option value="hsl">HSL</option>
          </select>
          <br/><br/>
          To<br/>
          <select defaultValue={this.props.node.toSpace} onChange={this.toChange}>
            <option value="rgb">RGB</option>
            <option value="hsv">HSV</option>
            <option value="hsl">HSL</option>
          </select>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
