// import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

// printLine("Using the 'printLine' function from the Print Module");

// chrome.storage.local.get('persist:root', async function (c) {
//   let value = c['persist:root'];
//   value = value.replaceAll('\\', '');
//   value = value.replaceAll('\"{', '{');
//   value = value.replaceAll('}\"', '}');
//   store = JSON.parse(value);
//   console.log('content store: ', store);
//   currentAccount = store.app.currentAccount;
// });

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
injectScript(chrome.runtime.getURL('script.bundle.js'), 'body');


// let store;
// chrome.storage.local.get('persist:root', async function (c) {
//   let value = c['persist:root'];
//   value = value.replaceAll('\\', '');
//   value = value.replaceAll('\"{', '{');
//   value = value.replaceAll('}\"', '}');
//   store = JSON.parse(value);
//   console.log('content store: ', store);
//   const { currentAccount } = store.app;
//   const { accountId } = currentAccount;
//   console.log('currentAccount: ', currentAccount);

//   // const connection = nearAPI.Connection.fromConfig({
//   //   networkId: 'mainnet',
//   //   provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.mainnet.near.org/' } },
//   //   signer: {},
//   // })

//   // const account = new nearAPI.Account(connection, currentAccount.accountId);
//   // console.log('account: ', account);

//   const config = {
//     network: 'mainnet',
//     networkId: 'mainnet',
//     nodeUrl: "https://rpc.mainnet.near.org",
//     walletUrl: "https://wallet.mainnet.near.org",
//     helperUrl: "https://helper.mainnet.near.org",
//     explorerUrl: "https://explorer.mainnet.near.org",
//   }

//   const near = await nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, config));
//   console.log('near: ', near);

//   const walletAccount = new nearAPI.WalletAccount(near, config);
//   console.log('walletAccount: ', walletAccount);

//   window.postMessage(JSON.stringify({ near, walletAccount, accountId }));

//   console.log('post store success');
// });


// window.addEventListener("message", async function (event) {
//   // console.log('script: ', event.data);
//   try {
//     console.log('script store: ', JSON.parse(event.data));
//     const info = JSON.parse(event.data);

//     if (info.type === 'requestSignIn') {
//       const { keyStores, KeyPair, connect, transactions: { functionCall } } = nearAPI;
//       const { data } = info;
//       console.log('123 data: ', data);
//       const { currentAccount } = store.app;
//       const { secretKey, accountId, publickKey } = currentAccount;
//       console.log('currentAccount: ', currentAccount);
//       const keyPair = KeyPair.fromString(secretKey);
//       const keyStore = new keyStores.InMemoryKeyStore();
//       // const keyStore = new nearAPI.keyStores.BrowserLocalStorageKeyStore();
//       await keyStore.setKey('testnet', accountId, keyPair);
//       let accessKey = nearAPI.utils.KeyPair.fromRandom('ed25519');
//       console.log('accessKey: ', accessKey);
//       const pk = accessKey.getPublicKey().toString();
//       console.log('pk: ', pk);
//       // await keyStore.setKey('testnet', 'pending_key' + accessKey.getPublicKey(), accessKey);
//       // await keyStore.setKey('testnet', 'pending_key' + accessKey.getPublicKey(), accessKey);

//       const config = {
//         network: 'testnet',
//         networkId: 'testnet',
//         nodeUrl: "https://rpc.testnet.near.org",
//         walletUrl: "https://wallet.testnet.near.org",
//         helperUrl: "https://helper.testnet.near.org",
//         explorerUrl: "https://explorer.testnet.near.org",
//       }

//       const connection = nearAPI.Connection.fromConfig({
//         networkId: 'testnet',
//         provider: { type: 'JsonRpcProvider', args: { url: "https://rpc.testnet.near.org" } },
//         signer: {},
//       });

//       const aa = new nearAPI.Account(connection, accountId)
//       console.log('aa: ', aa);

//       const near = await connect({
//         ...config,
//         keyStore,
//       })
//       const account = await near.account(accountId);
//       const contractId = data[0];
//       console.log('contractId: ', contractId);
//       console.log('account: ', account);
//       const amount = nearAPI.utils.format.parseNearAmount('0.25');

//       accessKey = transactions.functionCallAccessKey(contractId, [''], amount);
//       // accessKey = transactions.fullAccessKey();

//       const actions = [transactions.addKey(key_pair.PublicKey.from(pk), accessKey)];
//       console.log('actions: ', actions);
//       // const res = await account.addKey(pk, contractId, '', amount);
//       // const res = await account.addKey('ed25519:FFuHpwaB4eacvjkNCgkPmc632ftrRZEWYmwymSM2iGSo', contractId, '', amount);
//       // const res = await account.addKey('ed25519:Djj2FxZVXz2RcqkMC5mQ9CDHp2D6XAYJHraYBfWZAw8r', contractId, '', amount);
//       // console.log('res: ', res);
//       // const res = await account.sendMoney('amazingbeerbelly.near', 1);
//       // console.log('res: ', res);

//       //   .signAndSendTransaction({
//       //     receiverId: this.accountId,
//       //     actions: [transaction_1.addKey(key_pair_1.PublicKey.from(publicKey), accessKey)]
//       // });

//       const res = await account.signAndSendTransaction(
//         accountId,
//         actions,
//       );
//       console.log('res: ', res);
//       window.postMessage('')
//     }
//   } catch (error) {
//     console.log('error: ', error);
//   }
// });

// chrome.runtime.onMessage.addListener((request, sender, sendRsponse) => {
//   console.log('request: ', request);
//   console.log('sender: ', sender);
//   console.log('sendRsponse: ', sendRsponse);
// })

// window.addEventListener('message', (event) => {
//   window.postMessage('123');
// })
