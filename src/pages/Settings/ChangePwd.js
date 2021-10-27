import React, { useState, useEffect, useMemo } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import styled from 'styled-components';

import BaseBox from '../../components/BaseBox';
import BasePage from '../../components/BasePage';
import Input from '../../components/Input';
import { APP_SET_PASSWORD } from '../../actions/app';
import backIcon from '../../assets/img/back.png';
import passwordHash from '../../core/passwordHash';

const WrapperBasePage = styled(BasePage)`
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

const ChangePwd = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const { lockupPassword, salt } = appStore;

  const valid = useMemo(() => {
    return password && password === confirmPassword;
  }, [password, confirmPassword])

  const backClicked = () => {
    history.goBack();
  }

  const oldPasswordChanged = (e) => {
    setOldPassword(e.target.value);
  }

  const passwordChanged = (e) => {
    setPassword(e.target.value);
  }

  const confirmPasswordChanged = (e) => {
    setConfirmPassword(e.target.value);
  }

  const confirmClicked = () => {
    const isCorrect = passwordHash.verify(oldPassword, salt, lockupPassword);
    if (isCorrect) {
      dispatch({ type: APP_SET_PASSWORD, password });
    } else {
      setError('Current password is not correct');
    }
  }

  return (
    <WrapperBasePage>
      <Box sx={{ paddingTop: '26px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        <Button sx={{ position: 'absolute', left: '9px', top: '26px' }} onClick={backClicked}>
          <img src={backIcon} alt='back'></img>
        </Button>

        <Typography sx={{ fontSize: '16px', color: '#777777' }}>Change Password</Typography>
      </Box>

      <Box sx={{ marginLeft: '30px', marginRight: '30px', marginTop: '30px' }}>
        <Typography sx={{ fontSize: '16px', color: 'white' }}>Current Password</Typography>
        <BaseBox>
          <Input type="password" placeholder='' onChange={oldPasswordChanged}></Input>
        </BaseBox>

        {
          error && (<Typography sx={{ fontSize: '12px', color: 'red', marginTop: '8px' }}>{error}</Typography>)
        }

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '25px' }}>New Password</Typography>
        <BaseBox>
          <Input type="password" placeholder='' onChange={passwordChanged}></Input>
        </BaseBox>

        <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '25px' }}>Confirm new Password</Typography>
        <BaseBox>
          <Input type="password" placeholder='' onChange={confirmPasswordChanged}></Input>
        </BaseBox>

        {
          !valid && password && confirmPassword && (<Typography sx={{ fontSize: '12px', color: 'red', marginTop: '8px' }}>Two new passowd is not same</Typography>)
        }

      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }}>
        <Button disabled={!valid} onClick={confirmClicked} sx={{ backgroundColor: '#333333', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px' }}>
          <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '18px' }}>Confirm</Typography>
        </Button>
      </Box>
    </WrapperBasePage>
  )
}

export default ChangePwd;
