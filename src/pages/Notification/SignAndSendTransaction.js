import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import queryString from 'query-string';
import * as nearAPI from 'near-api-js';
import styled from 'styled-components';
import _ from 'lodash';

import { formatNearAmount } from '../../utils';
import { nearService } from '../../core/near';
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
  box-sizing: border-box;
  padding: 20px;

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

const SignAndSendTransaction = () => {
  const location = useLocation();
  const appStore = useSelector((state) => state.app);
  const [params, setParams] = useState({});
  const [text, setText] = useState('');
  const [isSignin, setIsSignin] = useState(false);

  const { currentAccount } = appStore;

  useEffect(() => {
    console.log('window.location.search: ', location.search);
    const data = queryString.parse(location.search);
    setParams({ ...data, params: data.params ? JSON.parse(data.params) : '' });

    document.title = "Sign And Send Transaction";
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

    setText('Sign and sending, please do not clost this window.');
    setIsSignin(true);

    const { notificationId, contractId, methodName, params: args, gas, deposit, receiverId, amount } = params;
    console.log('params: ', params);
    try {
      const { secretKey, accountId } = currentAccount;
      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(secretKey);
      await keyStore.setKey('testnet', accountId, keyPair);
      const near = await connect({
        ...config,
        keyStore,
      })
      const account = await near.account(accountId);

      let res;
      if (contractId) {
        if (methodName === 'ft_transfer') {
          await nearService.setSigner({ secretKey, accountId });
          res = await nearService.transfer({ contractId, amount: `${args.amount}`, receiverId: args.receiver_id });
        } else {
          console.log('{ contractId, methodName, args, gas, attachedDeposit: deposit }: ', { contractId, methodName, args, gas, attachedDeposit: deposit });
          res = await account.functionCall({ contractId, methodName, args: args || {}, gas, attachedDeposit: deposit });
        }
      } else {
        res = await account.sendMoney(receiverId, amount);
      }
      console.log('res: ', res);

      chrome.runtime.sendMessage(extensionId, { type: 'sender-wallet-result', res, method: 'signAndSendTransaction', notificationId }, function (response) {
        console.log('signAndSendTransaction success ....: ', response);
        setIsSignin(false);
        window.close();
      })
    } catch (error) {
      console.log('signAndSendTransaction error: ', error);
      setText(error.message);
      chrome.runtime.sendMessage(extensionId, { type: 'sender-wallet-result', error: error.message, method: 'signAndSendTransaction', notificationId }, function (response) {
        console.log('signAndSendTransaction failed ....: ', response);
        setIsSignin(false);
      })
    }
  }

  return (
    <WrapperBasePage>
      <Typography align='center' sx={{ marginTop: '26px', fontSize: '26px', color: 'rgb(37, 118, 205)' }}>{params.url}</Typography>
      <Typography align='center' sx={{ marginTop: '10px', fontSize: '26px', color: 'white' }}>request to Send Transaction by using this account:</Typography>
      <Typography align='center' sx={{ marginTop: '10px', fontSize: '20px', color: 'rgb(37, 118, 205)' }}>{currentAccount.accountId}</Typography>

      <Box sx={{ marginTop: '15px' }}>
        {
          params.contractId && (
            <Box sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>Contract ID</Typography>
              <Typography align='right' sx={{ fontSize: '15px', color: 'white' }}>{params.contractId}</Typography>
            </Box>
          )
        }
        {
          params.methodName && (
            <Box sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>Method</Typography>
              <Typography align='right' sx={{ fontSize: '15px', color: 'white' }}>{params.methodName}</Typography>
            </Box>
          )
        }
        {
          params.receiverId && (
            <Box sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>Receiver</Typography>
              <Typography sx={{ fontSize: '15px', color: 'white' }}>{params.receiverId}</Typography>
            </Box>
          )
        }
        {
          params.amount && (
            <Box sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>Amount</Typography>
              <Typography align='right' sx={{ fontSize: '15px', color: 'white' }}>{formatNearAmount(params.amount)}</Typography>
            </Box>
          )
        }
        {
          params.params && (
            _.map(Object.keys(params.params), (key) => {
              return (
                <Box key={key} sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>{key}</Typography>
                  <Typography align='right' sx={{ fontSize: '15px', color: 'white' }}>{'' + params.params[key]}</Typography>
                </Box>
              )
            })
          )
        }
        {
          params.gas && (
            <Box sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>Gas</Typography>
              <Typography align='right' sx={{ fontSize: '15px', color: 'white' }}>{formatNearAmount(params.gas)} NEAR</Typography>
            </Box>
          )
        }
        {
          params.deposit && (
            <Box sx={{ display: 'flex', marginTop: '5px', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography align='left' sx={{ fontSize: '18px', color: 'rgb(37, 118, 205)' }}>Deposit</Typography>
              <Typography align='right' sx={{ fontSize: '15px', color: 'white' }}>{formatNearAmount(params.deposit)} NEAR</Typography>
            </Box>
          )
        }
      </Box>

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
    </WrapperBasePage>
  )
}

export default SignAndSendTransaction;