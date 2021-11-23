import React, { useEffect, useState, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import closeIcon from '../../assets/img/drawer_close.png';
import { fixedNearAmount, fixedNumber } from '../../utils';
import { setStakingConfirmDrawer } from '../../reducers/temp';
import { APP_ACCOUNT_STAKING } from '../../actions/app';

const StakingConfirmDrawer = () => {
  const dispatch = useDispatch();

  const marketStore = useSelector((state) => state.market);
  const tempStore = useSelector((state) => state.temp);

  const [loading, setLoading] = useState(false);

  const { prices } = marketStore;
  const { display, stakeAmount, selectValidator } = tempStore.stakingConfirmDrawer;

  useEffect(() => {
    setLoading(false);
  }, [display])

  const available = useMemo(() => {
    return fixedNearAmount(selectValidator.staked);
  }, [selectValidator])

  const stakeAmountPrice = useMemo(() => {
    return fixedNumber(Number(stakeAmount) * prices['NEAR'], 4);
  }, [stakeAmount, prices])

  const price = useMemo(() => {
    return fixedNumber(Number(available) * prices['NEAR'], 4);
  }, [prices, available])

  const handleClose = () => {
    dispatch(setStakingConfirmDrawer({ display: false }));
  }

  const handleConfirm = () => {
    setLoading(true);
    dispatch({ type: APP_ACCOUNT_STAKING, amount: stakeAmount })
  }

  return (
    <BottomDrawer
      open={display}
      onClose={handleClose}
    >
      <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

        <Typography sx={{ fontSize: '14px', color: '#202046', marginTop: '16px' }}>You are staking</Typography>

        <Typography sx={{ fontSize: '36px', color: '#202046', marginTop: '10px', fontWeight: 'bold' }}>{stakeAmount} NEAR</Typography>
        <Typography sx={{ fontSize: '14px', color: '#5E5E5E' }}>≈ ${stakeAmountPrice} USD</Typography>

        <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

        <Box sx={{ display: 'flex', alignItems: 'center', width: '375px', marginTop: '35px', paddingLeft: '25px', paddingRight: '25px', boxSizing: 'border-box', marginBottom: '20px' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ width: '200px', fontSize: '14px', color: '#25272A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectValidator.accountId}</Typography>
              <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{available} NEAR</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
                <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{(selectValidator.fee && selectValidator.fee.percentage) || 0}% Fee</Typography>
                <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
                <Typography sx={{ fontSize: '14px', color: selectValidator.active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{selectValidator.active ? 'active' : 'inactive'}</Typography>
              </Box>
              <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginTop: '8px' }}>≈ ${price} USD</Typography>
            </Box>
          </Box>
        </Box>

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

export default StakingConfirmDrawer;
