import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import styled from 'styled-components';

import BottomDrawer from '../../components/BottomDrawer';
import senderWalletLogo from '../../assets/img/Sender_logo_offical_version2-08.png';
import closeIcon from '../../assets/img/drawer_close.png';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  .sender-wallet-logo {
    width: 300px;
    height: 300px;
    align-self: center;
    margin-top: 50px;
    border-radius: 300px;
  }
`

const Startup = () => {
  const history = useHistory();

  const [open, setOpen] = useState(false);

  const createClicked = (network) => {
    if (network === 'mainnet') {
      window.open('https://wallet.near.org/create');
    } else {
      window.open('https://wallet.testnet.near.org/create');
    }
  }

  const importClicked = () => {
    history.push('/import');
  }

  const handleClose = () => {
    setOpen(false);
  }

  return (
    <WrapperBox>
      <img className="sender-wallet-logo" src={senderWalletLogo} alt="sender-wallet"></img>

      {/* <Dialog
        onClose={handleClose}
        open={open}
      >
        <DialogTitle>Please select the network</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem button onClick={() => createClicked('mainnet')}>
            <Typography>Mainnet</Typography>
          </ListItem>

          <ListItem button onClick={() => createClicked('testnet')}>
            <Typography>Testnet</Typography>
          </ListItem>
        </List>
      </Dialog> */}

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '40px', flexDirection: 'column' }}>
        <Button sx={{
          backgroundColor: '#FFCE3E', width: '315px', height: '48px', borderRadius: '12px',
          '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
        }} onClick={() => setOpen(true)}>
          <Typography sx={{ color: '#202046', fontSize: '16px', lineHeight: '18px' }}>Create a new account</Typography>
        </Button>

        <Button sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }} onClick={importClicked}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Import account</Typography>
        </Button>
      </Box>

      <BottomDrawer
        open={open}
        onClose={handleClose}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>
          <Typography sx={{ fontSize: '20px', color: '#202046', marginTop: '16px' }}>Please select the network</Typography>
          <Box sx={{ display: 'flex', paddingLeft: '20px', paddingRight: '20px', boxSizing: 'border-box', width: '100%', alignItems: 'center', justifyContent: 'space-around', marginTop: '30px', marginBottom: '30px' }}>
            <Button
              onClick={() => createClicked('mainnet')}
              sx={{
                width: '130px', height: '40px', backgroundColor: '#FFCE3E', borderRadius: '12px',
                '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
              }}
            >
              <Typography sx={{ color: 'black' }}>Mainnet</Typography>
            </Button>
            <Button
              onClick={() => createClicked('testnet')}
              sx={{
                width: '130px', height: '40px', backgroundColor: '#FFCE3E', borderRadius: '12px',
                '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
              }}
            >
              <Typography sx={{ color: 'black' }}>Testnet</Typography>
            </Button>
          </Box>
        </Box>

      </BottomDrawer>
    </WrapperBox>
  )
}

export default Startup;
