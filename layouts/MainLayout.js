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
          <meta name="description" content="Node-base image manipulation program." />
          <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap" rel="stylesheet" />
          <meta charSet='UTF-8'/>
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
            background-color: hsl(200, 20%, 13%);
            color: hsl(200, 50%, 95%);
            font-family: 'Roboto Condensed', sans-serif;
            user-select: none;
          }

          input, select {
            border: 1px solid #000;
            padding: 5px;
            border-radius: 2px;
          }
        `}</style>
      </div>
    )
  }
}
