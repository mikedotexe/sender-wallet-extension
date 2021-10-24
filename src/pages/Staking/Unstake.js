import React from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import backIcon from '../../assets/img/back.png';

const WrapperBasePage = styled(BasePage)`
  .search-input {
    flex: 1;
    margin-left: 11px;
  }
`

const Unstake = () => {
  const history = useHistory();

  const backClicked = () => {
    history.goBack();
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
          <Input type="text" placeholder='0'></Input>

          <Button sx={{ minHeight: 0, padding: 0 }}><Typography sx={{ fontSize: '12px', color: '#777777' }}>Use Max</Typography></Button>
        </BaseBox>

        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
          <Typography sx={{ fontSize: '12px', color: '#777777' }}>Available balance</Typography>
          <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>0.1209 NEAR</Typography>
        </Box>

        <Box sx={{ marginTop: '25px' }}>
          <Typography align='center' sx={{ fontSize: '12px', color: '#777777' }}>Unstake form</Typography>

          <Box sx={{ backgroundColor: '#343434', borderRadius: '12px', paddingTop: '31px', paddingBottom: '31px', paddingLeft: '15px', paddingRight: '15px', marginTop: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography sx={{ fontSize: '12px', color: '#777777' }}>Available balance</Typography>
              <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>0.1209 NEAR</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
              <Typography sx={{ fontSize: '12px', color: '#777777' }}>8%Fee - avtive</Typography>
              <Typography sx={{ fontSize: '12px', color: '#FAD165' }}>≈$0.07 USD</Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }}>
        <Button sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Unstake Tokens</Typography>
        </Button>
      </Box>
    </WrapperBasePage>
  )
}

export default Unstake;
