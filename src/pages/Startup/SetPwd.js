import React from 'react';

import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';

import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import StartupHeader from '../../components/StartupHeader';
import backIcon from '../../assets/img/back.png';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  textarea {
    width: 100%;
    height: 146px;
    margin-top: 8px;
    background: #1E1E1E;
    border: 1px solid #090909;
    box-sizing: border-box;
    box-shadow: 0px 0px 1px rgba(219, 219, 219, 0.5);
    border-radius: 12px;
    padding: 10px;
    color: white;
  }
`

const SetPwd = () => {
  const history = useHistory();

  const backClicked = () => {
    history.goBack();
  }

  return (
    <WrapperBox>
      <StartupHeader />

      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Set new Password</Typography>
      </Box>

      <Box sx={{ marginLeft: '30px', marginRight: '30px', marginTop: '72px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>New Password</Typography>
        <BaseBox>
          <Input type="text" placeholder=''></Input>
        </BaseBox>

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '25px' }}>Confirm new Password</Typography>
        <BaseBox>
          <Input type="text" placeholder=''></Input>
        </BaseBox>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }}>
        <Button sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Import account</Typography>
        </Button>
      </Box>
    </WrapperBox>
  )
}

export default SetPwd;
