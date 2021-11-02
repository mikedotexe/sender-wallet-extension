// alert(1);
// window.aaa = '123';

window.walletAccount.requestSignIn = (data, text) => {
  window.postMessage('notification');
  // console.log('data: ', data);
  // console.log('text: ', text);
  // alert(1);
  // var opt = {
  //   type: 'list',
  //   title: 'keep burning',
  //   message: 'Primary message to display',
  //   priority: 1,
  //   items: [{ title: '', message: '' }],
  //   iconUrl: 'icon-128.png'
  // };


  // chrome.notifications.create();
  // chrome.notifications.create('notify1', opt, function (id) { console.log("Last error:", chrome.runtime.lastError); });
}
