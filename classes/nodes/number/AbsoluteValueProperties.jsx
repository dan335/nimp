import Properties from '../Properties.js';

export default class AbsoluteValueProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasA: props.node.inputs[0].parent ? true : false,
    }
  }


  renderResult() {
    if (this.state.hasA) {
      return (
        <div>
          |{this.props.node.a}|= {Math.abs(this.props.node.a)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Add Numbers</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}
