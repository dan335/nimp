import Properties from '../Properties.js';

export default class RandomNumberProperties extends Properties {

  constructor(props) {
    super(props);

    this.run = this.run.bind(this);
  }


  run(event) {
    this.props.node.run(null);
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Random Number</div>

        <div style={{padding:'10px'}}>
          Random number between 0 and 1.<br/>
          <br/>
          <button onClick={(event) => {this.run(event)}}>Regenerate</button>
          <br/><br/>
          When the regenerate input changes this node will generate a new random number.
          <br/>
          <br/>
          Regenerate input is optional.
          {this.renderName()}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
