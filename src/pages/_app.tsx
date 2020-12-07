import App from 'next/app';

import GlobalStyle from '../styles/GlobalStyle';

import { AuthProvider } from '../hooks/auth';

class MyApp extends App {
  render(): JSX.Element {
    const { Component, pageProps } = this.props;

    return (
      <>
        <GlobalStyle />

        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      </>
    );
  }
}

export default MyApp;
