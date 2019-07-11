import Properties from '../Properties.js';

export default class NumberProperties extends Properties {

  constructor(props) {
    super(props);

    this.numChange = this.numChange.bind(this);
  }


  numChange(event) {
    const elm = document.getElementById('numberInput');
    this.props.node.number = Number(elm.value);
    this.props.node.run();
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Number Input</div>

        <div style={{padding:'10px'}}>
          Number<br/>
          <input id="numberInput" type="number" defaultValue={this.props.node.number} onChange={(event) => {this.numChange(event);}} />
        </div>
      </div>
    )
  }
}
