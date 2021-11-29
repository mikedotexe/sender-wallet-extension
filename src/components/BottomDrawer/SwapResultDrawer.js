import React from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import closeIcon from '../../assets/img/drawer_close.png';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';
import { setSwapResultDrawer } from '../../reducers/temp';

const SwapResultDrawer = () => {
  const dispatch = useDispatch();

  const tempStore = useSelector((state) => state.temp);

  const { display, error, swapAmount, swapFrom, swapTo } = tempStore.swapResultDrawer;

  const handleClose = () => {
    dispatch(setSwapResultDrawer({ display: false }));
  }

  return (
    <BottomDrawer
      open={display}
      onClose={handleClose}
    >
      <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

        {
          !error ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
              <img src={successIcon} alt="success"></img>
              <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Swap successful!</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
              <img src={failIcon} alt="fail" style={{ width: '42px', height: '42px' }}></img>
              <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Swap failed!</Typography>
            </Box>
          )
        }

        {
          !error ? (
            <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Your swap: {swapAmount} {swapFrom} to {swapAmount} {swapTo} has successfully been confirmed</Typography>
          ) : (
            <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Sorry, {error}</Typography>
          )
        }

        <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

        <Button
          sx={{
            backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '18px', height: '48px', marginBottom: '37px',
            '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
          }}
          onClick={handleClose}
        >
          <Typography sx={{ fontSize: '16px', color: '#202046' }}>{!error ? 'Rerturn' : 'Try Again'}</Typography>
        </Button>
      </Box>
    </BottomDrawer>
  )
}

export default SwapResultDrawer;
