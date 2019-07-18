import Properties from '../Properties.js';

export default class FadeProperties extends Properties {

  constructor(props) {
    super(props);

    this.state = {
      hasAmountInput: props.node.inputs[1].parent ? true : false
    }
  }


  amountChange(event) {
    const elm = document.getElementById('amountInput');
    this.props.node.amount = Number(elm.value);
    this.props.node.run(null);
  }


  renderAmount() {
    if (!this.state.hasAmountInput) {
      return (
        <div>
          Amount &nbsp;&nbsp; 0 - 1<br/>
          <input id="amountInput" style={{width:'100%'}} type="range" min="0" max="1" step="0.01" defaultValue={this.props.node.amount} onChange={(event) => {this.amountChange(event);}} />
        </div>
      )
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Fade</div>
        <div style={{padding:'10px'}}>
          {this.renderAmount()}
        </div>
      </div>
    )
  }
}
