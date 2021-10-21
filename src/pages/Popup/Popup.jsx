import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import './Popup.css';
import theme from '../../theme';

import Router from '../../Router';

const Popup = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
      </Router>
    </ThemeProvider>
  );
};

export default Popup;
