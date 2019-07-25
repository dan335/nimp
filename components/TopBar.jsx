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
          <a href="https://www.patreon.com/dan335" className="topLink"><img src="/static/patreonIcon.png" /></a>
          <a href="https://github.com/dan335/nimp" className="topLink"><img src="/static/githubLogo.png" /></a>
          <a href="https://trello.com/b/s5yHz4z5/nimp" className="topLink"><img src="/static/trelloIcon.png" /></a>
          <a href="https://discord.gg/vgwW6WX" className="topLink"><img src="/static/discordIcon.png" /></a>
          <a href="https://twitter.com/dan335" className="topLink"><img src="/static/twitterIcon.png" /></a>
          <a href="mailto:dan@nimp.app" className="topLink"><img src="/static/emailIcon.png" /></a>

          <a href="/graphs" className="topButton"><button>Public Graphs</button></a>

          {this.props.user && (
            <span>
              <a href={'/u/'+this.props.user._id} className="topButton"><button>{this.props.user.username}</button></a>
              <a href="/logout"><button>Logout</button></a>
            </span>
          )}

          {!this.props.user && (
            <span>
              <a href="/login" className="topButton"><button>Login</button></a>
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

          .topLink {
            margin-right: 15px;
          }

          .topButton {
            margin-right: 2px;
          }
        `}</style>
      </div>
    )
  }
}
