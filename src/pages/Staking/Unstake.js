import React, { useState, useMemo, useCallback } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import backIcon from '../../assets/img/back.png';
import { fixedNearAmount, fixedNumber } from '../../utils';
import UnstakingConfirmDrawer from '../../components/BottomDrawer/UnstakingConfirmDrawer';
import UnstakingResultDrawer from '../../components/BottomDrawer/UnstakingResultDrawer';
import { setUnstakingConfirmDrawer } from '../../reducers/temp';
import TwoFaDrawer from '../../components/BottomDrawer/TwoFaDrawer';

const WrapperBasePage = styled(BaseHeaderPage)`
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
  const [unstakeAmount, setUnstakeAmount] = useState('');

  const { selectUnstakeValidator } = tempStore;
  const { prices } = marketStore;

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

  const backClicked = () => {
    history.goBack();
  }

  const unstakeClicked = () => {
    dispatch(setUnstakingConfirmDrawer({ display: true, unstakeAmount, selectUnstakeValidator }))
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

      <UnstakingConfirmDrawer />
      <UnstakingResultDrawer />
      <TwoFaDrawer />
    </WrapperBasePage>
  )
}

export default Unstake;
