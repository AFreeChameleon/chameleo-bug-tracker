import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import createEmotionServer from '@emotion/server/create-instance';
import createEmotionCache from '../styles/createEmotionCache';
import theme from '../styles/theme';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
            {/* PWA primary color */}
            <meta name="theme-color" content={theme.palette.primary.main} />
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
            <link href="https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&family=Source+Code+Pro&display=swap" rel="stylesheet"/>
            <link
                rel="stylesheet"
                href="/css/root.css"
            />
            {this.props.emotionStyleTags}
        </Head>
        <body style={{margin: 0, padding: 0}}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with server-side generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage;

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache();
  const { extractCriticalToChunks } = createEmotionServer(cache);

  ctx.renderPage = () =>
    originalRenderPage({
      enhanceApp: (App) => 
        function EnhanceApp(props) {
          return <App emotionCache={cache} {...props} />;
        },
    });

  const initialProps = await Document.getInitialProps(ctx);
  const emotionStyles = extractCriticalToChunks(initialProps.html);
  const emotionStyleTags = emotionStyles.styles.map((style) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: style.css }}
    />
  ));

  // return {
  //   ...initialProps,
  //   styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  // };
  return {
    ...initialProps,
    emotionStyleTags,
  };
};

export default MyDocument;