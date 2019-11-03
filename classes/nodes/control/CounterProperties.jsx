import Properties from '../Properties.js';

export default class CounterProperties extends Properties {

  constructor(props) {
    super(props);

    this.resetCounter = this.resetCounter.bind(this);
  }


  resetCounter() {
    this.props.node.number = -1;
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Counter a Number</div>
        <div style={{padding:'10px'}}>
          Counts how many times this node has been run.  Is set to 0 when page is loaded.
          <br/><br/>
          <button className="fullWidth" onClick={this.resetCounter}>Reset Counter</button>
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
