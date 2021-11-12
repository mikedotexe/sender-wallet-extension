// import { printLine } from './modules/print';
import _ from 'lodash';
import * as nearAPI from 'near-api-js';
import { keyStores, KeyPair } from 'near-api-js';
import { functionCall } from 'near-api-js/lib/transaction';

import config from '../../config';
import { FT_TRANSFER_DEPOSIT, FT_TRANSFER_GAS } from '../../core/near';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

let extensionPersisStore = {};

const updatePersistStore = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get('persist:root', function (result) {
      let value = result['persist:root'] || '{}';
      value = value.replaceAll('\\', '');
      value = value.replaceAll('\"{', '{');
      value = value.replaceAll('}\"', '}');

      extensionPersisStore = JSON.parse(value);
      resolve(extensionPersisStore);
    })
  })
}

updatePersistStore();

window.addEventListener('message', async function (event) {
  try {
    let request = event.data;

    if (!_.startsWith(request.type, 'sender-wallet')) {
      return;
    }

    const { notificationId } = request;

    if (_.isEmpty(extensionPersisStore) || (extensionPersisStore.app.isLockup || !extensionPersisStore.app.lockupPassword || _.isEmpty(extensionPersisStore.app.currentAccount))) {
      request = { ...request, method: 'toHomePage', notificationId, type: 'sender-wallet-fromPage' };
      chrome.runtime.sendMessage(request);
      return;
    }

    const { currentAccount } = extensionPersisStore.app;
    const { accountId, publicKey } = currentAccount;

    if (request.type === 'sender-wallet-fromPage' && request.method === 'init') {
      const key = `${request.contractId}-${accountId}`;
      chrome.storage.local.get([key], function (result) {
        console.log('result: ', result);
        if (!_.isEmpty(result) && result[key]) {
          window.postMessage({ ...request, type: 'sender-wallet-result', accountId, publicKey, accessKey: result[key], res: 'Get from storage' });
        } else {
          window.postMessage({ ...request, type: 'sender-wallet-result', res: 'empty' });
        }
      })
    }

    if (request.type === 'sender-wallet-fromPage' && request.method === 'signout') {
      const key = `${request.contractId}-${accountId}`;
      console.log('key: ', key);
      chrome.storage.local.set({ [key]: '' }, function (result) {
        window.postMessage({ ...request, type: 'sender-wallet-result', res: 'success' });
      })
    }

    if (request.type === 'sender-wallet-fromPage' && request.method === 'signin') {
      const key = `${request.contractId}-${accountId}`;
      chrome.storage.local.get([key], function (result) {
        if (_.isEmpty(result) || !result[key]) {
          // Default to signin notification
          chrome.runtime.sendMessage(request);
        } else {
          window.postMessage({ ...request, type: 'sender-wallet-result', accountId, publicKey, accessKey: result[key], res: 'Get from storage' });
        }
      })
    }

    if (request.type === 'sender-wallet-fromPage' && request.method === 'signAndSendTransaction') {
      const { accessKey, receiverId, actions } = request;
      if (accessKey) {
        const keyStore = new keyStores.InMemoryKeyStore();
        const keyPair = KeyPair.fromString(accessKey.secretKey);
        await keyStore.setKey('testnet', accountId, keyPair);
        const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, config));
        const account = await near.account(accountId);
        const functionCallActions = _.map(actions, (action) => {
          const { methodName, args, gas, deposit, msg } = action;
          return functionCall(methodName, args, gas || FT_TRANSFER_GAS, deposit || FT_TRANSFER_DEPOSIT, msg);
        })
        const res = await account.signAndSendTransaction({
          receiverId,
          actions: functionCallActions,
        })
        console.log('res: ', res);
        // const res = await account.functionCall({ contractId, methodName, args: params, gas, attachedDeposit: deposit });
        window.postMessage({ ...request, type: 'sender-wallet-result', res });
      } else {
        console.log('send message to bg');
        // Default to signAndSendTransaction notification
        chrome.runtime.sendMessage(request);
      }
    }

    if (request.type === 'sender-wallet-fromPage' && request.method === 'sendMoney') {
      const { accessKey, receiverId, amount } = request;
      if (accessKey) {
        const keyStore = new keyStores.InMemoryKeyStore();
        const keyPair = KeyPair.fromString(accessKey.secretKey);
        await keyStore.setKey('testnet', accountId, keyPair);
        const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, config));
        const account = await near.account(accountId);
        const res = await account.sendMoney({ receiverId, amount })
        console.log('res: ', res);
        // const res = await account.functionCall({ contractId, methodName, args: params, gas, attachedDeposit: deposit });
        window.postMessage({ ...request, type: 'sender-wallet-result', res });
      } else {
        console.log('send message to bg');
        // Default to signAndSendTransaction notification
        chrome.runtime.sendMessage(request);
      }
    }
  } catch (error) {
    console.log('error: ', error);
  }
})

// Get the user's operation result
chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (_.startsWith(key, 'notification-result-')) {
      window.postMessage(newValue);
    }

    if (key === 'persist:root') {
      const oldPersistStore = { ...extensionPersisStore };
      updatePersistStore().then((res) => {
        if (oldPersistStore.app.currentAccount.accountId !== res.app.currentAccount.accountId) {
          console.log('oldPersistStore.app.currentAccount.accountId: ', oldPersistStore.app.currentAccount.accountId);
          console.log('res.app.currentAccount.accountId: ', res.app.currentAccount.accountId);
          window.postMessage({ type: 'sender-wallet-fromContent', method: 'accountChanged', accountId: res.app.currentAccount.accountId });
        }
      });
    }
  }
});

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
injectScript(chrome.runtime.getURL('script.bundle.js'), 'body');
injectScript(chrome.runtime.getURL('nearApiJs.bundle.js'), 'body');
