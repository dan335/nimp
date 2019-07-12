import Properties from '../Properties.js';

export default class DelayProperties extends Properties {

  constructor(props) {
    super(props);

    this.delayNumChange = this.delayNumChange.bind(this);
  }


  delayNumChange(event) {
    const elm = document.getElementById('delayNumInput');
    this.props.node.delayNum = Math.max(1, Number(elm.value));
    // do not run
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Delay</div>
        <div style={{padding:'10px'}}>
          Branches<br/>
          <input id="delayNumInput" type="number" min="1" defaultValue={this.props.node.delayNum} onChange={(event) => {this.delayNumChange(event);}} />

          <br/><br/>
          This node will delay updating the next node until it runs a certain number times.
          <br/><br/>
          If the number is 1 then this node will update the next node every time.  If it is 2 then it will not update the next node the first time it runs.  The next time it runs it will update the next node and the count starts over.
          <br/><br/>
          This node is useful if you're using a loop that has branched.  You only want the loop to end once but you have two branches that are running.  Set this node to the number of branches you have and insert it just before the loop end.
          <br/><br/>
          The reset input is optional.  If the reset input triggers it resets this node.  If you're using this in a loop trigger the reset input with the loop num.
        </div>
      </div>
    )
  }
}
