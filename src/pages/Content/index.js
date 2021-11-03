import { printLine } from './modules/print';
import * as nearAPI from "near-api-js";

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");

// window.addEventListener("message", function (event) {
//   console.log('content script get message: ', event);
//   // We only accept messages from ourselves
//   // chrome.runtime.sendMessage(event.data);
//   // chrome.tabs.sendMessage(event.data);
//   console.log('sendMessage success');
// });

function injectScript(file, node) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);
  th.appendChild(s);
}
injectScript(chrome.runtime.getURL('script.bundle.js'), 'body');


let store;
chrome.storage.local.get('persist:root', async function (c) {
  let value = c['persist:root'];
  value = value.replaceAll('\\', '');
  value = value.replaceAll('\"{', '{');
  value = value.replaceAll('}\"', '}');
  store = JSON.parse(value);
  console.log('content store: ', store);
  const { currentAccount } = store.app;
  const { accountId } = currentAccount;
  console.log('currentAccount: ', currentAccount);

  // const connection = nearAPI.Connection.fromConfig({
  //   networkId: 'mainnet',
  //   provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.mainnet.near.org/' } },
  //   signer: {},
  // })

  // const account = new nearAPI.Account(connection, currentAccount.accountId);
  // console.log('account: ', account);

  const config = {
    network: 'mainnet',
    networkId: 'mainnet',
    nodeUrl: "https://rpc.mainnet.near.org",
    walletUrl: "https://wallet.mainnet.near.org",
    helperUrl: "https://helper.mainnet.near.org",
    explorerUrl: "https://explorer.mainnet.near.org",
  }

  const near = await nearAPI.connect(Object.assign({ deps: { keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore() } }, config));
  console.log('near: ', near);

  const walletAccount = new nearAPI.WalletAccount(near, config);
  console.log('walletAccount: ', walletAccount);

  window.postMessage(JSON.stringify({ near, walletAccount, accountId }));

  console.log('post store success');
});
