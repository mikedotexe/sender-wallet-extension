import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import _ from 'lodash';

import BasePage from '../../components/BasePage';
import BottomNavigation from '../../components/BottomNavigation';

import WalletPage from '../Wallet';
import SwapPage from '../Swap';
import StakingPage from '../Staking';
import SettingsPage from '../Settings';
import { MARKET_UPDATE_PRICE } from '../../actions/market';


const Home = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);
  const appStore = useSelector((state) => state.app);

  useEffect(() => {
    setTimeout(() => {
      const tokens = _.map(appStore.currentAccount.tokens, (token) => token.symbol);
      dispatch({ type: MARKET_UPDATE_PRICE, tokens: ['NEAR', ...tokens] });
    }, 10000)
  }, [appStore.currentAccount.tokens])

  return (
    <BasePage>
      {value === 0 && <WalletPage />}
      {value === 1 && <SwapPage />}
      {value === 2 && <StakingPage />}
      {value === 3 && <SettingsPage />}

      <BottomNavigation
        value={value}
        onChange={(newValue) => { setValue(newValue); }}
      />
    </BasePage>
  )
}

export default Home;