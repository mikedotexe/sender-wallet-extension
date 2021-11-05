// import { persistStore } from 'redux-persist';
// import { store } from '../../Store';
// import * as nearAPI from "near-api-js";
// import { connect, transactions, WalletConnection } from "near-api-js";
// import { key_pair } from "near-api-js/lib/utils";
// var __importDefault = (this && this.__importDefault) || function (mod) {
//   return (mod && mod.__esModule) ? mod : { "default": mod };
// };
// const depd_1 = __importDefault(require("depd"));
// const PENDING_ACCESS_KEY_PREFIX = 'pending_key';

// console.log('This is the background page.');
// console.log('Put the background scripts here.');

const extension = require('extensionizer');
const queryString = require('query-string');


// const config = {
//   network: 'testnet',
//   networkId: 'testnet',
//   nodeUrl: "https://rpc.testnet.near.org",
//   walletUrl: "https://localhost:53426",
//   helperUrl: "https://helper.testnet.near.org",
//   explorerUrl: "https://explorer.testnet.near.org",
// }


// class WalletAccount extends WalletConnection {
//   constructor(near, appKeyPrefix) {
//     super(near, appKeyPrefix);
//     this.isSignedIn = false;
//     this._networkId = near.config.networkId;
//     this.accountId = '';
//     this._authData = { allKeys: [] };
//   }

//   requestSignIn = async ({ contractId, methods }) => {
//     // const keyStore = new nearAPI.keyStores.InMemoryKeyStore();
//     // const accessKey = nearAPI.utils.KeyPair.fromRandom('ed25519');
//     // const pk = accessKey.getPublicKey().toString();
//     // const actions = [transactions.addKey(key_pair.PublicKey.from(pk), accessKey)];
//     // await keyStore.setKey('testnet', accountId, keyPair);

//     // // const connection = nearAPI.Connection.fromConfig({
//     // //   networkId: 'testnet',
//     // //   provider: { type: 'JsonRpcProvider', args: { url: "https://rpc.testnet.near.org" } },
//     // //   signer: {},
//     // // });
//     // const near = await connect({
//     //   ...config,
//     //   keyStore,
//     // })


//     /**
//      * Set chrome localStorage: Notifications: [ [notification_id]: { ...params }, ... ]
//      */

//     const options = {
//       url: 'popup.html#/notification',
//       type: 'popup',
//       width: 360,
//       height: 620,
//       left: 100,
//       top: 100,
//     }
//     await extension.windows.create(options, (newWindow) => { })
//   }

//   // async requestSignIn(contractIdOrOptions = {}, title) {
//   //   let options;
//   //   if (typeof contractIdOrOptions === 'string') {
//   //     const deprecate = depd_1.default('requestSignIn(contractId, title)');
//   //     deprecate('`title` ignored; use `requestSignIn({ contractId, methodNames, successUrl, failureUrl })` instead');
//   //     options = { contractId: contractIdOrOptions };
//   //   }
//   //   else {
//   //     options = contractIdOrOptions;
//   //   }
//   //   // const currentUrl = new URL(window.location.href);
//   //   // const newUrl = new URL(this._walletBaseUrl + LOGIN_WALLET_URL_SUFFIX);
//   //   // newUrl.searchParams.set('success_url', options.successUrl || currentUrl.href);
//   //   // newUrl.searchParams.set('failure_url', options.failureUrl || currentUrl.href);
//   //   const actions = [transactions.addKey(key_pair.PublicKey.from(pk), accessKey)];
//   //   if (options.contractId) {
//   //     /* Throws exception if contract account does not exist */
//   //     const contractAccount = await this._near.account(options.contractId);
//   //     await contractAccount.state();
//   //     // newUrl.searchParams.set('contract_id', options.contractId);
//   //     let accessKey = nearAPI.utils.KeyPair.fromRandom('ed25519');
//   //     // newUrl.searchParams.set('public_key', accessKey.getPublicKey().toString());
//   //     await this._keyStore.setKey(this._networkId, PENDING_ACCESS_KEY_PREFIX + accessKey.getPublicKey(), accessKey);
//   //   }
//   //   if (options.methodNames) {
//   //     options.methodNames.forEach(methodName => {
//   //       // newUrl.searchParams.append('methodNames', methodName);
//   //     });
//   //   }
//   //   // window.location.assign(newUrl.toString());
//   // }
// }




// let store = {};

// chrome.storage.local.get('persist:root', async function (c) {
//   let value = c['persist:root'];
//   value = value.replaceAll('\\', '');
//   value = value.replaceAll('\"{', '{');
//   value = value.replaceAll('}\"', '}');
//   store = JSON.parse(value);
//   const { currentAccount } = store.app;

//   const connection = nearAPI.Connection.fromConfig({
//     networkId: 'testnet',
//     provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.testnet.near.org/' } },
//     signer: {},
//   })

//   const account = new nearAPI.Account(connection, currentAccount.accountId);
//   // window.near = account;
//   // window.walletAccount = new nearAPI.WalletAccount(window.near);
//   // window.accountId = window.walletAccount.getAccountId();

//   // window.walletAccount.requestSignIn = (...data) => {
//   //   console.log('requestSignIn data: ', data);
//   //   openPopup();
//   // }
// });

// const openPopup = async () => {
//   const options = {
//     url: 'popup.html#/notification',
//     type: 'popup',
//     width: 360,
//     height: 620,
//     left: 100,
//     top: 100,
//   }
//   await extension.windows.create(options, (newWindow) => {
//   })
// }

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

const contentScriptPort = chrome.runtime.connect(extensionId);


chrome.runtime.onMessage.addListener(async function (request, sender, sendRsponse) {
  console.log('bg request: ', request);
  console.log('bg sender: ', sender);
  console.log('bg sendRsponse: ', sendRsponse);

  try {
    const data = JSON.parse(request);
    const { contractId, methodNames, notificationId, method } = data;
    console.log('data: ', data);
    if (data.type === 'fromContent') {
      if (method === 'signin') {
        const stringified = queryString.stringify(data);
        console.log('stringified: ', stringified);
        const url = `popup.html#/notification?${stringified}`;
        console.log('url: ', url);
        const options = {
          url,
          type: 'popup',
          width: 360,
          height: 620,
          left: 100,
          top: 100,
        }
        await extension.windows.create(options, (newWindow) => {
          console.log('newWindow: ', newWindow);
        })
      }
    } else if (data.type === 'fromPage') {
      if (data.error) {
        console.log('from page error: ', data.error);
        // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        //   console.log('tabs: ', tabs);
        //   chrome.tabs.sendMessage(tabs[0].id, { type: 'result', error: data.error, notificationId }, function (response) {
        //     console.log(response);
        //   });
        // });


        contentScriptPort.postMessage({ type: 'result', error: data.error, notificationId });
      } else {
        console.log('from page success');
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          console.log('tabs: ', tabs);
          chrome.tabs.sendMessage(tabs[0].id, { type: 'result', res: data.res, notificationId }, function (response) {
            console.log(response);
          });
        });
      }
    }
  } catch (error) {
    console.log('bg error: ', error);
  }
})


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