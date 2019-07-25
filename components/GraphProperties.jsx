import React from 'react';
import copy from 'copy-to-clipboard';
var ObjectId = require('bson-objectid');
import fetch from 'isomorphic-unfetch';


export default class GraphProperties extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isPublic: props.graph ? props.graph.isPublic : true,
      anyoneCanOverwrite: props.graph ? props.graph.anyoneCanOverwrite : false,
      errorMsg: null
    }

    props.indexComponent.graphProperties = this;

    this.changeTitle = this.changeTitle.bind(this);
    this.copyUrl = this.copyUrl.bind(this);
    this.publicChange = this.publicChange.bind(this);
    this.overwriteChange = this.overwriteChange.bind(this);
    this.clickDelete = this.clickDelete.bind(this);
  }


  changeTitle(event) {
    const elm = document.getElementById('graphTitleInput');
    this.props.graph.title = elm.value;
  }


  async saveGraph(event) {
    this.setState({errorMsg:null});

    if (!this.props.graph) return;
    let json = this.props.graph.toJson();
    let thumbnail = await this.props.graph.getThumbnail();

    fetch('/api/savegraph', {
      method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
        body: JSON.stringify({
          graph: json,
          isPublic: this.props.graph.isPublic,
          anyoneCanOverwrite: this.props.graph.anyoneCanOverwrite,
          thumbnail: thumbnail
        })
    }).then(result => {
      if (result.status == 200) {
        result.json().then(data => {
          const graphUrl = '/g/'+data._id+'/'+data.slug;

          this.props.graph.url = graphUrl;
          this.props.graph.slug = data.slug;
          this.props.graph.userId = data.userId;

          window.history.pushState('', '', graphUrl);

          // re-render GraphProperties.jsx
          this.props.graph.component.setState({propertiesKey:Math.random()});

          this.setSavedConfirmation();
        })
      } else {
        result.text().then(msg => {
          this.setState({errorMsg:msg});
        })
      }
    })
  }


  async saveGraphCopy(event) {
    this.setState({errorMsg:null});

    if (!this.props.graph) return;
    let json = this.props.graph.toJson();
    let thumbnail = await this.props.graph.getThumbnail();

    fetch('/api/copygraph', {
      method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
        body: JSON.stringify({
          graph: json,
          isPublic: this.props.graph.isPublic,
          anyoneCanOverwrite: this.props.graph.anyoneCanOverwrite,
          thumbnail: thumbnail
        })
    }).then(result => {
      if (result.status == 200) {
        result.json().then(data => {
          const graphUrl = '/g/'+data._id+'/'+data.slug;
          window.location.assign(graphUrl);
        })
      } else {
        result.text().then(msg => {
          this.setState({errorMsg:msg});
        })
      }
    })
  }


  setSavedConfirmation() {
    const elm = document.getElementById('saveResult');
    if (elm) {
      elm.innerHTML = 'Saved';

      setTimeout(() => {
        elm.innerHTML = '';
      }, 1500);
    }
  }


  copyUrl(event) {
    copy('https://nimp.app'+this.props.graph.url);

    const elm = document.getElementById('copyUrlButton');
    if (elm) {
      elm.innerHTML = 'copied';
    }
  }


  publicChange(event) {
    const elm = document.getElementById('publicCheckbox');
    this.props.graph.isPublic = elm.checked;
    this.setState({isPublic:elm.checked});
  }


  overwriteChange(event) {
    const elm = document.getElementById('canOverwriteCheckbox');
    this.props.graph.anyoneCanOverwrite = elm.checked;
    this.setState({anyoneCanOverwrite:elm.checked});
  }


  renderSaveOptions() {
    let canSave = false;
    let canCopy = false;
    let canEdit = false;
    let noPermissions = true;

    if (this.props.user && this.props.graph) {
      if (this.props.graph.userId == null) {
        // new graph
        canSave = true;
        canEdit = true;
        noPermissions = false;
      } else {
        // someone owns graph
        canCopy = true;
        noPermissions = false;
        if (this.props.graph.userId == this.props.user._id) {
          // owns graph
          canSave = true;
          canCopy = true;
          canEdit = true;
        } else if (this.props.anyoneCanOverwrite) {
          // does not own but can save
          canSave = true;
          canCopy = true;
        } else {
          // does not own and cannot save
          canCopy = true;
        }
      }
    }

    return (
      <div>
        {this.state.errorMsg && (
          <div>
            <div className="errorContainer">
              {this.state.errorMsg}
            </div>
            <br/>
          </div>
        )}

        {canEdit && (
          <div>
            <label>Name</label>
            <input id="graphTitleInput" onChange={event => {this.changeTitle(event)}} type="text" defaultValue={this.props.graph ? this.props.graph.title : ''} style={{width:'100%'}} /><br/>

            <input type="checkbox" id="publicCheckbox" onChange={event => {this.publicChange(event)}} defaultChecked={this.state.isPublic} /> Anyone can view.<br/>

            {this.state.isPublic && (
              <div>
                <input type="checkbox" id="canOverwriteCheckbox" onChange={event => {this.overwriteChange(event)}} defaultChecked={this.state.anyoneCanOverwrite} /> Anyone can save.
              </div>
            )}
          </div>
        )}

        {!canEdit && this.graph && (
          <div>
            {this.props.graph.title}
          </div>
        )}

        {canSave && (
          <button onClick={event => {this.saveGraph()}} className="fullWidth">Save Graph</button>
        )}

        {canCopy && (
          <button onClick={event => {this.saveGraphCopy()}} className="fullWidth">Make Copy</button>
        )}

        <div id="saveResult"></div>

        {noPermissions && this.props.graph && (
          <div>
            {this.props.graph.title}<br/>
            by {this.props.graph.username}<br/>
            <br/>
            Login to save a copy of this graph.
          </div>
        )}

        <style jsx>{`
          input {
            margin-bottom: 8px;
          }

          #saveResult {
            text-align: center;
            padding: 10px;
          }
        `}</style>
      </div>
    )
  }


  clickDelete() {
    fetch('/api/deletegraph', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify({graphId:this.props.graph.id})
    }).then(result => {
      if (result.status == 200) {
        window.location.href = '/';
      }
    })
  }


  render() {
    let isUser = false;

    if (this.props.graph && this.props.user && this.props.user._id == this.props.graph.userId) {
      isUser = true;
    }

    return (
      <div>
        <div className="propertiesTitle">Graph</div>
        <div style={{padding:'10px'}}>
          {this.renderSaveOptions()}
          <br/><br/>
          {this.state.graphUrl && (
            <div>
              <label>Graph URL &nbsp; <button id="copyUrlButton" onClick={this.copyUrl}>copy</button></label>
              <div id="urlCont">https://nimp.app{this.state.graphUrl}</div>
            </div>
          )}

          {isUser && (
            <button className="fullWidth" onClick={this.clickDelete}>Delete Graph</button>
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
