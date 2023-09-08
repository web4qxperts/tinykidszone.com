import { Html, Head, Main, NextScript } from 'next/document'
 
export default function Document() {
  return (
    <Html lang="en">

    <Head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="initial-scale=1, maximum-scale=1" />
    <link rel="manifest" href="/manifest.json" />
    <link href="/css/swiper.min.css" rel="stylesheet" />
    <link href="/css/main.css" rel="stylesheet" />
    <script src="/js/jquery.min.js"></script>
    <script src="/js/jquery-ui.min.js"></script>    
    <script src="/js/jquery-ui.min-punch.js"></script>
    <script src="/js/swiper.min.js"></script>
    <script src="/js/main.js"></script>
    </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}