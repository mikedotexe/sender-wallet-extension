import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import _ from 'lodash';
import styled from 'styled-components';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import List from '../../components/List';
import ButtonGroup from '../../components/ButtonGroup';
import { fixedNearAmount, fixedNumber } from '../../utils';
import { APP_ACCOUNT_STAKING } from '../../actions/app';
import StakingResultDrawer from '../../components/BottomDrawer/StakingResultDrawer';
import TwoFaDrawer from '../../components/BottomDrawer/TwoFaDrawer';
import { setStakingConfirmDrawer } from '../../reducers/temp';
import StakingConfirmDrawer from '../../components/BottomDrawer/StakingConfirmDrawer';

const WrapperBasePage = styled(BaseHeaderPage)`
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
  const tempStore = useSelector((state) => state.temp);

  const [tabValue, setTabValue] = useState(0);
  const [stakeAmount, setStakeAmount] = useState('');

  const { selectValidator } = tempStore;

  const validators = useMemo(() => {
    return _.filter(appStore.currentAccount.validators, (validator) => validator.staked !== '0');
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

  const stakeAmountChanged = useCallback((e) => {
    const amount = e.target.value;
    setStakeAmount(amount);
  }, [])

  const submitStakeClicked = useCallback(() => {
    dispatch(setStakingConfirmDrawer({ display: true, stakeAmount, selectValidator }))
  }, [stakeAmount])

  const selectValidatorClick = () => {
    history.push('/staking/validators/false');
  }

  const unstakeClicked = () => {
    history.push('/staking/validators/true');
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
          <Button className="submit-button" onClick={submitStakeClicked} disabled={!stakeAmount || !selectValidator.accountId}>
            <Typography sx={{ fontSize: '16px', color: 'white' }}>{'Submit Stake'}</Typography>
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

                <Button onClick={unstakeClicked} sx={{ borderRadius: '13px', border: "1px solid #588912", width: '75px', height: '30px' }}><Typography sx={{ fontSize: '14px', color: '#588912' }}>Unstake</Typography></Button>
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
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{totalAvailable} NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ ${totalAvailablePrice} USD</Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ marginTop: '12px', backgroundColor: '#F3F3F3' }}></Divider>

              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', marginTop: '12px', marginBottom: '20px' }}>
                <Box>
                  <Typography sx={{ fontSize: '14px', color: '#25272A' }}>Available for withdrawal</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'start', flexDirection: 'row' }}>
                    <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>{totalPending} NEAR</Typography>
                    <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginLeft: '8px' }}>≈ ${totalPendingPrice} USD</Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )
        }
      </Box>

      <StakingConfirmDrawer />
      <StakingResultDrawer />
      <TwoFaDrawer />
    </WrapperBasePage>
  )
}

export default Staking;
