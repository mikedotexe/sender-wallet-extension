import React, { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styled from 'styled-components';
import queryString from 'query-string';

import StartupHeader from '../../components/StartupHeader';
import BaseBox from '../../components/BaseBox';
import Input from '../../components/Input';
import unlockIcon from '../../assets/img/unlock.png';
import passwordHash from '../../core/passwordHash';
import { setLockup } from '../../reducers/app';

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

const WrapperBox = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  .unlock {
    background: #1F1E1E;
    border: 10px solid rgba(54, 54, 54, 0.1);
    box-sizing: border-box;
    width: 118px;
    height: 118px;
    border-radius: 118px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .unlock-logo {
    width: 47px;
    height: 58px;
  }
`

const Unlock = () => {
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const appStore = useSelector((state) => state.app);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const { lockupPassword, salt } = appStore;

  const passwordChanged = (e) => {
    setPassword(e.target.value);
  }
  const unlockClicked = () => {
    const data = queryString.parse(location.search);
    console.log('data: ', data);
    const isCorrect = passwordHash.verify(password, salt, lockupPassword)
    if (isCorrect) {
      dispatch(setLockup(false));
      const { notificationId } = data;
      if (notificationId) {
        setTimeout(() => {
          chrome.runtime.sendMessage(extensionId, { ...data, type: 'sender-wallet-result', res: 'success', method: 'unlock' }, function (response) {
            window.close();
          })
        }, 500)
      } else {
        history.push('/home');
      }
    } else {
      setError('Passowrd is not correct');
    }
  }

  return (
    <WrapperBox>
      <StartupHeader />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '48px', flexDirection: 'column' }}>
        <Box className="unlock">
          <img className="unlock-logo" src={unlockIcon} alt="unlock"></img>
        </Box>

        <Box>
          <Typography sx={{ fontSize: '16px', color: 'white', marginTop: '49px' }}>Enter your Password</Typography>
          <BaseBox>
            <Input type="password" placeholder='' onChange={passwordChanged}></Input>
          </BaseBox>

          {
            error && (<Typography sx={{ fontSize: '12px', color: 'red', marginTop: '8px' }}>{error}</Typography>)
          }
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '74px' }}>
        <Button
          onClick={unlockClicked}
          sx={{
            backgroundColor: '#FFCE3E', width: '315px', height: '48px', borderRadius: '12px', marginTop: '15px',
            "&.MuiButtonBase-root:hover": {
              backgroundColor: '#FFB21E',
            }
          }}
        >
          <Typography sx={{ color: '#202046', fontSize: '16px', lineHeight: '18px' }}>Unlcok</Typography>
        </Button>
      </Box>
    </WrapperBox>
  )
}

export default Unlock;
