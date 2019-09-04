import Properties from '../Properties.js';

export default class AddNumbersProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasX: props.node.inputs[0].parent ? true : false,
      hasY: props.node.inputs[1].parent ? true : false
    }
  }


  renderResult() {
    if (this.state.hasX && this.state.hasY) {
      return (
        <div>
          atan2({this.props.node.numY}, {this.props.node.numX}) = {Math.atan2(this.props.node.numY, this.props.node.numX)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Atan2</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
