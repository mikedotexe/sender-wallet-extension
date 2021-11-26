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

import { fixedNearAmount } from '../../utils';
import { FT_TRANSFER_DEPOSIT, FT_TRANSFER_GAS } from '../../core/near';
import config, { network } from '../../config';

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
    const data = queryString.parse(location.search);
    const { notificationId } = data;
    const key = `notification-request-${notificationId}`;
    chrome.storage.local.get([key], function (result) {
      setParams(result[key]);
    })

    document.title = "Sign And Send Transaction";
  }, [])

  const toList = useMemo(() => {
    let to = [];
    const receiverId = (params.contractId || params.receiverId);
    if (receiverId) {
      to.push(receiverId);
    }

    _.forEach(params.transactions, (transaction) => {
      to.push(transaction.method || transaction.methodName || transaction.receiverId);
    })

    return _.uniq(to);
  }, [params.contractId, params.receiverId, params.transactions]);

  const balance = useMemo(() => {
    const { balance: { total } } = currentAccount;
    return fixedNearAmount(total);
  }, [currentAccount])

  const nearAmount = useMemo(() => {
    let amount = params.amount || '0';
    amount = new BN(amount);

    const { transactions } = params;
    _.forEach(transactions, (transaction) => {
      const { actions } = transaction;
      _.forEach(actions, (action) => {
        amount = action.deposit ? amount.add(new BN(action.deposit)) : amount.add(new BN(FT_TRANSFER_DEPOSIT));
      })
    })
    return fixedNearAmount(amount);
  }, [params])

  const rejectClicked = () => {
    const { notificationId } = params;
    chrome.runtime.sendMessage({ type: 'sender-wallet-result', error: 'User reject', notificationId }, function (response) {
      window.close();
    })
  }

  const confirmClicked = async () => {
    setText('Signing, please do not close this window.');
    setIsSignin(true);

    const { notificationId, method, amount } = params;
    try {
      const { secretKey, accountId } = currentAccount;
      const keyStore = new keyStores.InMemoryKeyStore();
      const keyPair = KeyPair.fromString(secretKey);
      await keyStore.setKey(network, accountId, keyPair);
      const near = await connect({
        ...config,
        keyStore,
      })
      const account = await near.account(accountId);

      let results = [];

      if (method === 'sendMoney') {
        const { receiverId } = params;
        const res = await account.sendMoney(receiverId, amount);
        results = [res];
      } else {
        let { transactions } = params;
        for (let { receiverId, actions, nonce, blockHash } of transactions) {
          const functionCallActions = _.map(actions, (action) => {
            const { methodName, args } = action;
            const gas = action.gas ? action.gas : FT_TRANSFER_GAS;
            const deposit = action.deposit ? action.deposit : FT_TRANSFER_DEPOSIT;
            return functionCall(methodName, args, gas, deposit);
          })
          let res;
          const recreateTransaction = account.deployMultisig || true;
          if (!recreateTransaction) {
            const signer = new nearAPI.InMemorySigner(keyStore);
            const [, signedTransaction] = await nearAPI.transactions.signTransaction(receiverId, nonce, functionCallActions, blockHash, signer, accountId, config.network);
            res = await near.connection.provider.sendTransaction(signedTransaction);
          } else {
            res = await account.signAndSendTransaction({ receiverId, actions: functionCallActions });
          }
          results.push(res);
        }
      }

      chrome.runtime.sendMessage({ type: 'sender-wallet-result', res: results, method, notificationId }, function (response) {
        setIsSignin(false);
        window.close();
      })
    } catch (error) {
      setText(error.message);
      chrome.runtime.sendMessage({ type: 'sender-wallet-result', error: error.message, method, notificationId }, function (response) {
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
        {
          _.map(toList, (to) => {
            return <Item title="To" value={to} key={to}></Item>
          })
        }

        {
          !_.isEmpty(params.transactions) && (
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
                "&.MuiButtonBase-root:hover": {
                  backgroundColor: '#333333',
                },
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
                "&.MuiButtonBase-root:hover": {
                  backgroundColor: '#FFCE3E',
                },
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