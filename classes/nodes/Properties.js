import React from 'react';

export default class Properties extends React.Component {
  constructor(props) {
    super(props);

    props.node.propertiesComponentInstance = this;
  }


  colorChange() {
    const elm = document.getElementById('colorInput');
    this.props.node.hexColor = elm.value;
    this.props.node.run(null);
  }


  renderColor() {
    if (!this.state.hasColorInput) {
      return (
        <div>
          Color<br/>
          <input id="colorInput" type="text" defaultValue={this.props.node.hexColor} onChange={(event) => {this.colorChange(event);}} />
        </div>
      )
    }
  }
}
