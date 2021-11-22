import React, { useState, useMemo, useEffect } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import styled from 'styled-components';
import _ from 'lodash';

import BaseHeaderPage from '../../components/BaseHeaderPage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import arrowIcon from '../../assets/img/arrow_down.png';
import swapIcon from '../../assets/img/swap.png';
import { fixedNearAmount } from '../../utils';
import { APP_SWAP_NEAR } from '../../actions/app';
import SwapResultDrawer from '../../components/BottomDrawer/SwapResultDrawer';

const WrapperBasePage = styled(BaseHeaderPage)`
  padding-left: 25px;
  padding-right: 25px;
  box-sizing: border-box;
  position: relative;

  .swap-logo {
    width: 32px;
    height: 32px;
    position: absolute;
    left: 141px;
    top: 145px;
    background-color: #393939;
    border-radius: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .swap-input {
    height: 48px;
    padding: 0px;
    position: relative;
  }

  .swap-currency-button {
    background: #1E1E1E;
    border-top-right-radius: 12px;
    border-bottom-right-radius: 12px;
    width: 105px;
    border: 1px solid #090909;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 15px;
    padding-right: 15px;
    box-sizing: border-box;
  }

  .swap-button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 30px;
    width: 325px;
    height: 48px;
  }
`

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ }) => ({
  '& .MuiPaper-root': {
    backgroundColor: 'black',
    '& .MuiMenuItem-root': {
      width: '100px',
      height: '50px',
    }
  },
}));

const swapTokens = ['NEAR', 'wNEAR'];

const getTokenBalance = (tokens, symbol) => {
  const token = _.find(tokens, item => item.symbol === symbol);
  if (token) {
    return fixedNearAmount(token.balance);
  }
  return 0;
}

