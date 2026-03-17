import React from 'react';
import Properties from '../Properties.js';


export default class ConvolutionCustomProperties extends Properties {
  constructor(props) {
    super(props);
    this.kernelChange = this.kernelChange.bind(this);
    this.sizeChange = this.sizeChange.bind(this);
  }

  sizeChange(event) {
    const newSize = parseInt(event.target.value);
    this.props.node.kernelSize = newSize;
    // Create new identity kernel
    const kernel = new Array(newSize * newSize).fill(0);
    kernel[Math.floor(newSize * newSize / 2)] = 1;
    this.props.node.kernel = kernel;
    this.forceUpdate();
    this.props.node.run(null);
  }

  kernelChange(index, value) {
    this.props.node.kernel[index] = parseFloat(value) || 0;
    this.props.node.run(null);
  }

  render() {
    const size = this.props.node.kernelSize;
    const kernel = this.props.node.kernel;
    return (
      <div>
        <div className="propertiesTitle">Custom Convolution</div>
        <div style={{padding:'10px'}}>
          Kernel Size<br/>
          <select defaultValue={size} onChange={this.sizeChange}>
            <option value={3}>3x3</option>
            <option value={5}>5x5</option>
          </select>
          <br/><br/>
          <div style={{display:'grid', gridTemplateColumns:`repeat(${size}, 1fr)`, gap:'2px'}}>
            {kernel.map((val, i) => (
              <input key={i} type="number" step="0.1" defaultValue={val}
                style={{width:'100%', padding:'2px', textAlign:'center'}}
                onChange={(e) => this.kernelChange(i, e.target.value)} />
            ))}
          </div>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
