import React, { useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';

import queryString from 'query-string';
import * as nearAPI from 'near-api-js';
import { key_pair } from 'near-api-js/lib/utils';

const { connect, keyStores, transactions, KeyPair } = nearAPI;

const config = {
  network: 'testnet',
  networkId: 'testnet',
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}

const Notification = () => {
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
    const str = JSON.stringify({ type: 'fromPage', error: 'User reject', notificationId });
    chrome.runtime.sendMessage(str);
    // window.close();
  }

  const confirmClicked = async () => {
    console.log('confirmClicked');

    setText('Signin');

    const { notificationId, contractId, methodNames } = params;
    try {

      const { secretKey, accountId } = currentAccount;
      const amount = nearAPI.utils.format.parseNearAmount('0.25');
      const keyPair = KeyPair.fromString(secretKey);
      const keyStore = new keyStores.InMemoryKeyStore();
      await keyStore.setKey('testnet', accountId, keyPair);
      const near = await connect({
        ...config,
        keyStore,
      })
      const account = await near.account(accountId);
      const accessKey = transactions.functionCallAccessKey(contractId, methodNames || [], amount);
      const pk = nearAPI.utils.KeyPair.fromRandom('ed25519').getPublicKey().toString();
      const actions = [transactions.addKey(key_pair.PublicKey.from(pk), accessKey)];

      const res = await account.signAndSendTransaction({
        receiverId: accountId,
        actions,
      });

      console.log('res: ', res);
      setText(JSON.stringify(res));

      // window.postMessage(JSON.stringify({ type: 'fromContent', res, notificationId }));

      const str = JSON.stringify({ type: 'fromPage', res, notificationId });
      chrome.runtime.sendMessage(str);
    } catch (error) {
      console.log('error: ', error);
      setText(error.message);
      const str = JSON.stringify({ type: 'fromPage', error: error.message, notificationId });
      chrome.runtime.sendMessage(str);
    } finally {
      // window.close();
    }
  }

  return (
    <Box>
      <Box>Notification page</Box>

      <Button onClick={rejectClicked}>Reject</Button>
      <Button onClick={confirmClicked}>Confirm</Button>

      <Box>{text}</Box>
    </Box>
  )
}

export default Notification;