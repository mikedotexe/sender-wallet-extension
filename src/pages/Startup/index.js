import React, { useEffect } from 'react';

import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import _ from 'lodash';

import styled from 'styled-components';

import StartupHeader from '../../components/StartupHeader';
import startupIcon from '../../assets/img/startup.png';

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
  const appStore = useSelector((state) => state.app);

  useEffect(() => {
    if (!_.isEmpty(appStore.accounts)) {
      history.push('/home');
    }
  }, [])

  const createClicked = () => {
    window.open('https://wallet.near.org/create');
  }

  const importClicked = () => {
    history.push('/import');
  }

  return (
    <WrapperBox>
      <StartupHeader />

      <img src={startupIcon} alt="startup"></img>

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
