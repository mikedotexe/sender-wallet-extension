import React from 'react';

import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import _ from 'lodash';

import walletUnselectedIcon from '../../assets/img/bottom-navigation-wallet.png';
import walletSelectedIcon from '../../assets/img/bottom-navigation-wallet-selected.png';
import swapUnselectedIcon from '../../assets/img/bottom-navigation-swap.png';
import swapSelectedIcon from '../../assets/img/bottom-navigation-swap-selected.png';
import coinsUnselectedIcon from '../../assets/img/bottom-navigation-coins.png';
import coinsSelectedIcon from '../../assets/img/bottom-navigation-coins-selected.png';
import settingsUnselectedIcon from '../../assets/img/bottom-navigation-settings.png';
import settingsSelectedIcon from '../../assets/img/bottom-navigation-settings-selected.png';

const StyledBox = styled(Box)`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 60px;

  .MuiPaper-root {
    border-radius: 0px;
  }

  .MuiButtonBase-root:hover {
    background-color: unset;
  }

  .shadow {
    width: 39px;
    height: 39px;
    border-radius: 39px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, 0);
  }

  .selected {
    background-color: #F3F3F3;
  }
`

const bottoms = [
  {
    name: 'wallet',
    selectedIcon: walletSelectedIcon,
    unselectedIcon: walletUnselectedIcon,
  },
  {
    name: 'sawp',
    selectedIcon: swapSelectedIcon,
    unselectedIcon: swapUnselectedIcon,
  },
  {
    name: 'coins',
    selectedIcon: coinsSelectedIcon,
    unselectedIcon: coinsUnselectedIcon,
  },
  {
    name: 'settings',
    selectedIcon: settingsSelectedIcon,
    unselectedIcon: settingsUnselectedIcon,
  },
]

const BottomNavigation = ({ value, onChange }) => {
  return (
    <Paper sx={{ position: 'fixed', left: 0, bottom: 0, right: 0 }} elevation={4}>
      <StyledBox>
        {
          _.map(bottoms, (item, index) => {
            const icon = index === value ? item.selectedIcon : item.unselectedIcon;

            return (
              <Button key={`bottom-button-${item.name}`} onClick={() => { onChange(index); }} fullWidth={true} disableFocusRipple={true} disableRipple={true} disableTouchRipple={true}>
                <div className={`shadow ${value === index ? 'selected' : ''}`}>
                  <img src={icon} alt={icon.name}></img>
                </div>
              </Button>
            )
          })
        }
      </StyledBox>
    </Paper>
  )
}

export default BottomNavigation;
