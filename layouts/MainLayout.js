import Head from 'next/head';
import '../node_modules/normalize.css/normalize.css';
import ReactGA from 'react-ga';


export default class MainLayout extends React.Component {

  componentDidMount() {
    ReactGA.initialize('UA-82312326-13');
    ReactGA.pageview(window.location.pathname + window.location.search);
  }

  render() {
    const {headerData, children} = this.props;

    return (
      <div>
        <Head>
          <title>Nimp</title>
          <meta name="description" content="Node-base image manipulation program. Procedurally create and edit images in this free open source node based image editor." />
          <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap" rel="stylesheet" />
          <meta charSet='UTF-8'/>
          <link rel="icon" type="image/png" href="/static/favicon.png" />
          <meta property="og:title" content="Nimp" />
          <meta property="og:description" content="Node-base image manipulation program. Procedurally create and edit images in this free open source node based image editor." />
        </Head>

        <div>
          {children}
        </div>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }
          *:focus {
            outline: none;
          }

          body {
            background-color: hsl(209, 10%, 13%);
            color: hsl(209, 50%, 95%);
            font-family: 'Roboto Condensed', sans-serif;
            user-select: none;
          }

          input, select {
            border: 0;
            padding: 5px;
            border-radius: 2px;
            margin-bottom: 1px;
          }

          a {
            color: hsl(100, 80%, 60%);
            text-decoration: none;
          }

          button {
            border: 0;
            padding: 5px 12px;
            margin: 0;
            border-radius: 2px;
            cursor: pointer;
            background-color: hsl(209, 10%, 50%);
            color: #fff;
            margin-right: 2px;
          }

          button:hover {
            background-color: hsl(209, 10%, 65%);
          }

          .errorContainer {
            background-color: hsl(0, 50%, 50%);
            color: #fff;
            padding: 20px;
            border-radius: 2px;
          }
        `}</style>
      </div>
    )
  }
}
