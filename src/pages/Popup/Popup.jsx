import React from 'react';
import { ThemeProvider } from '@material-ui/core/styles';

import './Popup.css';
import theme from '../../theme';

import Home from '../Home';

const Popup = () => {
  return (
    <ThemeProvider theme={theme}>
      <Home></Home>
    </ThemeProvider>
  );
};

export default Popup;
