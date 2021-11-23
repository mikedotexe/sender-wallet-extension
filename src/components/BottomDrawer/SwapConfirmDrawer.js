import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import closeIcon from '../../assets/img/drawer_close.png';
import { setSwapConfirmDrawer } from '../../reducers/temp';
import { APP_SWAP_NEAR } from '../../actions/app';

const SwapConfirmDrawer = () => {
  const dispatch = useDispatch();

  const tempStore = useSelector((state) => state.temp);

  const [loading, setLoading] = useState(false);

  const { display, swapAmount, swapFrom, swapTo } = tempStore.swapConfirmDrawer;

  useEffect(() => {
    setLoading(false);
  }, [display])

  const handleClose = () => {
    dispatch(setSwapConfirmDrawer({ display: false }));
  }

  const handleConfirm = () => {
    setLoading(true);
    dispatch({ type: APP_SWAP_NEAR, swapFrom, swapTo, amount: swapAmount });
  }

  return (
    <BottomDrawer
      open={display}
      onClose={handleClose}
    >
      <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

        <Typography sx={{ fontSize: '14px', color: '#202046', marginTop: '16px' }}>You are swaping</Typography>

        <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '20px', color: '#5E5E5E', marginTop: '20px', lineHeight: '25px', marginBottom: '20px' }}>{swapAmount} {swapFrom} to {swapAmount} {swapTo} </Typography>

        {
          !loading ? (
            <Button
              sx={{
                backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
                '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
              }}
              onClick={handleConfirm}
            >
              <Typography sx={{ fontSize: '16px', color: '#202046' }}>Confirm</Typography>
            </Button>
          ) : (
            <Button
              sx={{
                backgroundColor: '#CCCCCC', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
                '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
              }}
              disabled
            >
              <Typography sx={{ fontSize: '16px', color: 'white' }}>Staking...</Typography>
            </Button>
          )
        }

        <Button sx={{ width: '325px', height: '48px' }}>
          <Typography sx={{ fontSize: '14px', color: '#777777' }}>Cancel</Typography>
        </Button>
      </Box>
    </BottomDrawer>
  )
}

export default SwapConfirmDrawer;
