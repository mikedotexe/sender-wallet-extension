window.addEventListener("message", function (event) {
  // console.log('script: ', event.data);
  try {
    console.log('script store: ', JSON.parse(event.data));
    const store = JSON.parse(event.data);

    const { near, walletAccount, accountId } = store;
    window.near = near;
    window.walletAccount = walletAccount;
    // window.accountId = accountId;

    window.walletAccount.requestSignIn = (...data) => {
      console.log('data: ', data);
    }
  } catch (error) {
    console.log('script: ', event.data);
  }
  // console.log('content script get message: ', event);
  // We only accept messages from ourselves
  // chrome.runtime.sendMessage(event.data);
  // chrome.tabs.sendMessage(event.data);
  // console.log('sendMessage success');
});
