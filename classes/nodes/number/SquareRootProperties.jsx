import Properties from '../Properties.js';

export default class SquareRootProperties extends Properties {

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
          sqrt({this.props.node.a}) = {Math.sqrt(this.props.node.a)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">SquareRoot of a Number</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
