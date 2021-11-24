import React, { useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';

import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BottomNavigation from '../../components/BottomNavigation';

import WalletPage from '../Wallet';
import SwapPage from '../Swap';
import StakingPage from '../Staking';
import SettingsPage from '../Settings';
import TransferConfirmDrawer from '../../components/BottomDrawer/TransferConfirmDrawer';
import TransferResultDrawer from '../../components/BottomDrawer/TransferResultDrawer';
import StakingConfirmDrawer from '../../components/BottomDrawer/StakingConfirmDrawer';
import StakingResultDrawer from '../../components/BottomDrawer/StakingResultDrawer';
import UnstakingConfirmDrawer from '../../components/BottomDrawer/UnstakingConfirmDrawer';
import UnstakingResultDrawer from '../../components/BottomDrawer/UnstakingResultDrawer';
import SwapConfirmDrawer from '../../components/BottomDrawer/SwapConfirmDrawer';
import SwapResultDrawer from '../../components/BottomDrawer/SwapResultDrawer';
import TwoFaDrawer from '../../components/BottomDrawer/TwoFaDrawer';
import { MARKET_UPDATE_PRICE } from '../../actions/market';
import { setBottomTabValue, setStakingConfirmDrawer, setSwapConfirmDrawer, setTransferConfirmDrawer, setTwoFaDrawer, setUnstakingConfirmDrawer } from '../../reducers/temp';
import { nearService } from '../../core/near';

const Home = () => {
  const dispatch = useDispatch();

  const tempStore = useSelector((state) => state.temp);
  const appStore = useSelector((state) => state.app);

  const [loading, setLoading] = useState(false);

  const { pendingRequests } = appStore;

  const value = useMemo(() => {
    return tempStore.bottomTabValue;
  }, [tempStore.bottomTabValue])

  useEffect(() => {
    const tokens = _.map(appStore.currentAccount.tokens, (token) => token.symbol);
    // dispatch({ type: MARKET_UPDATE_PRICE, tokens: ['NEAR', ...tokens] });
    // setTimeout(() => {
    //   dispatch({ type: MARKET_UPDATE_PRICE, tokens: ['NEAR', ...tokens] });
    // }, 10000)
  }, [appStore.currentAccount.tokens])

  useEffect(() => {
    const checkPendingRequest = async () => {
      const { secretKey, accountId } = appStore.currentAccount;
      const filterPendingRequests = _.filter(pendingRequests, request => request.signerId === accountId);
      if (!_.isEmpty(filterPendingRequests)) {
        setLoading(true);
        const pendingRequest = _.last(filterPendingRequests);
        console.log('filterPendingRequests: ', filterPendingRequests);
        await nearService.setSigner({ secretKey, accountId });
        const { requestId, type } = pendingRequest;
        if (requestId) {
          const method = await nearService.get2faMethod()
          setLoading(false);
          if (method) {
            dispatch(setTwoFaDrawer({ display: true, error: null, method, pendingRequest }));
          }
        } else {
          setLoading(false);
          switch (type) {
            case 'transfer': {
              const { sendAmount, selectToken, receiver } = pendingRequest;
              dispatch(setTransferConfirmDrawer({ display: true, sendAmount, selectToken, receiver }));
              break;
            }
            case 'staking': {
              const { stakeAmount, selectValidator } = pendingRequest;
              dispatch(setStakingConfirmDrawer({ display: true, stakeAmount, selectValidator }))
              break;
            }
            case 'unstake': {
              const { unstakeAmount, selectUnstakeValidator } = pendingRequest;
              dispatch(setUnstakingConfirmDrawer({ display: true, unstakeAmount, selectUnstakeValidator }))
              break;
            }
            case 'swap': {
              const { swapFrom, swapTo, swapAmount } = pendingRequest;
              dispatch(setSwapConfirmDrawer({ display: true, swapFrom, swapTo, swapAmount }));
              break;
            }
            default: {
              break;
            }
          }
        }
      }
    }
    checkPendingRequest();
  }, [])

  return (
    <BaseHeaderPage>
      <Dialog
        open={loading}
        PaperProps={{
          sx: { '&.MuiDialog-paper': { boxShadow: 'none', backgroundColor: 'rgba(0, 0, 0, 0)', color: 'rgba(0, 0, 0, 0)' } },
        }}
      >
        <CircularProgress></CircularProgress>
      </Dialog>

      {value === 0 && <WalletPage />}
      {value === 1 && <SwapPage />}
      {value === 2 && <StakingPage />}
      {value === 3 && <SettingsPage />}

      <BottomNavigation
        value={value}
        onChange={(newValue) => {
          dispatch(setBottomTabValue(newValue));
        }}
      />

      <TransferConfirmDrawer />
      <TransferResultDrawer />
      <StakingConfirmDrawer />
      <StakingResultDrawer />
      <UnstakingConfirmDrawer />
      <UnstakingResultDrawer />
      <SwapConfirmDrawer />
      <SwapResultDrawer />
      <TwoFaDrawer />
    </BaseHeaderPage >
  )
}

export default Home;