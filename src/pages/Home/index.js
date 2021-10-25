import React, { useState, useEffect } from 'react';

import { useDispatch } from 'react-redux';

import BasePage from '../../components/BasePage';
import BottomNavigation from '../../components/BottomNavigation';

import WalletPage from '../Wallet';
import SwapPage from '../Swap';
import StakingPage from '../Staking';
import SettingsPage from '../Settings';
import { MARKET_UPDATE_PRICE } from '../../actions/market';


const Home = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState(2);

  // useEffect(() => {
  //   setTimeout(() => {
  //     dispatch({ type: MARKET_UPDATE_PRICE, tokens: ['NEAR', 'REF'] });
  //   }, 10000)
  // }, [])

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