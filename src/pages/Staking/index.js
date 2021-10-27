import React, { useState, useMemo, useCallback, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import _ from 'lodash';
import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import List from '../../components/List';
import ButtonGroup from '../../components/ButtonGroup';
import BottomDrawer from '../../components/BottomDrawer';
import { fixedNearAmount, fixedNumber } from '../../utils';
import { APP_ACCOUNT_STAKING, APP_UPDATE_ACCOUNT } from '../../actions/app';
import { usePrevious } from '../../hooks';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';
import closeIcon from '../../assets/img/drawer_close.png';
import { initStatus } from '../../reducers/loading';

const WrapperBasePage = styled(BasePage)`
  .list {
    background: #FFFFFF;
    box-shadow: 0px 0px 20px rgba(30, 30, 30, 0.06);
    border-radius: 40px 40px 0px 0px;
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  }

  .submit-button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 30px;
    width: 325px;
    height: 48px;
  }

  .validator {
    height: 68px;
    display: flex;
    flex: 1;
    justify-content: center;
    flex-direction: column;
    border-bottom: 1px inset #F3F3F3;
  }
`

const Validator = ({ data: validator }) => {
  return (
    <Box className="validator" key={validator.accountId}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ width: '200px', fontSize: '14px', color: '#25272A', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{validator.accountId}</Typography>
        <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{fixedNearAmount(validator.staked, 4)} NEAR</Typography>
      </Box>
      <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
        <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{validator.fee.percentage}%</Typography>
        <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
        <Typography sx={{ fontSize: '14px', color: validator.active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{validator.active ? 'active' : 'inactive'}</Typography>
      </Box>
    </Box>
  )
}

const Staking = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const marketStore = useSelector((state) => state.market);
  const loadingStore = useSelector((state) => state.loading);
  const tempStore = useSelector((state) => state.temp);
  const [tabValue, setTabValue] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');
  const [resultDrawerOpen, setResultDrawerOpen] = useState(false);

  const { selectValidator } = tempStore;
  const { stakingLoading, stakingError } = loadingStore;
  const prestakingLoading = usePrevious(stakingLoading);

  useEffect(() => {
    if (prestakingLoading && !stakingLoading) {
      setTimeout(() => {
        setResultDrawerOpen(true);
      }, 1000)
    }
  }, [stakingLoading])

  const validators = useMemo(() => {
    return _.filter(appStore.currentAccount.validators, (validator) => Number(validator.staked) !== 0);
  }, [appStore.currentAccount.validators])

  const totalStaked = useMemo(() => {
    return fixedNearAmount(appStore.currentAccount.totalStaked);
  }, [appStore.currentAccount.totalStaked])

  const totalStakedPrice = useMemo(() => {
    return fixedNumber(Number(totalStaked) * marketStore.prices['NEAR'], 4);
  }, [totalStaked, marketStore.prices])

  const totalRewards = useMemo(() => {
    return fixedNearAmount(appStore.currentAccount.totalUnclaimed);
  }, [appStore.currentAccount.totalUnclaimed])

  const totalRewardsPrice = useMemo(() => {
    return fixedNumber(Number(totalRewards) * marketStore.prices['NEAR'], 4);
  }, [totalRewards, marketStore.prices])

  const totalPending = useMemo(() => {
    return fixedNearAmount(appStore.currentAccount.totalPending);
  }, [appStore.currentAccount.totalPending])

  const totalPendingPrice = useMemo(() => {
    return fixedNumber(Number(totalPending) * marketStore.prices['NEAR'], 4);
  }, [totalPending, marketStore.prices])

  const totalAvailable = useMemo(() => {
    return fixedNearAmount(appStore.currentAccount.totalAvailable);
  }, [appStore.currentAccount.totalAvailable])

  const totalAvailablePrice = useMemo(() => {
    return fixedNumber(Number(totalAvailable) * marketStore.prices['NEAR'], 4);
  }, [totalAvailable, marketStore.prices])

  const selectValidatorClick = () => {
    history.push('/staking/validators');
  }

  const stakeAmountPrice = useMemo(() => {
    return fixedNumber(Number(stakeAmount) * marketStore.prices['NEAR'], 4);
  }, [stakeAmount, marketStore.prices])

  const stakeAmountChanged = useCallback((e) => {
    const amount = e.target.value;
    setStakeAmount(amount);
  }, [])

  const submitStakeClicked = useCallback(() => {
    dispatch({ type: APP_ACCOUNT_STAKING, amount: stakeAmount })
  }, [stakeAmount])

  const handleCloseDrawer = () => {
    setResultDrawerOpen(false);
    if (!stakingError) {
      dispatch({ type: APP_UPDATE_ACCOUNT });
    }
    initStatus();
  }

  return (
    <WrapperBasePage>
      <Box sx={{ marginLeft: '25px', marginRight: '25px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>Amount</Typography>
        <BaseBox>
          <Input type="text" placeholder='' value={stakeAmount} onChange={stakeAmountChanged}></Input>
        </BaseBox>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
          <Typography sx={{ fontSize: '12px', color: '#777777' }}>Available balance</Typography>
          <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>{fixedNearAmount(appStore.currentAccount.balance.available)} NEAR</Typography>
        </Box>

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '15px' }}>Stake with</Typography>
        <BaseBox sx={{ paddingTop: '8px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '8px' }}>
          <Typography sx={{ width: '230px', fontSize: '16px', color: 'white', lineHeight: '24px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{selectValidator.accountId}</Typography>
          <Button sx={{ width: '100%', justifyContent: 'end', }} onClick={selectValidatorClick}>
            <Typography sx={{ fontSize: '16px', color: '#FAD165' }}>Select</Typography>
          </Button>
        </BaseBox>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Button className="submit-button" onClick={submitStakeClicked} disabled={stakingLoading}>
            <Typography sx={{ fontSize: '16px', color: 'white' }}>{stakingLoading ? 'Staking...' : 'Submit Stake'}</Typography>
          </Button>
        </Box>
      </Box>

      <Box className='list'>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>
        <Box sx={{ marginTop: '11px', width: '315px', alignSelf: 'center', marginBottom: '9px' }}>
          <ButtonGroup buttons={['My Staking', 'Current validators']} value={tabValue} onChange={setTabValue}></ButtonGroup>
        </Box>
        {
          tabValue ? (
            <List sx={{ width: '100%', paddingLeft: '18px', paddingRight: '18px', boxSizing: 'border-box' }} list={validators} Component={Validator}></List>
          ) : (
            <Box sx={{ width: '100%', paddingLeft: '18px', paddingRight: '18px', boxSizing: 'border-box' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Staked</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{totalStaked} NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ ${totalStakedPrice} USD</Typography>
                  </Box>
                </Box>

                <Button sx={{ borderRadius: '13px', border: "1px solid #588912", width: '75px', height: '30px' }}><Typography sx={{ fontSize: '14px', color: '#588912' }}>Unstake</Typography></Button>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Rewards earned</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{totalRewards} NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ ${totalRewardsPrice} USD</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Pending release</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{totalPending} NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ ${totalPendingPrice} USD</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px', marginBottom: '20px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Available for withdrawal</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{totalAvailable} NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ ${totalAvailablePrice} USD</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        }
      </Box>

      <BottomDrawer
        open={resultDrawerOpen}
        onClose={handleCloseDrawer}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleCloseDrawer}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          {
            !stakingError ? (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                <img src={successIcon} alt="success"></img>
                <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Stake successful!</Typography>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '15px' }}>
                <img src={failIcon} alt="fail" style={{ width: '42px', height: '42px' }}></img>
                <Typography sx={{ fontSize: '16px', color: '#202046', marginLeft: '16px' }}>Stake failed!</Typography>
              </Box>
            )
          }

          {
            !stakingError ? (
              <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Your stake has successfully been delegated to your chosen validator</Typography>
            ) : (
              <Typography align='center' sx={{ marginLeft: '16px', marginRight: '16px', fontSize: '14px', color: '#5E5E5E', marginTop: '16px', lineHeight: '16px', marginBottom: '37px' }}>Sorry, {stakingError}</Typography>
            )
          }

          <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

          <Box sx={{ marginTop: '35px', width: '100%', paddingLeft: '25px', paddingRight: '25px', boxSizing: 'border-box' }} key={selectValidator.accountId}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '14px', color: '#25272A' }}>{selectValidator.accountId}</Typography>
              <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{stakeAmount} NEAR</Typography>
            </Box>
            <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
                <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{selectValidator.fee.percentage}%</Typography>
                <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
                <Typography sx={{ fontSize: '14px', color: selectValidator.active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{selectValidator.active ? 'active' : 'inactive'}</Typography>
              </Box>
              <Typography sx={{ fontSize: '12px', color: '#5E5E5E', fontWeight: 'bold' }}>≈${stakeAmountPrice} USD</Typography>
            </Box>

            {!stakingError && (<Typography align='center' sx={{ fontSize: '14px', color: '#5E5E5E', marginTop: '34px', lineHeight: '16px', marginBottom: '20px' }}>You can now view your delegation and staking rewards from your validators list.</Typography>)}
          </Box>

          <Button
            sx={{
              backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '18px', height: '48px', marginBottom: '37px',
              '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
            }}
            onClick={handleCloseDrawer}
          >
            <Typography sx={{ fontSize: '16px', color: '#202046' }}>{!stakingError ? 'Rerturn' : 'Try Again'}</Typography>
          </Button>
        </Box>
      </BottomDrawer>
    </WrapperBasePage>
  )
}

export default Staking;
