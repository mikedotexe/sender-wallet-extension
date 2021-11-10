import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import queryString from 'query-string';
import * as nearAPI from 'near-api-js';
import { key_pair } from 'near-api-js/lib/utils';
import styled from 'styled-components';

import config from '../../config';

const { connect, keyStores, KeyPair } = nearAPI;

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

const WrapperBasePage = styled(Box)`
  display: flex;
  flex-direction: column;
  background-color: rgb(29, 29, 29);
  width: 375px;
  height: 600px;
  position: relative;
  overflow: auto;
  margin-bottom: 60px;

  .action-button {
    width: 144px;
    height: 48px;
    background: #333333;
    box-shadow: 0px 2px 4px rgba(30, 30, 30, 0.5);
    border-radius: 12px;
    color: white;
    font-size: 16px;
  }
`

const Signin = () => {
  const location = useLocation();
  const appStore = useSelector((state) => state.app);
  const [params, setParams] = useState({});
  const [text, setText] = useState('');
  const [isSignin, setIsSignin] = useState(false);

  const { currentAccount } = appStore;

  useEffect(() => {
    console.log('window.location.search: ', location.search);
    const data = queryString.parse(location.search);
    setParams(data);

    document.title = "Request Signin";
  }, [])

  const rejectClicked = () => {
    console.log('rejectClicked');
    const { notificationId } = params;
    chrome.runtime.sendMessage(extensionId, { type: 'sender-wallet-result', error: 'User reject', notificationId }, function (response) {
      console.log('notification ....: ', response);
      window.close();
    })
  }

  const confirmClicked = async () => {
    console.log('confirmClicked');

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

      chrome.runtime.sendMessage(extensionId, { type: 'sender-wallet-result', res, method: 'signin', notificationId, ...params }, function (response) {
        console.log('signin success ....: ', response);
        setIsSignin(false);
        window.close();
      })
    } catch (error) {
      console.log('error: ', error);
      setText(error.message);
      chrome.runtime.sendMessage(extensionId, { type: 'sender-wallet-result', error: error.message, method: 'signin', notificationId }, function (response) {
        console.log('signin failed ....: ', response);
        setIsSignin(false);
      })
    }
  }

  return (
    <WrapperBasePage>
      <Typography align='center' sx={{ marginTop: '26px', fontSize: '26px', color: 'white' }}>Connecting with:</Typography>
      <Typography align='center' sx={{ marginTop: '10px', fontSize: '20px', color: 'rgb(37, 118, 205)' }}>{currentAccount.accountId}</Typography>

      <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', margin: '10px' }}>
        <text style={{ textAlign: 'center', lineHeight: '30px', fontSize: '15px', color: 'white' }}>Only connect to sites that you trust. Once connected, <text style={{ color: 'rgb(37, 118, 205)' }}>{params.url || 'localhost'}</text> will have limited permissions:</text>
      </Box>
      <Typography align='center' sx={{ fontSize: '13px', color: 'white', marginTop: '30px' }}>1. View the address of your permited account</Typography>
      <Typography align='center' sx={{ fontSize: '13px', color: 'white', marginTop: '10px' }}>2. View the balance of your permited account</Typography>

      {
        isSignin ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '40px' }}>
            <CircularProgress></CircularProgress>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '40px' }}>
            <Button className="action-button" onClick={rejectClicked}>Reject</Button>
            <Button className="action-button" onClick={confirmClicked}>Confirm</Button>
          </Box>
        )
      }

      {
        (text) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '40px' }}>
            <Typography align='center' sx={{ fontSize: '13px', color: 'white', marginTop: '30px' }}>{text}</Typography>
          </Box>
        )
      }
    </WrapperBasePage >
  )
}

export default Signin;