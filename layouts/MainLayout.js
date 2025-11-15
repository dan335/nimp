import Head from "next/head";
import "../node_modules/normalize.css/normalize.css";
import Script from "next/script";
import React from "react";

export default class MainLayout extends React.Component {
  render() {
    const { headerData, children } = this.props;

    return (
      <div>
        <Head>
          <title key="title">Nimp</title>
          <meta
            name="description"
            content="Node-based image manipulation program. Procedurally create and edit images in this free open source node based image editor.  Photoshop alternative."
          />
          <link
            href="https://fonts.googleapis.com/css?family=Roboto+Condensed&display=swap"
            rel="stylesheet"
          />
          <meta property="og:image" content="/static/og.jpg" />
          <meta charSet="UTF-8" />
          <link rel="icon" type="image/png" href="/static/favicon.png" />
          <meta property="og:site_name" content="Nimp" />
          <meta key="og:title" property="og:title" content="Nimp" />
          <meta
            property="og:description"
            content="Node-based image manipulation program. Procedurally create and edit images in this free open source node based image editor.  Photoshop alternative."
          />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="application-name" content="Nimp" />
          <meta name="theme-color" content="#222222" />
          <meta name="google" content="notranslate" />
        </Head>

        <div>
          {children}
          <script
            async
            defer
            src="https://simple.ennogames.com/latest.js"
          ></script>
          <noscript>
            {/* eslint-disable @next/next/no-img-element */}
            <img
              src="https://simple.ennogames.com/noscript.gif"
              alt=""
              referrerPolicy="no-referrer-when-downgrade"
            />
          </noscript>
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
            font-family: "Roboto Condensed", sans-serif;
            user-select: none;
            font-size: 14px;
          }

          input,
          select,
          textarea {
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

          button.fullWidth {
            width: 100%;
            margin-bottom: 2px;
          }

          button:hover {
            background-color: hsl(209, 10%, 65%);
          }

          button.active {
            background-color: hsl(209, 60%, 50%);
          }

          button.active:hover {
            background-color: hsl(209, 60%, 65%);
          }

          .errorContainer {
            background-color: hsl(0, 50%, 50%);
            color: #fff;
            padding: 20px;
            border-radius: 2px;
          }
        `}</style>
      </div>
    );
  }
}
