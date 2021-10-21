import React, { useState } from 'react';

import Box from '@material-ui/core/Box';

import BasePage from '../../components/BasePage';
import BottomNavigation from '../../components/BottomNavigation';

import WalletPage from '../Wallet';
import SwapPage from '../Swap';
import StakingPage from '../Staking';
import SettingsPage from '../Settings';


const Home = () => {
  const [value, setValue] = useState(0);

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