// import { persistStore } from 'redux-persist';
// import { store } from '../../Store';
import * as nearAPI from "near-api-js";

console.log('This is the background page.');
console.log('Put the background scripts here.');

const extension = require('extensionizer');

let store = {};

chrome.storage.local.get('persist:root', async function (c) {
  let value = c['persist:root'];
  value = value.replaceAll('\\', '');
  value = value.replaceAll('\"{', '{');
  value = value.replaceAll('}\"', '}');
  store = JSON.parse(value);
  const { currentAccount } = store.app;

  const connection = nearAPI.Connection.fromConfig({
    networkId: 'mainnet',
    provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.mainnet.near.org/' } },
    signer: {},
  })

  const account = new nearAPI.Account(connection, currentAccount.accountId);
  // window.near = account;
  // window.walletAccount = new nearAPI.WalletAccount(window.near);
  // window.accountId = window.walletAccount.getAccountId();

  // window.walletAccount.requestSignIn = (...data) => {
  //   console.log('requestSignIn data: ', data);
  //   openPopup();
  // }
});

const openPopup = async () => {
  const options = {
    url: 'popup.html#/notification',
    type: 'popup',
    width: 360,
    height: 620,
    left: 100,
    top: 100,
  }
  await extension.windows.create(options, (newWindow) => {
  })
}

// chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
//   console.log('background script get message 1');
//   console.log('request: ', request);
//   console.log('sender: ', sender);
//   console.log('sendResponse: ', sendResponse);

//   // persistStore(store, {}, () => {
//   //   console.log('store: ', store.getState());
//   // })
//   // console.log('url: ', chrome.runtime.getURL());

//   if (request === 'notification') {
//     console.log('open notification');
//     // const { screenX, screenY, outerWidth } = window
//     // const top = Math.max(screenY, 0)
//     // const left = Math.max(screenX + (outerWidth - 360), 0)
//     try {
//       const options = {
//         url: 'popup.html#/notification',
//         type: 'popup',
//         width: 360,
//         height: 620,
//         left: 100,
//         top: 100,
//       }
//       await extension.windows.create(options, (newWindow) => {
//       })

//       // chrome.notifications.create('NOTFICATION_ID', {
//       //   type: 'basic',
//       //   iconUrl: 'icon-128.png',
//       //   title: 'notification title',
//       //   message: 'notification message',
//       //   priority: 2
//       // }, function (context) {
//       //   console.log("Last error:", chrome.runtime.lastError);
//       //   alert(JSON.stringify(chrome.runtime.lastError));
//       // })
//     } catch (error) {
//       console.log('create notification error: ', error);
//     }
//   }
// })