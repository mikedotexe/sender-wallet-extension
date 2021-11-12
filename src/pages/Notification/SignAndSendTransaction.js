import React, { useEffect, useState, useMemo } from 'react';

import { useSelector } from 'react-redux';
import { useLocation, useHistory } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';

import queryString from 'query-string';
import * as nearAPI from 'near-api-js';
import styled from 'styled-components';
import _ from 'lodash';
import BN from 'bn.js';

import { fixedNearAmount, formatNearAmount } from '../../utils';
import { FT_TRANSFER_DEPOSIT, FT_TRANSFER_GAS } from '../../core/near';
import config from '../../config';

const {
  transactions: {
    functionCall
  },
  connect,
  keyStores,
  KeyPair
} = nearAPI;

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
`

const Item = ({ title, value, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        border: '1px solid #090909',
        width: '335px',
        height: '48px',
        borderRadius: '12px',
        paddingLeft: '12px',
        paddingRight: '12px',
        boxSizing: 'border-box',
        boxShadow: '0px 0px 1px rgba(219, 219, 219, 0.5)',
        marginTop: '10px',
      }}
      {...props}
    >
      <Typography sx={{ color: '#CCCCCC', fontSize: '12px', lineHeight: '17px' }}>{title}</Typography>
      <Typography sx={{ color: '#FAD165', fontSize: '14px', lineHeight: '20px' }}>{value}</Typography>
    </Box>
  )
}

const SignAndSendTransaction = () => {
  const location = useLocation();
  const history = useHistory();
  const appStore = useSelector((state) => state.app);
  const [params, setParams] = useState({});
  const [text, setText] = useState('');
  const [isSignin, setIsSignin] = useState(false);

  const { currentAccount } = appStore;

  useEffect(() => {
    console.log('window.location.search: ', location.search);
    const data = queryString.parse(location.search);
    const { notificationId } = data;
    const key = `notification-request-${notificationId}`;
    chrome.storage.local.get([key], function (result) {
      console.log('result: ', result);
      setParams(result[key]);
    })

    document.title = "Sign And Send Transaction";
  }, [])

  const balance = useMemo(() => {
    const { balance: { total } } = currentAccount;
    return fixedNearAmount(total);
  }, [currentAccount])

  const nearAmount = useMemo(() => {
    let amount = params.amount || '0';
    amount = new BN(amount);

    const { actions } = params;
    _.forEach(actions, (action) => {
      amount = action.deposit ? amount.add(new BN(action.deposit)) : amount.add(new BN(FT_TRANSFER_DEPOSIT));
    })
    return fixedNearAmount(amount);
  }, [params])

  const rejectClicked = () => {
    console.log('rejectClicked');
    const { notificationId } = params;
    chrome.runtime.sendMessage({ type: 'sender-wallet-result', error: 'User reject', notificationId }, function (response) {
      console.log('notification ....: ', response);
      window.close();
    })
  }

  const confirmClicked = async () => {
    console.log('confirmClicked');

    setText('Is signing, please do not clost this window.');
    setIsSignin(true);

    const { notificationId, actions, receiverId, method, amount } = params;
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

      if (method === 'sendMoney') {
        res = await account.sendMoney(receiverId, amount);
      } else {
        const functionCallActions = _.map(actions, (action) => {
          const { methodName, args, gas, deposit, msg } = action;
          return functionCall(methodName, args, gas || FT_TRANSFER_GAS, deposit || FT_TRANSFER_DEPOSIT, msg);
        })
        console.log('account: ', account);
        console.log('functionCallActions: ', functionCallActions);
        res = await account.signAndSendTransaction({
          receiverId,
          actions: functionCallActions,
        })
      }

      console.log('res: ', res);

      chrome.runtime.sendMessage({ type: 'sender-wallet-result', res, method, notificationId }, function (response) {
        console.log('signAndSendTransaction success ....: ', response);
        setIsSignin(false);
        window.close();
      })
    } catch (error) {
      console.log('signAndSendTransaction error: ', error);
      setText(error.message);
      chrome.runtime.sendMessage({ type: 'sender-wallet-result', error: error.message, method, notificationId }, function (response) {
        console.log('signAndSendTransaction failed ....: ', response);
        setIsSignin(false);
      })
    }
  }

  return (
    <WrapperBasePage>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Button disabled sx={{ height: '34px', backgroundColor: '#FFCE3E', borderRadius: '24px', marginTop: '31px' }}>
          <Typography sx={{ color: '#282828', paddingLeft: '15px', paddingRight: '15px' }}>Transfer is being requested</Typography>
        </Button>
      </Box>
      <Typography align='center' sx={{ marginTop: '8px', fontSize: '16px', color: 'white', lineHeight: '22px' }}>{params.url}</Typography>

      <Typography align='center' sx={{ marginTop: '30px', fontSize: '56px', color: 'white', lineHeight: '51px' }}>{nearAmount || 0} NEAR</Typography>

      <Box sx={{ marginTop: '20px', position: 'relative' }}>
        <Item title="Available Balance" value={balance}></Item>
        <Item title="To" value={params.receiverId || params.contractId}></Item>

        {
          !_.isEmpty(params.actions) && (
            <Button
              disabled={isSignin}
              onClick={() => {
                history.push(`transactionDetails${location.search}`)
              }}
              style={{ fontSize: '14px', lineHeight: '19px', color: '#FFCE3E', position: 'absolute', right: 0, bottom: '-30px' }}
            >More</Button>
          )
        }
      </Box>

      {
        (text) && (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '20px' }}>
            <Typography align='center' sx={{ fontSize: '13px', color: 'white', marginTop: '30px' }}>{text}</Typography>
          </Box>
        )
      }

      {
        isSignin ? (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: '50px' }}>
            <CircularProgress></CircularProgress>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: '80px' }}>
            <Button
              sx={{
                backgroundColor: '#333333',
                width: '150px',
                height: '48px',
                borderRadius: '12px',
                boxShadow: '0px 2px 4px rgba(30, 30, 30, 0.5)',
              }}
              onClick={rejectClicked}
            >
              <Typography sx={{ color: 'white', fontSize: '16px', lineHeight: '22px' }}>Reject</Typography>
            </Button>
            <Button
              sx={{
                backgroundColor: '#FFCE3E',
                width: '150px',
                height: '48px',
                borderRadius: '12px',
                boxShadow: '0px 2px 4px rgba(30, 30, 30, 0.5)',
              }}
              onClick={confirmClicked}
            >
              <Typography sx={{ color: '#202046', fontSize: '16px', lineHeight: '22px' }}>Allow</Typography>
            </Button>
          </Box>
        )
      }
    </WrapperBasePage>
  )
}

export default SignAndSendTransaction;