import MainLayout from '../layouts/MainLayout.js';
import TopBar from '../components/TopBar.jsx';

export default class Login extends React.Component {

  static async getInitialProps({req, query}) {
    const user = req && req.session && req.session.user ? req.session.user : null;
    return {user:user};
  }

  
  render() {
    return (
      <div>
        <MainLayout>
          <TopBar user={this.props.user} />
          <div id="cont">
            <h1>Login</h1>
            <label>Email</label>
            <input type="text" id="emailInput" />

            <label>Password</label>
            <input type="password" id="passwordInput" />

            <button>Login</button>

            <br/><br/>
            Don't have an account?  <a href="/createaccount">Go here</a> to create one.
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
