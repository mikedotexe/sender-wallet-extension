import React, { useState } from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';

import styled from 'styled-components';

import BasePage from '../../components/BasePage';
import BaseBox from '../../components/BaseBox';
import BottomDrawer from '../../components/BottomDrawer';
import Input from '../../components/Input';
import backIcon from '../../assets/img/back.png';
import closeIcon from '../../assets/img/drawer_close.png';
import successIcon from '../../assets/img/success.png';
import failIcon from '../../assets/img/fail.png';

const WrapperBasePage = styled(BasePage)`
  .search-input {
    flex: 1;
    margin-left: 11px;
  }
`

const Unstake = () => {
  const history = useHistory();
  const [confirmDrawerOpen, setConfirmDrawerOpen] = useState(false);
  const [resultDrawerOpen, setResultDrawerOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);

  const backClicked = () => {
    history.goBack();
  }

  const openConfirmDrawer = () => {
    setConfirmDrawerOpen(true);
  }

  const openResultDrawer = () => {
    setResultDrawerOpen(true);
  }

  const handleDrawerClosed = () => {
    setConfirmDrawerOpen(false);
    setResultDrawerOpen(false);
  }

  const active = true;

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

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }} onClick={openConfirmDrawer}>
        <Button sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Unstake Tokens</Typography>
        </Button>
      </Box>

      {/* Confirm Drawer */}
      <BottomDrawer
        open={confirmDrawerOpen}
        onClose={handleDrawerClosed}
      >
        <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleDrawerClosed}><img src={closeIcon} alt="close"></img></Button>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

          <Typography sx={{ fontSize: '14px', color: '#202046', marginTop: '16px' }}>You are unstaking</Typography>

          <Typography sx={{ fontSize: '36px', color: '#202046', marginTop: '10px', fontWeight: 'bold' }}>0.02005 NEAR</Typography>
          <Typography sx={{ fontSize: '14px', color: '#5E5E5E' }}>≈ $0.08 USD</Typography>

          <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '11px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

          <Box sx={{ display: 'flex', alignItems: 'center', width: '375px', marginTop: '35px' }}>
            <Avatar sx={{ marginLeft: '25px', marginRight: '15px', width: '32px', height: '32px' }}></Avatar>
            <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, marginRight: '25px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ fontSize: '14px', color: '#25272A' }}>cryptotribe.poolv1.near</Typography>
                <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>0.02005 NEAR</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alginItems: 'center', justifyContent: 'start' }}>
                  <Typography sx={{ fontSize: '14px', color: '#202046', fontWeight: 'bold' }}>0% Fee</Typography>
                  <Typography sx={{ fontSize: '14px', color: '#5E5E5E', marginLeft: '4px', marginRight: '5px' }}>-</Typography>
                  <Typography sx={{ fontSize: '14px', color: active ? '#588912' : '#CECECE', fontWeight: 'bold' }}>{active ? 'active' : 'inactive'}</Typography>
                </Box>
                <Typography sx={{ fontSize: '12px', color: '#5E5E5E', marginTop: '8px' }}>≈ $0.01 USD</Typography>
              </Box>
            </Box>
          </Box>

          <Typography sx={{ marginTop: '35px', marginBottom: '20px', marginLeft: '25px', marginRight: '25px', color: '#5E5E5E', fontSize: '14px' }} align='center'>Unstaked tokens will be made available pending a release period of ~52-65 (4 epochs)</Typography>

          {
            !pending ? (
              <Button
                sx={{
                  backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
                  '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
                }}
                onClick={openResultDrawer}
              >
                <Typography sx={{ fontSize: '16px', color: '#202046' }}>Confirm</Typography>
              </Button>
            ) : (
              <Button
                sx={{
                  backgroundColor: '#CCCCCC', borderRadius: '12px', width: '325px', marginTop: '12px', height: '48px',
                  '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
                }}
                disabled
              >
                <Typography sx={{ fontSize: '16px', color: 'white' }}>Unstaking...</Typography>
              </Button>
            )
          }

          <Button sx={{ width: '325px', height: '48px' }}>
            <Typography sx={{ fontSize: '14px', color: '#777777' }}>Cancel</Typography>
          </Button>
        </Box>
      </BottomDrawer>
    </WrapperBasePage>
  )
}

export default Unstake;
