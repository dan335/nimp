import Properties from '../Properties.js';


export default class ChannelShuffleProperties extends Properties {

  channelChange(channel, event) {
    this.props.node[channel] = parseInt(event.target.value);
    this.props.node.run(null);
  }

  renderChannelSelect(label, prop) {
    return (
      <div style={{marginBottom:'5px'}}>
        {label} &nbsp;
        <select defaultValue={this.props.node[prop]} onChange={(e) => this.channelChange(prop, e)}>
          <option value={0}>Red</option>
          <option value={1}>Green</option>
          <option value={2}>Blue</option>
          <option value={3}>Alpha</option>
        </select>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="propertiesTitle">Channel Shuffle</div>
        <div style={{padding:'10px'}}>
          {this.renderChannelSelect('Red ←', 'redSource')}
          {this.renderChannelSelect('Green ←', 'greenSource')}
          {this.renderChannelSelect('Blue ←', 'blueSource')}
          {this.renderChannelSelect('Alpha ←', 'alphaSource')}
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