const Swap = () => {
  const dispatch = useDispatch();

  const appStore = useSelector((state) => state.app);
  const tempStore = useSelector((state) => state.temp);

  const [swapFrom, setSwapFrom] = useState('NEAR');
  const [swapAmount, setSwapAmount] = useState('');
  const [swapTo, setSwapTo] = useState('wNEAR');
  const [swapFromAnchorEl, setSwapFromAnchorEl] = useState(null);
  const [swapToAnchorEl, setSwapTPAnchorEl] = useState(null);
  const [loading, setLoading] = useState(false);

  const { tokens } = appStore.currentAccount;
  const { display } = tempStore.swapResultDrawer;

  useEffect(() => {
    setLoading(false);
  }, [display])

  const swapFromBalance = useMemo(() => {
    const balance = getTokenBalance(tokens, swapFrom);
    return balance;
  }, [swapFrom, tokens])

  const swapToBalance = useMemo(() => {
    const balance = getTokenBalance(tokens, swapTo);
    return balance;
  }, [swapTo, tokens])

  const swapAmountChanged = (e) => {
    setSwapAmount(e.target.value);
  }

  const handleSwapFromClick = (event) => {
    setSwapFromAnchorEl(event.currentTarget);
  };
  const handleSwapFromClose = () => {
    setSwapFromAnchorEl(null);
  };
  const swapFromClicked = (from) => {
    setSwapFromAnchorEl(null);

    if (from === swapTo) {
      const to = _.filter(swapTokens, token => token !== from)[0];
      setSwapTo(to);
    }
    setSwapFrom(from);
  }

  const handleSwapToClick = (event) => {
    setSwapTPAnchorEl(event.currentTarget);
  };
  const handleSwapToClose = () => {
    setSwapTPAnchorEl(null);
  };
  const swapToClicked = (to) => {
    setSwapTPAnchorEl(null);

    if (to === swapFrom) {
      const from = _.filter(swapTokens, token => token !== to)[0];
      setSwapFrom(from);
    }
    setSwapTo(to);
  }

  const swapClicked = () => {
    setLoading(true);
    dispatch({ type: APP_SWAP_NEAR, swapFrom, swapTo, amount: swapAmount });
  }

  return (
    <WrapperBasePage>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: 'white' }}>From</Typography>
        <Typography sx={{ color: '#777777' }}>Balance: {swapFromBalance || 0}</Typography>
      </Box>
      <BaseBox className="swap-input">
        <Input onChange={swapAmountChanged} value={swapAmount} type="number" style={{ paddingLeft: '15px', paddingRight: '15px' }}></Input>
        <Button
          className="swap-currency-button"
          onClick={handleSwapFromClick}
          id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={!!swapFromAnchorEl ? 'true' : undefined}
        >
          <Typography sx={{ color: 'white' }}>{swapFrom}</Typography>
          <img style={{ width: '10px', height: '6px' }} src={arrowIcon} alt="arrow"></img>
        </Button>
        <StyledMenu
          id="basic-menu"
          anchorEl={swapFromAnchorEl}
          open={!!swapFromAnchorEl}
          onClose={handleSwapFromClose}
          MenuListProps={{
            'aria-labelledby': 'demo-customized-button',
          }}
        >
          {
            _.map(_.filter(swapTokens, token => token !== swapFrom), token => {
              return (
                <MenuItem sx={{}} key={token} onClick={() => swapFromClicked(token)}>
                  <Typography sx={{ color: 'white' }}>{token}</Typography>
                </MenuItem>
              )
            })
          }
        </StyledMenu>

        <Button sx={{ minHeight: 0, padding: 0, position: 'absolute', right: 0, bottom: '-25px' }}><Typography sx={{ fontSize: '12px', color: '#FFCE3E' }}>Use Max</Typography></Button>
      </BaseBox>

      <Box className="swap-logo">
        <img style={{ width: '15px', height: '15px' }} src={swapIcon} alt="swap"></img>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Typography sx={{ color: 'white' }}>To</Typography>
        <Typography sx={{ color: '#777777' }}>Balance: {swapToBalance || 0}</Typography>
      </Box>
      <BaseBox className="swap-input">
        <Input disabled value={swapAmount} type="number" style={{ paddingLeft: '15px', paddingRight: '15px' }}></Input>
        <Button
          className="swap-currency-button"
          onClick={handleSwapToClick}
          id="basic-button"
          aria-controls="basic-menu"
          aria-haspopup="true"
          aria-expanded={!!swapToAnchorEl ? 'true' : undefined}
        >
          <Typography sx={{ color: 'white' }}>{swapTo}</Typography>
          <img style={{ width: '10px', height: '6px' }} src={arrowIcon} alt="arrow"></img>
        </Button>
        <StyledMenu
          id="basic-menu"
          anchorEl={swapToAnchorEl}
          open={!!swapToAnchorEl}
          onClose={handleSwapToClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {
            _.map(_.filter(swapTokens, token => token !== swapTo), token => {
              return (
                <MenuItem key={token} onClick={() => swapToClicked(token)}>
                  <Typography sx={{ color: 'white' }}>{token}</Typography>
                </MenuItem>
              )
            })
          }
        </StyledMenu>
      </BaseBox>

      {/* <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '18px' }}>
        <Typography sx={{ color: '#777777' }}>Slippage</Typography>
        <Box sx={{ border: '1px solid #535353', display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderRadius: '15px', marginLeft: '15px' }}>
          <Button sx={{ color: '#777777' }}>0.1%</Button>
          <Button sx={{ color: '#FFCE3E' }}>0.5%</Button>
          <Button sx={{ color: '#777777' }}>1.0%</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px' }}>
        <Typography sx={{ color: '#777777' }}>Minimum received</Typography>
        <Typography sx={{ color: '#777777' }}>0.1209 NEAR</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ color: '#777777' }}>Swap rate</Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography sx={{ color: '#777777' }}>7.5505 USDC per wNEAR</Typography>
          <Button><img style={{ width: '12px', height: '12px' }} src={exchangeIcon} alt="exchange"></img></Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ color: '#777777' }}>Pool fee</Typography>
        <Typography sx={{ color: '#777777' }}>0.3%(0)</Typography>
      </Box> */}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button className="swap-button" disabled={loading} onClick={swapClicked}>
          <Typography sx={{ fontSize: '16px', color: 'white' }}>{loading ? 'Swaping...' : 'Swap'}</Typography>
        </Button>
      </Box>

      <SwapResultDrawer />
    </WrapperBasePage>
  )
}

export default Swap;
