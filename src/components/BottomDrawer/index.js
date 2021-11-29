import React from 'react';

import MuiDrawer from '@material-ui/core/Drawer';

import styled from 'styled-components';

const WrapperDrawer = styled(MuiDrawer)`

`

const BottomDrawer = ({ open, onClose, children, ...props }) => {
  return (
    <WrapperDrawer
      sx={{
        display: { xs: 'block', sm: 'none' },
        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: '100%', backgroundColor: 'white', borderTopLeftRadius: '40px', borderTopRightRadius: '40px' },
      }}
      anchor="bottom"
      open={open}
      onClose={onClose}
      {...props}
    >
      {children}
    </WrapperDrawer>
  )
}

export default BottomDrawer;
