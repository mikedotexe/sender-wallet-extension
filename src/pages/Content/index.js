// import { printLine } from './modules/print';
import _ from 'lodash';
import * as nearAPI from 'near-api-js';
import { keyStores, KeyPair } from 'near-api-js';

import config from '../../config';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

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
    const data = JSON.parse(event.data);
    let request = data;

    if (!_.startsWith(data.type, 'sender-wallet')) {
      return;
    }

    const { notificationId } = data;

    if (_.isEmpty(extensionPersisStore) || (extensionPersisStore.app.isLockup || !extensionPersisStore.app.lockupPassword || _.isEmpty(extensionPersisStore.app.currentAccount))) {
      request = { ...request, method: 'toHomePage', notificationId, type: 'sender-wallet-fromPage' };
      chrome.runtime.sendMessage(extensionId, request);
      return;
    }

    const { currentAccount } = extensionPersisStore.app;
    const { accountId, publicKey } = currentAccount;

    if (data.type === 'sender-wallet-fromPage' && data.method === 'init') {
      const key = `${data.contractId}-${accountId}`;
      chrome.storage.local.get([key], function (result) {
        console.log('result: ', result);
        if (!_.isEmpty(result) && result[key]) {
          window.postMessage(JSON.stringify({ ...request, type: 'sender-wallet-result', accountId, publicKey, accessKey: result[key], res: 'Get from storage' }));
        } else {
          window.postMessage(JSON.stringify({ ...request, type: 'sender-wallet-result', res: 'empty' }));
        }
      })
    }

    if (data.type === 'sender-wallet-fromPage' && data.method === 'signout') {
      const key = `${data.contractId}-${accountId}`;
      console.log('key: ', key);
      chrome.storage.local.set({ [key]: '' }, function (result) {
        window.postMessage(JSON.stringify({ ...request, type: 'sender-wallet-result', res: 'success' }));
      })
    }

    if (data.type === 'sender-wallet-fromPage' && data.method === 'signin') {
      const key = `${data.contractId}-${accountId}`;
      chrome.storage.local.get([key], function (result) {
        if (_.isEmpty(result) || !result[key]) {
          // Default to signin notification
          chrome.runtime.sendMessage(extensionId, request);
        } else {
          window.postMessage(JSON.stringify({ ...request, type: 'sender-wallet-result', accountId, publicKey, accessKey: result[key], res: 'Get from storage' }));
        }
      })
    }

    if (data.type === 'sender-wallet-fromPage' && data.method === 'signAndSendTransaction') {
      const { accessKey, contractId, params, methodName, gas, deposit } = data;
      if (accessKey) {
        const keyStore = new keyStores.InMemoryKeyStore();
        const keyPair = KeyPair.fromString(accessKey.secretKey);
        await keyStore.setKey('testnet', accountId, keyPair);
        const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, config));
        const account = await near.account(accountId);
        const res = await account.functionCall({ contractId, methodName, args: params, gas, attachedDeposit: deposit });
        window.postMessage(JSON.stringify({ ...request, type: 'sender-wallet-result', res }));
      } else {
        console.log('send message to bg');
        // Default to signAndSendTransaction notification
        chrome.runtime.sendMessage(extensionId, request);
      }
    }
  } catch (error) {
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
          window.postMessage(JSON.stringify({ type: 'sender-wallet-fromContent', method: 'accountChanged', accountId: res.app.currentAccount.accountId }));
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
// injectScript(chrome.runtime.getURL('nearApiJs.bundle.js'), 'body');
