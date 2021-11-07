// import { printLine } from './modules/print';
import _ from 'lodash';
import * as nearAPI from 'near-api-js';
import { keyStores, KeyPair } from 'near-api-js';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

const config = {
  network: 'testnet',
  networkId: 'testnet',
  nodeUrl: "https://rpc.testnet.near.org",
  walletUrl: "https://wallet.testnet.near.org",
  helperUrl: "https://helper.testnet.near.org",
  explorerUrl: "https://explorer.testnet.near.org",
}

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

let extensionPersisStore = {};

const updatePersistStore = () => {
  chrome.storage.local.get('persist:root', function (result) {
    let value = result['persist:root'] || '{}';
    console.log('value: ', value);
    value = value.replaceAll('\\', '');
    value = value.replaceAll('\"{', '{');
    value = value.replaceAll('}\"', '}');

    extensionPersisStore = JSON.parse(value);
    console.log('extensionPersisStore: ', extensionPersisStore);
  })
}

updatePersistStore();

window.addEventListener('message', async function (event) {
  try {
    const data = JSON.parse(event.data);
    let request = data;
    const { notificationId } = data;

    if (_.isEmpty(extensionPersisStore) || (extensionPersisStore.app.isLockup || !extensionPersisStore.app.lockupPassword || _.isEmpty(extensionPersisStore.app.currentAccount))) {
      request = { method: 'toHomePage', notificationId, type: 'fromPage' };
      chrome.runtime.sendMessage(extensionId, request);
      return;
    }

    const { currentAccount, } = extensionPersisStore.app;
    const { accountId, publicKey } = currentAccount;
    if (data.type === 'fromPage' && data.method === 'signin') {

      const key = `${data.contractId}-${accountId}`;
      chrome.storage.local.get([key], function (result) {
        if (_.isEmpty(result)) {
          // Default to signin notification
          chrome.runtime.sendMessage(extensionId, request);
        } else {
          window.postMessage(JSON.stringify({ ...request, type: 'result', accountId, publicKey, accessKey: result[key], res: 'Get from storage' }));
        }
      })
    }

    if (data.type === 'fromPage' && data.method === 'signAndSendTransaction') {
      const { accessKey, contractId, params, methodName, gas, deposit } = data;
      if (accessKey) {
        const keyStore = new keyStores.InMemoryKeyStore();
        const keyPair = KeyPair.fromString(accessKey.secretKey);
        await keyStore.setKey('testnet', accountId, keyPair);
        const near = await nearAPI.connect(Object.assign({ deps: { keyStore } }, config));
        const account = await near.account(accountId);
        const res = await account.functionCall({ contractId, methodName, args: params, gas, attachedDeposit: deposit });
        window.postMessage(JSON.stringify({ ...request, type: 'result', res }));
      } else {
        // Default to signAndSendTransaction notification
        chrome.runtime.sendMessage(extensionId, request);
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
      // const oldPersistStore = { ...extensionPersisStore };
      updatePersistStore();
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
