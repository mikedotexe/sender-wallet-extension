import React from 'react';

import MuiDrawer from '@material-ui/core/Drawer';

const Drawer = ({ open, onClose }) => {
  return (
    <MuiDrawer
      anchor="bottom"
      open={open}
      onClose={onClose}
    >
      <div>Drawer</div>
    </MuiDrawer>
  )
}

export default Drawer;
