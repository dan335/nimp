import React from 'react';
import copy from 'copy-to-clipboard';


export default class GraphProperties extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      graphUrl: props.graph && props.graph.url ? props.graph.url : null
    }

    props.indexComponent.graphProperties = this;

    this.changeTitle = this.changeTitle.bind(this);
    this.copyUrl = this.copyUrl.bind(this);
  }


  changeTitle(event) {
    const elm = document.getElementById('graphTitleInput');
    this.props.graph.title = elm.value;
  }


  saveGraph(event) {
    if (!this.props.graph) return;

    let json = this.props.graph.toJson();

    fetch('/api/savegraph', {
      method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
        body: JSON.stringify({
          graph: json
        })
    }).then(result => {
      result.json().then(data => {
        const graphUrl = '/g/'+data._id+'/'+data.slug;

        this.props.graph.url = graphUrl;
        this.props.graph.slug = data.slug;

        window.history.pushState('', '', graphUrl);

        this.setState({graphUrl: graphUrl});

        const elm = document.getElementById('saveResult');
        if (elm) {
          elm.innerHTML = 'Saved';
        }
      })
    })
  }


  copyUrl(event) {
    copy(this.state.graphUrl);

    const elm = document.getElementById('copyUrlButton');
    if (elm) {
      elm.innerHTML = 'copied';
    }
  }


  render() {
    return (
      <div>
        <div className="propertiesTitle">Graph</div>
        <div style={{padding:'10px'}}>
          <label>Name</label>
          <input id="graphTitleInput" onChange={event => {this.changeTitle(event)}} type="text" defaultValue={this.props.graph ? this.props.graph.title : ''} style={{width:'100%'}} /><br/>
          <br/>
          <button onClick={event => {this.saveGraph()}}>Save Graph</button>
          &nbsp;&nbsp;
          <span id="saveResult"></span>
          <br/><br/><br/>
          {this.state.graphUrl && (
            <div>
              <label>Graph URL &nbsp; <button id="copyUrlButton" onClick={this.copyUrl}>copy</button></label>
              <div id="urlCont">https://nimp.app{this.state.graphUrl}</div>
            </div>
          )}
        </div>

        <style jsx>{`
          label {
            display: block;
            margin-bottom: 5px;
          }

          #urlCont {
            border: 1px solid hsl(209, 10%, 30%);
            background-color : hsl(209, 10%, 20%);
            border-radius: 3px;
            padding: 10px 5px;
            overflow-wrap: break-word;
          }
        `}</style>
      </div>
    )
  }
}
