import Properties from '../Properties.js';


export default class CurvesProperties extends Properties {

  constructor(props) {
    super(props);
    this.addPoint = this.addPoint.bind(this);
    this.removePoint = this.removePoint.bind(this);
  }


  addPoint() {
    this.props.node.controlPoints.push({ x: 0.5, y: 0.5 });
    this.forceUpdate();
    this.props.node.run(null);
  }


  removePoint(index) {
    if (this.props.node.controlPoints.length > 2) {
      this.props.node.controlPoints.splice(index, 1);
      this.forceUpdate();
      this.props.node.run(null);
    }
  }


  pointXChange(index, event) {
    this.props.node.controlPoints[index].x = Math.max(0, Math.min(1, parseFloat(event.target.value) || 0));
    this.props.node.run(null);
  }


  pointYChange(index, event) {
    this.props.node.controlPoints[index].y = Math.max(0, Math.min(1, parseFloat(event.target.value) || 0));
    this.props.node.run(null);
  }


  renderPoints() {
    return this.props.node.controlPoints.map((pt, i) => (
      <div key={i} style={{marginBottom:'3px'}}>
        In: <input type="number" value={pt.x} min={0} max={1} step={0.01}
          style={{width:'55px'}} onChange={(e) => this.pointXChange(i, e)} />
        &nbsp;Out: <input type="number" value={pt.y} min={0} max={1} step={0.01}
          style={{width:'55px'}} onChange={(e) => this.pointYChange(i, e)} />
        &nbsp;
        <button onClick={() => this.removePoint(i)} style={{width:'20px'}}>x</button>
      </div>
    ));
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Curves</div>
        <div style={{padding:'10px'}}>
          <div style={{marginBottom:'5px'}}>Control Points (input 0-1 → output 0-1):</div>
          {this.renderPoints()}
          <button onClick={this.addPoint} style={{width:'100%', marginTop:'5px'}}>Add Point</button>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
