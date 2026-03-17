import Properties from '../Properties.js';


export default class MultiGradientMapProperties extends Properties {

  constructor(props) {
    super(props);
    this.addStop = this.addStop.bind(this);
    this.removeStop = this.removeStop.bind(this);
  }


  addStop() {
    this.props.node.stops.push({ position: 0.5, color: '#888888' });
    this.forceUpdate();
    this.props.node.run(null);
  }


  removeStop(index) {
    if (this.props.node.stops.length > 2) {
      this.props.node.stops.splice(index, 1);
      this.forceUpdate();
      this.props.node.run(null);
    }
  }


  stopPositionChange(index, event) {
    this.props.node.stops[index].position = Math.max(0, Math.min(1, parseFloat(event.target.value) || 0));
    this.props.node.run(null);
  }


  stopColorChange(index, event) {
    this.props.node.stops[index].color = event.target.value;
    this.props.node.run(null);
  }


  renderStops() {
    return this.props.node.stops.map((stop, i) => (
      <div key={i} style={{marginBottom:'5px'}}>
        <input type="number" value={stop.position} min={0} max={1} step={0.01}
          style={{width:'50px'}} onChange={(e) => this.stopPositionChange(i, e)} />
        &nbsp;
        <input type="text" defaultValue={stop.color} style={{width:'70px'}}
          onChange={(e) => this.stopColorChange(i, e)} />
        &nbsp;
        <button onClick={() => this.removeStop(i)} style={{width:'20px'}}>x</button>
      </div>
    ));
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Multi Gradient Map</div>
        <div style={{padding:'10px'}}>
          <div style={{marginBottom:'5px'}}>Color Stops (position 0-1, color):</div>
          {this.renderStops()}
          <button onClick={this.addStop} style={{width:'100%', marginTop:'5px'}}>Add Stop</button>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
