import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const globalStyles = `
  body, p {
    margin: 0;
  }
`

export default class MyDocument extends Document {
  render() {
    const sheet = new ServerStyleSheet()
    const main = sheet.collectStyles(<Main />)
    const styleTags = sheet.getStyleElement()

    return (
      <html>
        <Head>
          <link href='https://fonts.googleapis.com/css?family=Karla' rel='stylesheet' />
          <style>
            {globalStyles}
          </style>
          {styleTags}
        </Head>

        <body>
          <div className='root'>
            {main}
          </div>

          <NextScript />
        </body>
      </html>
    )
  }
}
