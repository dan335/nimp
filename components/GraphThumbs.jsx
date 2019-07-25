import React from 'react';
import settings from '../lib/settings.js';


export default class GraphThumbs extends React.Component {
  render() {
    return (
      <div>
        <div id="graphThumbContainer">
          {this.props.graphs.map(graph => {
            return (
              <div key={graph._id} className="graphThumb">
                <a href={graph.url}>
                  <img className="graphThumbImage" src={graph.thumbnail} width={settings.thumbnailWidth} height={settings.thumbnailHeight} />
                  <div className="graphThumbTitle" style={{maxWidth:settings.thumbnailWidth}}>{graph.title}</div>
                </a>
                <div className="graphThumbInfo">
                  <div><a href={'/u/'+graph.userId}>{graph.username}</a></div>
                  <div style={{textAlign:'right'}}>{graph.views}</div>
                </div>
              </div>
            )
          })}
        </div>
        <style jsx>{`
          #graphThumbContainer {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: flex-start;
            align-content: flex-start;
          }

          .graphThumb {
            background-color: hsl(209, 10%, 20%);
            border: 0;
          }

          .graphThumb a {
            color: #fff;
          }

          .graphThumbImage {
            display: block;
            border: 0;
          }

          .graphThumbTitle {
            padding: 5px;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          }

          .graphThumbInfo {
            padding: 5px;
            color: #fff;
            display: grid;
            grid-template-columns: auto auto;
          }
        `}</style>
      </div>
    )
  }
}
