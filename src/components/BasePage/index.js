import React from 'react';

import Box from '@material-ui/core/Box';

import Header from '../../components/Header';

const BasePage = ({ className, children }) => {
  return (
    <Box className={className} sx={{ backgroundColor: 'rgb(29, 29, 29)', width: 400, height: 600, position: 'relative', overflow: 'auto' }}>
      <Header />
      <Box sx={{ marginTop: '60px', marginBottom: '60px' }}></Box>
      {children}
    </Box>
  )
}

export default BasePage;