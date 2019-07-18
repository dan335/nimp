export default class TopBar extends React.Component {

  render() {
    return (
      <div id="topContainer">
        <div>
          <a href="/">
            Nimp <span style={{color:'hsl(0, 0%, 60%)'}}> &nbsp; (Node Based Image Manipulation Program)</span>
          </a>
        </div>
        <div style={{textAlign:'right'}}>
          <a href="https://www.patreon.com/dan335"><img src="/static/patreonIcon.png" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://github.com/dan335/nimp"><img src="/static/githubLogo.png" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://trello.com/b/s5yHz4z5/nimp"><img src="/static/trelloIcon.png" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://discord.gg/vgwW6WX"><img src="/static/discordIcon.png" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="https://twitter.com/dan335"><img src="/static/twitterIcon.png" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <a href="mailto:dan@nimp.app"><img src="/static/emailIcon.png" /></a>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

          {this.props.user && (
            <span>
              {this.props.user.username}
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="/logout"><button>Logout</button></a>
            </span>
          )}

          {!this.props.user && (
            <span>
              <a href="/login"><button>Login</button></a>
              &nbsp;
              <a href="/createaccount"><button>Create Account</button></a>
            </span>
          )}
        </div>

        <style jsx>{`
          #topContainer {
            line-height: 36px;
            padding: 0 10px;
            background-color: hsl(209, 10%, 25%);
            display: grid;
            grid-template-columns: 1fr 1fr;
          }

          #topContainer a {
            color: #fff;
          }

          #topContainer img {
            vertical-align: text-bottom;
          }
        `}</style>
      </div>
    )
  }
}
