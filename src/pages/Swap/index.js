import React from 'react';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import arrowIcon from '../../assets/img/arrow_down.png';
import swapIcon from '../../assets/img/swap.png';
import exchangeIcon from '../../assets/img/exchange.png';

const WrapperBasePage = styled(BasePage)`
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
    width: 105px;
    border-left: 1px solid #090909;
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

const Swap = () => {
  return (
    <WrapperBasePage>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography sx={{ color: 'white' }}>From</Typography>
        <Typography sx={{ color: '#777777' }}>Balance: 0</Typography>
      </Box>
      <BaseBox className="swap-input">
        <Input></Input>
        <Button className="swap-currency-button">
          <Typography sx={{ color: 'white' }}>wNEAR</Typography>
          <img style={{ width: '10px', height: '6px' }} src={arrowIcon} alt="arrow"></img>
        </Button>

        <Button sx={{ minHeight: 0, padding: 0, position: 'absolute', right: 0, bottom: '-25px' }}><Typography sx={{ fontSize: '12px', color: '#FFCE3E' }}>Use Max</Typography></Button>
      </BaseBox>

      <Box className="swap-logo">
        <img style={{ width: '15px', height: '15px' }} src={swapIcon} alt="swap"></img>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '30px' }}>
        <Typography sx={{ color: 'white' }}>To</Typography>
        <Typography sx={{ color: '#777777' }}>Balance: 0</Typography>
      </Box>
      <BaseBox className="swap-input">
        <Input></Input>
        <Button className="swap-currency-button">
          <Typography sx={{ color: 'white' }}>USDC</Typography>
          <img style={{ width: '10px', height: '6px' }} src={arrowIcon} alt="arrow"></img>
        </Button>
      </BaseBox>

      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '18px' }}>
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
          {/* <Button><img style={{ width: '12px', height: '12px' }} src={exchangeIcon} alt="exchange"></img></Button> */}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Typography sx={{ color: '#777777' }}>Pool fee</Typography>
        <Typography sx={{ color: '#777777' }}>0.3%(0)</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button className="swap-button">
          <Typography sx={{ fontSize: '16px', color: 'white' }}>Swap</Typography>
        </Button>
      </Box>
    </WrapperBasePage>
  )
}

export default Swap;
