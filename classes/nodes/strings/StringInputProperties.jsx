import Properties from '../Properties.js';

export default class StringInputProperties extends Properties {

  constructor(props) {
    super(props);
  }


  stringChange(event) {
    const elm = document.getElementById('stringInput');
    this.props.node.string = elm.value;
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">String Input</div>

        <div style={{padding:'10px'}}>
          String Input<br/>
          <input id="stringInput" type="text" defaultValue={this.props.node.string} onChange={(event) => {this.stringChange(event);}} />
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
