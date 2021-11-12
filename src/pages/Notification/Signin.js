import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import queryString from 'query-string';
import * as nearAPI from 'near-api-js';
import { key_pair } from 'near-api-js/lib/utils';
import styled from 'styled-components';

import config from '../../config';
import vectorIcon from '../../assets/img/vector.png';
import selectIcon from '../../assets/img/select.png';
import notSelectIcon from '../../assets/img/not_select.png';

const { connect, keyStores, KeyPair } = nearAPI;

const WrapperBasePage = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;
`

const Signin = () => {
  const location = useLocation();
  const appStore = useSelector((state) => state.app);
  const [params, setParams] = useState({});
  const [text, setText] = useState('');
  const [isSignin, setIsSignin] = useState(false);

  const { currentAccount } = appStore;

  useEffect(() => {
    const data = queryString.parse(location.search);
    const { notificationId } = data;

    const key = `notification-request-${notificationId}`;
    chrome.storage.local.get([key], function (result) {
      setParams(result[key]);
    })

    document.title = "Request Signin";
  }, [])

  const rejectClicked = () => {
    console.log('rejectClicked: ', params);
    const { notificationId } = params;
    chrome.runtime.sendMessage({ type: 'sender-wallet-result', error: 'User reject', notificationId }, function (response) {
      console.log('notification ....: ', response);
      window.close();
    })
  }

  const confirmClicked = async () => {
    setText('Is connecting, please do not close this window.');
    setIsSignin(true);

    const { notificationId, contractId, methodNames } = params;
    try {
      const { secretKey, accountId, publicKey } = currentAccount;
      const keyPair = KeyPair.fromString(secretKey);
      const keyStore = new keyStores.InMemoryKeyStore();
      await keyStore.setKey('testnet', accountId, keyPair);
      const near = await connect({
        ...config,
        keyStore,
      })
      const account = await near.account(accountId);
      const accessKeyPair = nearAPI.utils.KeyPair.fromRandom('ed25519');
      const pk = accessKeyPair.getPublicKey().toString();
      const res = await account.addKey(key_pair.PublicKey.from(pk), contractId, methodNames);
      const params = {
        accountId,
        publicKey,
        accessKey: accessKeyPair,
        contractId,
      };

      chrome.runtime.sendMessage({ type: 'sender-wallet-result', res, method: 'signin', notificationId, ...params }, function (response) {
        console.log('signin success ....: ', response);
        setIsSignin(false);
        window.close();
      })
    } catch (error) {
      console.log('error: ', error);
      setText(error.message);
      chrome.runtime.sendMessage({ type: 'sender-wallet-result', error: error.message, method: 'signin', notificationId }, function (response) {
        console.log('signin failed ....: ', response);
        setIsSignin(false);
      })
    }
  }

  return (
    <WrapperBasePage>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button disabled sx={{ height: '34px', backgroundColor: '#FFCE3E', borderRadius: '24px', marginTop: '31px' }}>
          <Typography sx={{ color: '#282828', paddingLeft: '15px', paddingRight: '15px' }}>Connecting...</Typography>
        </Button>
      </Box>
      <Typography align='center' sx={{ marginTop: '8px', fontSize: '16px', color: 'white', lineHeight: '22px' }}>{currentAccount.accountId}</Typography>

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', paddingLeft: '90px', paddingRight: '90px', boxSizing: 'border-box', marginTop: '25px' }}>
        <Avatar></Avatar>
        <img src={vectorIcon} alt="vector"></img>
        <Avatar></Avatar>
      </Box>


      <Box sx={{ backgroundColor: '#FAD1650D', margin: '25px', padding: '10px', borderRadius: '12px' }}>
        <Typography sx={{ fontSize: '14px', color: '#FAD165', lineHeight: '20px' }}>Please connect your trusted applications, once connected, localhost will have restricted access.</Typography>
      </Box>

      <Box sx={{ margin: '25px', display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ backgroundColor: '#312F29', borderRadius: '28px', width: '28px', height: '28px', position: 'relative' }}>
            <img style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} src={selectIcon} alt="select"></img>
          </Box>
          <Typography sx={{ width: '285px', marginLeft: '12px', fontSize: '11px', lineHeight: '15px', color: '#FAD165' }}>Check the address of the account you are connected</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <Box sx={{ backgroundColor: '#312F29', borderRadius: '28px', width: '28px', height: '28px', position: 'relative' }}>
            <img style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} src={selectIcon} alt="select"></img>
          </Box>
          <Typography sx={{ width: '285px', marginLeft: '12px', fontSize: '11px', lineHeight: '15px', color: '#FAD165' }}>Check the balance of your connected account</Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '15px' }}>
          <Box sx={{ backgroundColor: '#312F29', borderRadius: '28px', width: '28px', height: '28px', position: 'relative' }}>
            <img style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} src={notSelectIcon} alt="notSelect"></img>
          </Box>
          <Typography sx={{ width: '285px', marginLeft: '12px', fontSize: '11px', lineHeight: '15px', color: '#5F5F5F' }}>The app does not have permission to transfer NEAR passes</Typography>
        </Box>
      </Box>

      {
        (text) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '40px' }}>
            <Typography align='center' sx={{ fontSize: '13px', color: 'white', marginTop: '30px' }}>{text}</Typography>
          </Box>
        )
      }

      {
        isSignin ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '10px' }}>
            <CircularProgress></CircularProgress>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
            <Button sx={{ width: '315px', height: '48px', backgroundColor: '#FFCE3E', borderRadius: '12px' }} onClick={confirmClicked}>
              <Typography sx={{ color: '#282828', fontSize: '16px', lineHeight: '23px' }}>Connect</Typography>
            </Button>
            <Button sx={{ width: '315px', height: '30px', marginTop: '10px' }} onClick={rejectClicked}>{
              <Typography sx={{ color: '#777777', fontSize: '14px', lineHeight: '20px' }}>Cancel</Typography>
            }</Button>
          </Box>
        )
      }
    </WrapperBasePage >
  )
}

export default Signin;