import Properties from '../Properties.js';

export default class ElseProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasAInput: props.node.inputs[2].parent ? true : false
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
        <div className="propertiesTitle">Image If Else</div>
        <div style={{padding:'10px'}}>
          {this.renderA()}

          <br/><br/>
          Outputs image A if test number is true.  Outputs image B if test number is false.  Number is considered false if it is 0 or -0.
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
