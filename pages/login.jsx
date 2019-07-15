import MainLayout from '../layouts/MainLayout.js';
import TopBar from '../components/TopBar.jsx';

export default class Login extends React.Component {

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
  }


  submitButton() {
    const emailElm = document.getElementById('emailInput');
    const passElm = document.getElementById('passwordInput');

    fetch('/api/login', {
      method: 'post',
      headers: { 'Accept': 'application/json, text/plain, */*', 'Content-Type': 'application/json'},
      body: JSON.stringify({email:emailElm.value, password:passElm.value})
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


  render() {
    return (
      <div>
        <MainLayout>
          <TopBar user={this.props.user} />
          <div id="cont">
            <h1>Login</h1>

            {this.props.user && (
              <div>
                Looks like you're already logged in.  <a href="/logoug">Click here</a> to logout.
              </div>
            )}

            {this.state.errorMsg && (
              <div className="errorContainer">
                {this.state.errorMsg}
              </div>
            )}

            {!this.props.user && (
              <div>
                <label>Email</label>
                <input type="text" id="emailInput" />

                <label>Password</label>
                <input type="password" id="passwordInput" />

                <button onClick={this.submitButton}>Login</button>

                <br/><br/>
                Don't have an account?  <a href="/createaccount">Go here</a> to create one.
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
