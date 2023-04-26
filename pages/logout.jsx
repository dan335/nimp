import fetch from 'isomorphic-unfetch';
import MainLayout from '../layouts/MainLayout.js';
import React from 'react';

export default class Logout extends React.Component {

  static async getInitialProps({req, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;
    return {user:user};
  }


  componentDidMount() {
    fetch('/api/logout', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'}
    }).then(result => {
      window.location.href = '/';
    })
  }


  render() {
    return (
      <div>
        <MainLayout>
          Logging out...
        </MainLayout>
      </div>
    )
  }
}
