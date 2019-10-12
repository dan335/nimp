// props = node, name, varName, input, min, max, step, help

var debounce = require('lodash.debounce');


export default class PropertiesInputNumber extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasInput: props.input.parent ? true : false
    }

    this.debouncedChange = debounce(this.change, 300);
  }


  change(event) {
    const elm = document.getElementById('input');
    if (elm) {
      this.props.node[this.props.varName] = Number(elm.value);
      this.props.node.run(null);
    }
  }

  render() {
    if (!this.state.hasInput) {
      return (
        <div style={{backgroundColor:'hsl(209, 10%, 25%)', padding:'10px', marginBottom:'3px'}}>
          <div style={{display:'grid', gridTemplateColumns:'auto auto', marginBottom:'5px'}}>
            <div style={{fontSize:'120%'}}>
              {this.props.name}
            </div>
            <div style={{textAlign:'right', fontSize:'90%'}}>
              {this.props.min == null ? '' : 'min='+this.props.min}
              {this.props.max == null ? '' : ' max='+this.props.max}
              {this.props.step == null ? '' : ' step='+this.props.step}
            </div>
          </div>
          <input style={{width:'100%'}} id="input" type="number" min={this.props.min == null ? null : this.props.min} max={this.props.max == null ? null : this.props.max} step={this.props.step == null ? null : this.props.step} defaultValue={this.props.node[this.props.varName]} onChange={(event) => {this.debouncedChange();}} />
          {this.props.help && (
            <div style={{fontSize:'90%', marginTop:'5px', color:'hsl(209, 0%, 80%)'}}>
              {this.props.help}
            </div>
          )}
        </div>
      )
    } else {
      return null;
    }
  }
}
