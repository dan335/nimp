import MainLayout from '../layouts/MainLayout.js';
import TopBar from '../components/TopBar.jsx';
import fetch from 'isomorphic-unfetch';
import React from 'react';

export default class CreateAccount extends React.Component {

  static async getInitialProps({req, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;
    return {user:user};
  }


  constructor(props) {
    super(props);

    this.state = {
      errorMsg: null
    }

    this.submitButton = this.submitButton.bind(this);
    this.logout = this.logout.bind(this);
  }


  submitButton(event) {
    const usernameElm = document.getElementById('usernameInput');
    const emailElm = document.getElementById('emailInput');
    const pass1Elm = document.getElementById('passwordInput1');
    const pass2Elm = document.getElementById('passwordInput2');

    fetch('/api/createaccount', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify({username:usernameElm.value, email:emailElm.value, password1:pass1Elm.value, password2:pass2Elm.value})
    }).then(result => {
      if (result.status == 200) {
        window.location.href = '/';
      } else {
        result.text().then(text => {
          this.setState({errorMsg:text});
        })
      }
    })
  }


  logout(event) {
    fetch('/api/logout', {
      method: 'get',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
    }).then(() => {
      window.location.reload(true);
    })
  }


  render() {
    return (
      <div>
        <MainLayout>
          <TopBar user={this.props.user} />
          <div id="cont">
            <h1>Create an Account</h1>

            {this.props.user && (
              <div>
                You are already logged in.<br/>
                <br/>
                <button onClick={this.logout}>Logout</button>
              </div>
            )}

            {this.state.errorMsg && (
              <div className="errorContainer">
                {this.state.errorMsg}
              </div>
            )}

            {!this.props.user && (
              <div>
                <label>Username</label>
                <input type="text" id="usernameInput" />

                <label>Email</label>
                <input type="text" id="emailInput" />

                <label>Password</label>
                <input type="password" id="passwordInput1" />

                <label>Password Again</label>
                <input type="password" id="passwordInput2" />

                <button onClick={this.submitButton}>Submit</button>

                <br/><br/>
                An account lets you save graphs.  Already have an account?  <a href="/login">Go here</a> to login.
              </div>
            )}


          </div>
        </MainLayout>

        <style jsx>{`
          #cont {
            padding: 30px;
            background-color: hsl(209, 10%, 25%);
            max-width: 400px;
            margin-left: auto;
            margin-right: auto;
            margin-top: 20px;
            border-radius: 3px;
          }

          h1 {
            text-align: center;
          }

          label {
            display: block;
            margin-bottom: 5px;
            margin-top: 20px;
          }

          input {
            width: 100%;
          }

          button {
            display: block;
            margin-top: 30px;
          }
        `}</style>
      </div>
    )
  }
}
