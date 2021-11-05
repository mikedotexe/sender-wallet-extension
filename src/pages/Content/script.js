let notificationId = 0;
let callbacks = {};

// window.addEventListener("message", function (event) {
//   // console.log('script: ', event.data);
//   try {
//     console.log('script store: ', JSON.parse(event.data));
//     const store = JSON.parse(event.data);
//     if (store.type !== 'fromPage') return;
//     if (store.notificationId) {
//       callbacks[notificationId]();
//     }
//     if (store.type === 'requestSignIn') {
//       return;
//     }

//     const { near, walletAccount, accountId } = store;
//     // window.near = near;
//     // window.walletAccount = walletAccount;
//     // // window.accountId = accountId;

//     window.walletAccount.requestSignIn = ({ contractId, methods, callback }) => {
//       // const a = { data, type: 'requestSignIn' };
//       // window.postMessage(JSON.stringify(a));
//       window.postMessage(JSON.stringify({ type: 'fromPage', contractId, methods, notificationId }))
//       callbacks[notificationId] = callback;
//     }
//   } catch (error) {
//     console.log('script: ', event.data);
//   }
//   // console.log('content script get message: ', event);
//   // We only accept messages from ourselves
//   // chrome.runtime.sendMessage(event.data);
//   // chrome.tabs.sendMessage(event.data);
//   // console.log('sendMessage success');
// });

window.walletAccount.requestSignIn = ({ contractId, methodNames = [] }, callback) => {
  callbacks[notificationId] = callback;
  window.postMessage(JSON.stringify({ type: 'fromPage', contractId, methodNames, notificationId, method: 'signin' }));
  notificationId += 1;
}

// window.addEventListener("message", function (event) {
//   try {
//     console.log('event data: ', event.data);
//     const data = JSON.parse(event.data);
//     console.log('data: ', data);
//     if (data.type === 'fromPage' && !data.error && data.res) {
//       const { notificationId } = data;
//       callbacks[notificationId]();
//     } else {
//       alert(data.error);
//     }
//   } catch (error) {
//     console.log('error: ', error);
//   }
// })
