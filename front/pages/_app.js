import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { Provider } from 'react-redux';

import wrapper from '../store/configureStore';

const App = ({ Component, ...rest }) => {
  const { store, props } = wrapper.useWrappedStore(rest);
  return (
    <Provider store={store}>
      <Head>
        <meta charSet="utf-8" />
        <title>Nodebird</title>
      </Head>
      <Component {...props.pageProps} />
    </Provider>
  );
};

App.propTypes = {
  Component: PropTypes.func.isRequired,
  store: PropTypes.object,
  pageProps: PropTypes.object,
};

export default App;
