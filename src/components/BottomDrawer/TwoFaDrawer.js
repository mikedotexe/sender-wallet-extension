import React, { useState, useCallback, useEffect, useMemo } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';

import BottomDrawer from './index';
import BaseBox from '../BaseBox';
import Input from '../Input';
import closeIcon from '../../assets/img/drawer_close.png';
import { setTwoFaDrawer } from '../../reducers/temp';
import NearService from '../../core/near';
import { APP_REMOVE_PENDING_REQUEST } from '../../actions/app';

const TwoFaDrawer = () => {
  const dispatch = useDispatch();

  const tempStore = useSelector((state) => state.temp);
  const appStore = useSelector((state) => state.app);

  const [resendCountDown, setResendCountDown] = useState(0);

  const { currentAccount, currentRpc } = appStore;
  const { secretKey, accountId, network } = currentAccount;

  const nearService = useMemo(() => {
    return new NearService({ config: currentRpc[network] });
  }, [currentRpc, network])


  const { display, rejecter, resolver, method, loading, error, pendingRequest } = tempStore.twoFaDrawer;

  const [code, setCode] = useState('');

  useEffect(() => {
    if (resendCountDown - 1 >= 0) {
      setTimeout(() => {
        setResendCountDown(resendCountDown - 1);
      }, 1000);
    }
  }, [resendCountDown])

  const codeChanged = useCallback((e) => {
    setCode(e.target.value);
  }, [])

  const handleClose = () => {
    try {
      rejecter(new Error('User reject'));
    } catch (error) {
      console.log('handle close error: ', error);
      dispatch({ type: APP_REMOVE_PENDING_REQUEST });
    } finally {
      dispatch(setTwoFaDrawer({ display: false, loading: false }));
    }
  }

  const handleVerify = () => {
    dispatch(setTwoFaDrawer({ loading: true }));

    setTimeout(async () => {
      if (resolver) {
        resolver(code);
      } else {
        await nearService.setSigner({ secretKey, accountId });
        await nearService.verifyCodeWithRequest(code, pendingRequest);
      }
    }, 500);
  }

  const handleResendCode = async () => {
    await nearService.setSigner({ secretKey, accountId });
    const res = await nearService.twoFactorMethod('sendCode', []);
    if (res) {
      setResendCountDown(60);
    }
  }

  return (
    <BottomDrawer
      open={display}
      onClose={handleClose}
    >
      <Button sx={{ position: 'absolute', right: 0, top: 0 }} onClick={handleClose}><img src={closeIcon} alt="close"></img></Button>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', paddingLeft: '16px', paddingRight: '16px', boxSizing: 'border-box' }}>
        <Divider sx={{ backgroundColor: '#9CA2AA', width: '36px', height: '4px', borderRadius: '100px', marginTop: '11px' }}></Divider>

        <Typography align='center' sx={{ color: '#202046', fontSize: '16px', fontWeight: 'bold', marginTop: '40px' }}>Two-Factor Authentication</Typography>
        <Typography align='center' sx={{ color: '#5E5E5E', fontSize: '14px', marginTop: '9px' }}>A set of 6-digit verification code has been sent to</Typography>
        <Typography align='center' sx={{ color: '#588912', fontSize: '16px', fontWeight: 'bold', marginTop: '20px' }}>{method.detail || 'emailaddress@gmail.com'}</Typography>

        <Divider sx={{ width: '100%', height: '1px', borderRadius: '4px', marginTop: '26px', boxSizing: 'border-box', border: '1px solid #E9EBEF' }}></Divider>

        <Typography sx={{ color: '#000000', fontSize: '14px', marginTop: '25px', marginBottom: '26px' }}>Enter your 6-digit verification code</Typography>

        <BaseBox sx={{ backgroundColor: '#F1F2F6', borderWidth: 0 }}>
          <Input maxLength={6} style={{ color: '#5E5E5E' }} placeholder='' onChange={codeChanged}></Input>
        </BaseBox>

        {(error && !loading) && (<Typography align='center' sx={{ color: 'red', fontSize: '14px', marginTop: '10px' }}>{error}</Typography>)}

        <Typography sx={{ color: '#5E5E5E', fontSize: '14px', marginTop: '25px' }}>
          I didn???t receive code.
          {
            (resendCountDown > 0) ? (
              <Button disabled sx={{ fontWeight: 'bold', color: '#5E5E5E' }}>{resendCountDown} s</Button>
            ) : (
              <Button onClick={handleResendCode} sx={{ fontWeight: 'bold', color: '#5E5E5E' }}>Resend Code</Button>
            )
          }
        </Typography>

        <Button
          disabled={code.length !== 6 || loading}
          sx={{
            backgroundColor: '#FFCE3E', borderRadius: '12px', width: '325px', marginTop: '16px', height: '48px',
            '&.MuiButton-root:hover': { backgroundColor: '#FFB21E' }
          }}
          onClick={handleVerify}
        >
          <Typography sx={{ fontSize: '16px', color: '#202046' }}>{loading ? 'Verifying...' : 'Validation'}</Typography>
        </Button>

        <Button sx={{ width: '325px', height: '48px' }} onClick={handleClose}>
          <Typography sx={{ fontSize: '14px', color: '#777777' }}>Cancel</Typography>
        </Button>
      </Box>
    </BottomDrawer>
  )
}

export default TwoFaDrawer;

