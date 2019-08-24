import Properties from '../Properties.js';

export default class SinProperties extends Properties {

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
          sin({this.props.node.a}) = {Math.sin(this.props.node.a)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Sine of a Number</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
