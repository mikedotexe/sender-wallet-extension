import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

const StartupHeader = () => {
  return (
    <Box sx={{ height: '60px', backgroundColor: '#222222', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '19px' }}>Kitty Wallet</Typography>
    </Box>
  )
}

export default StartupHeader;
