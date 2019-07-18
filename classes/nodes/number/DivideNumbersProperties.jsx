import Properties from '../Properties.js';

export default class DivideNumbersProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasA: props.node.inputs[0].parent ? true : false,
      hasB: props.node.inputs[1].parent ? true : false
    }
  }


  renderResult() {
    if (this.state.hasA && this.state.hasB) {
      return (
        <div>
          {this.props.node.a} / {this.props.node.b} = {this.props.node.a / this.props.node.b}
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Divide Numbers</div>
        <div style={{padding:'10px'}}>
          {this.renderResult()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
