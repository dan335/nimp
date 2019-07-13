import Properties from '../Properties.js';

export default class FloorProperties extends Properties {

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
          floor({this.props.node.a}) = {Math.floor(this.props.node.a)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Floor a Number</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}
