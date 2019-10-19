// props = node, name, varName, input, min, max, step, help

var debounce = require('lodash.debounce');


export default class PropertiesInputNumber extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasInput: props.input && props.input.parent ? true : false,
      value: this.props.node[this.props.varName]
    }

    this.debouncedChange = debounce(this.change, 150);
  }


  change(event) {
    const elm = document.getElementById('input'+this.props.varName);
    if (elm) {
      this.props.node[this.props.varName] = Number(elm.value);
      this.setState({value:Number(elm.value)});
      this.props.node.run(null);
    }
  }

  render() {
    if (!this.state.hasInput) {
      return (
        <div style={{backgroundColor:'hsl(209, 10%, 25%)', padding:'10px', marginBottom:'3px'}}>
          <div style={{marginBottom:'5px'}}>
            <div style={{fontSize:'110%'}}>
              {this.props.name} = {this.state.value}
            </div>
          </div>
          <input style={{width:'100%'}} id={'input'+this.props.varName} type="range" min={this.props.min == null ? null : this.props.min} max={this.props.max == null ? null : this.props.max} step={this.props.step == null ? null : this.props.step} defaultValue={this.props.node[this.props.varName]} onChange={(event) => {this.debouncedChange();}} />

          {(this.props.min != null || this.props.max != null || this.props.step != null) && (
            <div style={{fontSize:'90%', color:'hsl(209, 0%, 80%)', marginTop:'5px'}}>
              {this.props.min == null ? '' : 'min = '+this.props.min}
              {this.props.max == null ? '' : ' max = '+this.props.max}
              {this.props.step == null ? '' : ' step = '+this.props.step}
            </div>
          )}

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
