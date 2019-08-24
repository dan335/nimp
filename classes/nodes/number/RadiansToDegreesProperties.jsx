import Properties from '../Properties.js';

export default class DegreesToRadiansProperties extends Properties {

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
          sin({this.props.node.a}) = {this.props.node.a * (180 / Math.PI)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Radians to Degrees</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
