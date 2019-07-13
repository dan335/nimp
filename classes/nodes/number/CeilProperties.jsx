import Properties from '../Properties.js';

export default class CeilProperties extends Properties {

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
          ceil({this.props.node.a}) = {Math.ceil(this.props.node.a)}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Ceil a Number</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
        </div>
      </div>
    )
  }
}
