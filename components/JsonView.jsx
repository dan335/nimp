import TopBar from '../components/TopBar.jsx';
import Head from 'next/head';


export default class JsonView extends React.Component {
  render() {
    
    return (
      <div>
        <div id="mainContainer">
          <TopBar user={this.props.user} />
          <div id="cont">
            <a href={'/g/'+this.props.graphToLoad._id+'/'+this.props.graphToLoad.slug}><button>Back to Graph</button></a>
            <br/><br/>
            <pre>{JSON.stringify(this.props.graphToLoad.graph, null, 2) }</pre>
          </div>
        </div>

        <style jsx>{`
          #cont {
            padding: 20px;
          }
        `}</style>
      </div>
    )
  }
}
