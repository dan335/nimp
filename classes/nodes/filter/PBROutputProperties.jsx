import Properties from '../Properties.js';


export default class PBROutputProperties extends Properties {
  constructor(props) {
    super(props);
    this.tabChange = this.tabChange.bind(this);
  }

  tabChange(tab) {
    this.props.node.activeTab = tab;
    this.props.node.run(null);
    this.forceUpdate();
  }

  render() {
    const tabs = ['albedo', 'normal', 'roughness', 'metallic', 'ao', 'height'];
    const active = this.props.node.activeTab;
    return (
      <div>
        <div className="propertiesTitle">PBR Output</div>
        <div style={{padding:'10px'}}>
          <div>Select which map to preview:</div>
          <div style={{display:'flex', flexWrap:'wrap', gap:'4px', marginTop:'5px'}}>
            {tabs.map(tab => (
              <button key={tab} onClick={() => this.tabChange(tab)}
                style={{
                  padding:'4px 8px',
                  backgroundColor: active === tab ? 'hsl(209, 50%, 40%)' : 'hsl(209, 10%, 30%)',
                  color: '#fff', border:'none', cursor:'pointer', fontSize:'12px'
                }}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          {this.renderRun()}
        </div>
      </div>
    )
  }
}
