import Head from 'next/head';
import '../node_modules/normalize.css/normalize.css';

export default class MainLayout extends React.Component {

  render() {
    const {headerData, children} = this.props;

    return (
      <div>
        <Head>
          <title>asdf</title>
          <link href="https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap" rel="stylesheet" />
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
            background-color: hsl(209, 20%, 13%);
            color: hsl(209, 50%, 95%);
            font-family: 'Roboto Condensed', sans-serif;
            user-select: none;
          }
        `}</style>
      </div>
    )
  }
}
