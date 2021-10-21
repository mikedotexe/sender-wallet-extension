import React, { useState } from 'react';

import Box from '@material-ui/core/Box';

import Header from '../../components/Header';
import BottomNavigation from '../../components/BottomNavigation';

import WalletPage from '../Wallet';
import SwapPage from '../Swap';
import StakingPage from '../Staking';
import SettingsPage from '../Settings';


const Home = () => {
  const [value, setValue] = useState(0);

  return (
    <Box sx={{ backgroundColor: 'rgb(29, 29, 29)', width: 400, height: 600, position: 'relative', overflow: 'auto' }}>
      <Header>

      </Header>

      <Box sx={{ marginTop: '60px', marginBottom: '60px' }}>
        {value === 0 && <WalletPage />}
        {value === 1 && <SwapPage />}
        {value === 2 && <StakingPage />}
        {value === 3 && <SettingsPage />}
      </Box>

      <BottomNavigation
        value={value}
        onChange={(newValue) => { setValue(newValue); }}
      />
    </Box>
  )
}

export default Home;