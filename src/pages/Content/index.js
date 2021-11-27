// import { printLine } from './modules/print';
import _ from 'lodash';

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

    const { currentAccount, currentRpc } = extensionPersisStore.app;
    const { accountId, publicKey, network } = currentAccount;

    if (request.type === 'sender-wallet-fromPage' && request.method === 'init') {
      const key = `${request.contractId}-${accountId}`;
      chrome.storage.local.get([key], function (result) {
        if (!_.isEmpty(result) && result[key]) {
          window.postMessage({ ...request, type: 'sender-wallet-result', accountId, publicKey, accessKey: result[key], res: 'Get from storage' });
        } else {
          window.postMessage({ ...request, type: 'sender-wallet-result', res: 'empty' });
        }
      })
    }

    if (request.type === 'sender-wallet-fromPage' && request.method === 'signout') {
      const key = `${request.contractId}-${accountId}`;
      chrome.storage.local.set({ [key]: '' }, function (result) {
        window.postMessage({ ...request, type: 'sender-wallet-result', res: 'success' });
      })
    }

    if (request.type === 'sender-wallet-fromPage' && request.method === 'getRpc') {
      window.postMessage({ ...request, type: 'sender-wallet-result', network, nodeUrl: currentRpc[network].nodeUrl });
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

    if (request.type === 'sender-wallet-fromPage' && (request.method === 'signAndSendTransaction' || request.method === 'requestSignTransactions' || request.method === 'sendMoney')) {
      // Default to signAndSendTransaction notification
      chrome.runtime.sendMessage(request);
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
