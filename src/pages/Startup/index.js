import React from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import senderWalletLogo from '../../assets/img/sender-wallet-logo.png';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;
`

const Startup = () => {
  const history = useHistory();

  const createClicked = () => {
    window.open('https://wallet.near.org/create');
  }

  const importClicked = () => {
    history.push('/import');
  }

  return (
    <WrapperBox>
      <img className="sender-wallet-logo" src={senderWalletLogo} alt="sender-wallet"></img>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '40px', flexDirection: 'column' }}>
        <Button sx={{ backgroundColor: '#FFCE3E', width: '315px', height: '48px', borderRadius: '12px' }} onClick={createClicked}>
          <Typography sx={{ color: '#202046', fontSize: '16px', lineHeight: '18px' }}>Create new account</Typography>
        </Button>

        <Button sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }} onClick={importClicked}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Import account</Typography>
        </Button>
      </Box>
    </WrapperBox>
  )
}

export default Startup;
