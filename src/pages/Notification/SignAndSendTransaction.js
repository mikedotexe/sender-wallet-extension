import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import queryString from 'query-string';
import * as nearAPI from 'near-api-js';
import { key_pair } from 'near-api-js/lib/utils';
import { functionCall } from 'near-api-js/lib/transaction';
import { FT_TRANSFER_DEPOSIT, FT_TRANSFER_GAS } from '../../core/near';

const { connect, keyStores, transactions, KeyPair } = nearAPI;

const config = {
  network: 'testnet',
  networkId: 'testnet',
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

const SignAndSendTransaction = () => {
  const location = useLocation();
  const appStore = useSelector((state) => state.app);
  const [params, setParams] = useState({});
  const [text, setText] = useState('');

  const { currentAccount } = appStore;

  useEffect(() => {
    console.log('window.location.search: ', location.search);
    const data = queryString.parse(location.search);
    setParams(data);
  }, [])

  const rejectClicked = () => {
    console.log('rejectClicked');
    const { notificationId } = params;
    chrome.runtime.sendMessage(extensionId, { type: 'result', error: 'User reject', notificationId }, function (response) {
      console.log('notification ....: ', response);
      window.close();
    })
  }

  const confirmClicked = async () => {
    console.log('confirmClicked');

    setText('Sign and sending, please do not clost this window.');

    const { notificationId, contractId, methodName, params: args, gas, deposit, receiverId, amount } = params;
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
        res = await account.signAndSendTransaction({
          receiverId: contractId,
          actions: [
            functionCall(methodName, args, gas || FT_TRANSFER_GAS, deposit || FT_TRANSFER_DEPOSIT),
          ]
        });
      } else {
        res = await account.sendMoney({ receiverId, amount });
      }

      // const accessKey = transactions.functionCallAccessKey(contractId, methodNames || [], amount);
      // const pk = nearAPI.utils.KeyPair.fromRandom('ed25519').getPublicKey().toString();
      // const actions = [transactions.addKey(key_pair.PublicKey.from(pk), accessKey)];

      // const res = await account.signAndSendTransaction({
      //   receiverId: accountId,
      //   actions,
      // });

      setText(JSON.stringify(res));

      chrome.runtime.sendMessage(extensionId, { type: 'result', res, method: 'signAndSendTransaction', notificationId }, function (response) {
        console.log('signAndSendTransaction success ....: ', response);
        window.close();
      })
    } catch (error) {
      console.log('signAndSendTransaction error: ', error);
      setText(error.message);
      chrome.runtime.sendMessage(extensionId, { type: 'result', error: error.message, method: 'signAndSendTransaction', notificationId }, function (response) {
        console.log('signAndSendTransaction failed ....: ', response);
        window.close();
      })
    }
  }

  return (
    <Box>
      <Box>Sign And Send Transaction Page</Box>

      <Button onClick={rejectClicked}>Reject</Button>
      <Button onClick={confirmClicked}>Confirm</Button>

      <Box>{text}</Box>
    </Box>
  )
}

export default SignAndSendTransaction;