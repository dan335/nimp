import React from 'react';

export default class Properties extends React.Component {
  constructor(props) {
    super(props);

    props.node.propertiesComponentInstance = this;
  }
}
