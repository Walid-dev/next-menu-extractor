import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <link
            href="https://fonts.googleapis.com/css2?family=Dosis:wght@300&family=Lato&family=Noto+Sans+Linear+B&family=Noto+Sans+Pau+Cin+Hau&family=Titillium+Web:wght@300&display=swap"
            rel="stylesheet"></link>

          {/* You can add other global styles or scripts here */}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;