import MainLayout from '../layouts/MainLayout.js';
import TopBar from '../components/TopBar.jsx';
import fetch from 'isomorphic-unfetch'
import GraphThumbs from '../components/GraphThumbs.jsx';
import React from 'react';


export default class Graphs extends React.Component {

  static async getInitialProps({req, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;

    let graphs = [];

    const result = await fetch(process.env.API_URL + '/api/graphs', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' }
    });

    if (result.status == 200) {
      graphs = await result.json();
    }

    return {user:user, graphs:graphs};
  }


  constructor(props) {
    super(props);
  }


  render() {
    return (
      <div>
        <MainLayout>
          <TopBar user={this.props.user} />
          <div id="cont">
            <GraphThumbs graphs={this.props.graphs} />
          </div>
        </MainLayout>

        <style jsx>{`
          #cont {
            padding: 20px;
          }
        `}</style>
      </div>
    )
  }
}
