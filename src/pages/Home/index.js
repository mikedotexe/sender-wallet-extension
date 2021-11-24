import React, { useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BottomNavigation from '../../components/BottomNavigation';

import WalletPage from '../Wallet';
import SwapPage from '../Swap';
import StakingPage from '../Staking';
import SettingsPage from '../Settings';
import { MARKET_UPDATE_PRICE } from '../../actions/market';
import { setBottomTabValue } from '../../reducers/temp';

const Home = () => {
  const dispatch = useDispatch();
  const tempStore = useSelector((state) => state.temp);
  const appStore = useSelector((state) => state.app);

  const value = useMemo(() => {
    return tempStore.bottomTabValue;
  }, [tempStore.bottomTabValue])

  useEffect(() => {
    const tokens = _.map(appStore.currentAccount.tokens, (token) => token.symbol);
    dispatch({ type: MARKET_UPDATE_PRICE, tokens: ['NEAR', ...tokens] });
    setTimeout(() => {
      dispatch({ type: MARKET_UPDATE_PRICE, tokens: ['NEAR', ...tokens] });
    }, 10000)
  }, [appStore.currentAccount.tokens])

  return (
    <BaseHeaderPage>
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
    </BaseHeaderPage>
  )
}

export default Home;