import Properties from '../Properties.js';

export default class IfProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasAInput: props.node.inputs[1].parent ? true : false
    }

    this.aChange = this.aChange.bind(this);
  }


  aChange(event) {
    const elm = document.getElementById('aInput');
    this.props.node.a = Number(elm.value);
    this.props.node.run(null);
  }


  renderA() {
    if (!this.state.hasAInput) {
      return (
        <div>
          Test Number<br/>
          <input id="aInput" type="number" defaultValue={this.props.node.a} onChange={(event) => {this.aChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">If</div>
        <div style={{padding:'10px'}}>
          {this.renderA()}

          <br/><br/>
          Outputs image if test number is true.  Does nothing if number is false.  Number is considered false if it is 0 or -0.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
