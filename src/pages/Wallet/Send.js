import React from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';

import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import backIcon from '../../assets/img/back.png';
import arrowIcon from '../../assets/img/arrow.png'

const WrapperBasePage = styled(BasePage)`
  .amount-input {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 20px;
    font-size: 48px;
  }

  .max-button {
    background: rgba(255, 213, 104, 0.17);
    mix-blend-mode: normal;
    border-radius: 8.5px;
    height: 17px;
    margin-top: 11px;
  }

  .accountId-input {
    width: 100%;
  }

  .send-button {
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    margin-top: 25px;
    margin-bottom: 30px;
    width: 325px;
    height: 48px;
  }
`

const Send = () => {
  const history = useHistory();

  const backClicked = () => {
    history.goBack();
  }

  const selectTokensClicked = () => {
    history.push('/tokens');
  }

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Send</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <Input type="text" className='amount-input' placeholder='0'></Input>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>$0</Typography>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Available to Send</Typography>
        <Typography sx={{ fontSize: '16px', color: '#777777' }}>0.1209 NEAR ≈ $1.04 USD</Typography>

        <Button className="max-button"><Typography sx={{ fontSize: '12px', color: '#FAD165' }}>Use Max</Typography></Button>
      </Box>

      <Box sx={{ marginTop: '23px', marginLeft: '25px', marginRight: '25px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>Send to</Typography>

        <BaseBox className="info-view">
          <Input type="text" className='accountId-input' placeholder='Account ID'></Input>
        </BaseBox>

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '15px' }}>Select Assets</Typography>

        <BaseBox sx={{ paddingTop: '8px', paddingLeft: '15px', paddingRight: '15px', paddingBottom: '8px' }}>
          <Button sx={{ width: '100%', justifyContent: 'space-between' }} onClick={selectTokensClicked}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Avatar></Avatar>
              <Typography sx={{ fontSize: '14px', color: 'white', marginLeft: '10px', lineHeight: '24px', fontWeight: 'bold' }}>NEAR</Typography>
            </Box>
            <img src={arrowIcon} alt='arrow'></img>
          </Button>
        </BaseBox>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button className="send-button">
          <Typography sx={{ fontSize: '16px', color: 'white' }}>Send</Typography>
        </Button>
      </Box>
    </WrapperBasePage>
  )
}

export default Send;
