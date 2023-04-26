import JsonView from '../../../components/JsonView.jsx';
import Head from 'next/head';
import MainLayout from '../../../layouts/MainLayout.js';
import React from 'react';


export default class JsonSlug extends React.Component {
  static async getInitialProps({req, res, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;

    let graph = null;
    if (query.graphId) {
      let body = {graphId: query.graphId, userId: null};
      if (user) {
        body.userId = user._id;
      }

      const result = await fetch(process.env.API_URL + '/api/graph', {
        method: 'post',
        headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (result.status == 200) {
        graph = await result.json();
      } else {
        if (result.status == 404) {
          res.statusCode = 404;
          res.end('Graph not found with this id.');
          return;
        } else if (result.status == 401) {
          res.statusCode = 401;
          res.end('Graph is private.');
          return;
        } else {
          res.statusCode = 500;
          res.end('Invalid graph id.');
          return;
        }
      }
    }

    return {user:user, graph:graph};
  }

  render() {
    return (
      <MainLayout>
        {this.props.graph && (
          <Head>
            <title key="title">{this.props.graph.title} - Nimp</title>
            <meta key="og:title" property="og:title" content={this.props.graph.title+' - Nimp'} />
          </Head>
        )}
        <JsonView user={this.props.user} graphToLoad={this.props.graph} />
      </MainLayout>
    )
  }
}
