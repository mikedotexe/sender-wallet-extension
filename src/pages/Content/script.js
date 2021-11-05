let globalCallback;

window.walletAccount.requestSignIn = ({ contractId, methodNames = [] }, callback) => {
  globalCallback = callback;
  const data = { type: 'fromPage', contractId, methodNames, method: 'signin' };
  window.postMessage(JSON.stringify(data));
}

window.addEventListener('message', function (event) {
  console.log('inject script message: ', event.data);
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'result') {
      globalCallback(data);
    }
  } catch (error) {

  }
})