import GraphView from '../../../components/GraphView.jsx';


export default class Slug extends React.Component {
  static async getInitialProps({req, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;
    return {user:user};
  }

  render() {
    return (
      <GraphView user={this.props.user} />
    )
  }
}
