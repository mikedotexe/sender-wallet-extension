import React, { useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import closeIcon from '../../assets/img/drawer_close.png';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';
import { fixedNearAmount, fixedNumber } from '../../utils';
import { setUnstakingResultDrawer } from '../../reducers/temp';

const UnstakingResultDrawer = () => {
  const history = useHistory();
  const dispatch = useDispatch();

  const marketStore = useSelector((state) => state.market);
  const tempStore = useSelector((state) => state.temp);

  const { prices } = marketStore;
  const { display, error, selectUnstakeValidator, unstakeAmount } = tempStore.unstakingResultDrawer;

  const available = useMemo(() => {
    return fixedNearAmount(selectUnstakeValidator.staked);
  }, [selectUnstakeValidator])

  const price = useMemo(() => {
    return fixedNumber(Number(available) * prices['NEAR'], 4);
  }, [prices, available])

  const handleClose = () => {
    dispatch(setUnstakingResultDrawer({ display: false }));
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
              <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Unstake successful!</Typography>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
              <img src={failIcon} alt="fail" style={{ width: '42px', height: '42px' }}></img>
              <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Unstake failed!</Typography>
            </Box>
          )
        }

        {
          !error ? (
            <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>{unstakeAmount} NEAR (≈ {price} USD) has successfully been unstaked from this validator</Typography>
          ) : (
            <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Sorry, {error}</Typography>
          )
        }

        <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '375px', marginTop: '35px', paddingLeft: '25px', paddingRight: '25px', boxSizing: 'border-box' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ width: '200px', fontSize: '14px', color: '#25272A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectUnstakeValidator.accountId}</Typography>
              <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{available} NEAR</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
                <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{(selectUnstakeValidator.fee && selectUnstakeValidator.fee.percentage) || 0}% Fee</Typography>
                <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
                <Typography sx={{ fontSize: '14px', color: selectUnstakeValidator.active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{selectUnstakeValidator.active ? 'active' : 'inactive'}</Typography>
              </Box>
              <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginTop: '8px' }}>≈ ${price} USD</Typography>
            </Box>
          </Box>
        </Box>

        <Typography sx={{ marginTop: '35px', marginBottom: '20px', marginLeft: '25px', marginRight: '25px', color: '#5E5E5E', fontSize: '14px' }} align='center'>Unstaked tokens will be made available pending a release period of ~52-65 (4 epochs)</Typography>

        <Button
          sx={{
            backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '18px', height: '48px', marginBottom: '37px',
            '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
          }}
          onClick={() => {
            if (!error) {
              history.push('/home');
            }
            handleClose();
          }}
        >
          <Typography sx={{ fontSize: '16px', color: '#202046' }}>{!error ? 'Rerturn' : 'Try Again'}</Typography>
        </Button>
      </Box>
    </BottomDrawer>
  )
}

export default UnstakingResultDrawer;
