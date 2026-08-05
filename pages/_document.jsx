import { Html, Head, Main, NextScript } from 'next/document';

// Custom document so the analytics snippet lands on every page. The tracker
// hooks history.pushState itself, so client-side route changes are counted.
export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <script defer src="https://analytics.danp.us/script.js" data-site="t62wmidq"></script>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
