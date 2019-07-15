import GraphView from '../components/GraphView.jsx';


export default class Index extends React.Component {
  static async getInitialProps({req, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;
    return {user:user, graph:null};
  }

  render() {
    return (
      <GraphView user={this.props.user} load={this.props.graph} />
    )
  }
}
