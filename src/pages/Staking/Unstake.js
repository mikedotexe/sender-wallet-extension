import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import BottomDrawer from '../../components/BottomDrawer';
import Input from '../../components/Input';
import backIcon from '../../assets/img/back.png';
import closeIcon from '../../assets/img/drawer_close.png';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';
import { fixedNearAmount, fixedNumber } from '../../utils';
import { APP_ACCOUNT_UNSTAKING } from '../../actions/app';
import { usePrevious } from '../../hooks';
import { initStatus } from '../../reducers/loading';

const WrapperBasePage = styled(BasePage)`
  .search-input {
    flex: 1;
    margin-left: 11px;
  }
`

const Unstake = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const tempStore = useSelector((state) => state.temp);
  const marketStore = useSelector((state) => state.market);
  const loadingStore = useSelector((state) => state.loading);
  const [confirmDrawerOpen, setConfirmDrawerOpen] = useState(false);
  const [resultDrawerOpen, setResultDrawerOpen] = useState(false);
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const { selectUnstakeValidator } = tempStore;
  const { prices } = marketStore;
  const { unstakingLoading, unstakingError } = loadingStore;
  const preUnstakingLoading = usePrevious(unstakingLoading);

  const available = useMemo(() => {
    return fixedNearAmount(selectUnstakeValidator.staked);
  }, [selectUnstakeValidator])

  const price = useMemo(() => {
    return fixedNumber(Number(available) * prices['NEAR'], 4);
  }, [prices, available])

  const unstakeAmountChanged = useCallback((e) => {
    const amount = e.target.value;
    setUnstakeAmount(amount);
  }, [])

  const unstakeAmountPrice = useMemo(() => {
    return fixedNumber(Number(unstakeAmount) * prices['NEAR'], 4);
  }, [unstakeAmount, prices])

  useEffect(() => {
    if (preUnstakingLoading && !unstakingLoading) {
      setConfirmDrawerOpen(false);
      setTimeout(() => {
        setResultDrawerOpen(true);
      }, 500)
    }
  }, [unstakingLoading])

  const backClicked = () => {
    history.goBack();
  }

  const unstakeClicked = () => {
    setConfirmDrawerOpen(true);
  }

  const confirmClicked = () => {
    dispatch({ type: APP_ACCOUNT_UNSTAKING, amount: unstakeAmount })
  }

  const handleDrawerClosed = () => {
    setConfirmDrawerOpen(false);
    setResultDrawerOpen(false);
    dispatch(initStatus());
  }

  const useMaxClicked = () => {
    setUnstakeAmount(available);
  }

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Unstake Tokens</Typography>
      </Box>

      <Typography sx={{ marginLeft: '35px', marginRight: '35px', fontSize: '14px', color: '#777777', marginTop: '15px' }} align='center'>Enter the number of tokens you would like to unstake from your current validator</Typography>

      <Box sx={{ marginLeft: '30px', marginRight: '30px', marginTop: '18px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>Amount</Typography>
        <BaseBox>
          <Input type="text" placeholder='0' value={unstakeAmount} onChange={unstakeAmountChanged}></Input>

          <Button onClick={useMaxClicked} sx={{ minHeight: 0, padding: 0 }}><Typography sx={{ fontSize: '12px', color: '#777777' }}>Use Max</Typography></Button>
        </BaseBox>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <Typography sx={{ fontSize: '12px', color: '#777777' }}>Available balance</Typography>
          <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>{available} NEAR</Typography>
        </Box>

        <Box sx={{ marginTop: '25px' }}>
          <Typography align='center' sx={{ fontSize: '12px', color: '#777777' }}>Unstake form</Typography>

          <Box sx={{ backgroundColor: '#343434', borderRadius: '12px', paddingTop: '31px', paddingBottom: '31px', paddingLeft: '15px', paddingRight: '15px', marginTop: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '12px', color: '#777777' }}>Available balance</Typography>
              <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>{available} NEAR</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <Typography sx={{ fontSize: '12px', color: '#777777' }}>{selectUnstakeValidator.fee.percentage}%Fee - {selectUnstakeValidator.active ? 'active' : 'inactive'}</Typography>
              <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>≈${price} USD</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }}>
        <Button disabled={!unstakeAmount} onClick={unstakeClicked} sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Unstake Tokens</Typography>
        </Button>
      </Box>

      {/* Confirm Drawer */}
      <BottomDrawer
        open={confirmDrawerOpen}
        onClose={handleDrawerClosed}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleDrawerClosed}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          <Typography sx={{ fontSize: '14px', color: '#202046', marginTop: '16px' }}>You are unstaking</Typography>

          <Typography sx={{ fontSize: '36px', color: '#202046', marginTop: '10px', fontWeight: 'bold' }}>{unstakeAmount} NEAR</Typography>
          <Typography sx={{ fontSize: '14px', color: '#5E5E5E' }}>≈ ${unstakeAmountPrice} USD</Typography>

          <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

          <Box sx={{ display: 'flex', alignItems: 'center', width: '375px', marginTop: '35px', paddingLeft: '25px', paddingRight: '25px', boxSizing: 'border-box' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ width: '200px', fontSize: '14px', color: '#25272A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectUnstakeValidator.accountId}</Typography>
                <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{available} NEAR</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
                  <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{selectUnstakeValidator.fee.percentage}% Fee</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
                  <Typography sx={{ fontSize: '14px', color: selectUnstakeValidator.active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{selectUnstakeValidator.active ? 'active' : 'inactive'}</Typography>
                </Box>
                <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginTop: '8px' }}>≈ ${price} USD</Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={{ marginTop: '35px', marginBottom: '20px', marginLeft: '25px', marginRight: '25px', color: '#5E5E5E', fontSize: '14px' }} align='center'>Unstaked tokens will be made available pending a release period of ~52-65 (4 epochs)</Typography>

          {
            !unstakingLoading ? (
              <Button
                sx={{
                  backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
                  '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
                }}
                onClick={confirmClicked}
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
                <Typography sx={{ fontSize: '16px', color: 'white' }}>Unstaking...</Typography>
              </Button>
            )
          }

          <Button sx={{ width: '325px', height: '48px' }}>
            <Typography sx={{ fontSize: '14px', color: '#777777' }}>Cancel</Typography>
          </Button>
        </Box>
      </BottomDrawer>

      {/* Result Drawer */}
      <BottomDrawer
        open={resultDrawerOpen}
        onClose={handleDrawerClosed}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleDrawerClosed}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          {
            !unstakingError ? (
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
            !unstakingError ? (
              <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>{unstakeAmount} NEAR (≈ {price} USD) has successfully been unstaked from this validator</Typography>
            ) : (
              <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Sorry, {unstakingError}</Typography>
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
                  <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{selectUnstakeValidator.fee.percentage}% Fee</Typography>
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
              if (!unstakingError) {
                history.push('/home');
              }
              handleDrawerClosed();
            }}
          >
            <Typography sx={{ fontSize: '16px', color: '#202046' }}>{!unstakingError ? 'Rerturn' : 'Try Again'}</Typography>
          </Button>
        </Box>
      </BottomDrawer>
    </WrapperBasePage>
  )
}

export default Unstake;
