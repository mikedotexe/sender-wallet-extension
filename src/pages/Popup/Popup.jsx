import React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { ConnectedRouter } from 'connected-react-router';
import { ThemeProvider } from '@material-ui/core/styles';
import ReactGA from 'react-ga';

import './Popup.css';
import theme from '../../theme';

import Router from '../../Router';
import { store, persistor, history } from '../../Store';

ReactGA.initialize('G-VF50EXY360');

const Popup = () => {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeProvider theme={theme}>
            <Router>
            </Router>
          </ThemeProvider>
        </PersistGate>
      </ConnectedRouter>
    </Provider>
  );
};

export default Popup;
