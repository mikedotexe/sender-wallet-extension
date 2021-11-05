let notificationId = 0;

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

const extensionId = 'ecfidfkflgnmfdgimhkhgpfhacgmahja';

window.walletAccount.requestSignIn = ({ contractId, methodNames = [] }, callback) => {
  chrome.runtime.sendMessage(extensionId, { type: 'fromPage', contractId, methodNames, notificationId, method: 'signin' }, function (response) {
    console.log('response: ', response);
    if (response === 'signin success') {
      callback();
    } else {
      console.log('User reject');
    }
  })
}