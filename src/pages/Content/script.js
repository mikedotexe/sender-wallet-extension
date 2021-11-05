const callbacks = {};

window.walletAccount.requestSignIn = ({ contractId, methodNames = [] }, callback) => {
  // ensure the unique notification id
  const notificationId = Date.now();
  callbacks[notificationId] = callback;
  const data = { type: 'fromPage', contractId, methodNames, method: 'signin', notificationId };
  window.postMessage(JSON.stringify(data));
}

window.addEventListener('message', function (event) {
  console.log('inject script message: ', event.data);
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'result') {
      callbacks[data.notificationId](data);
    }
  } catch (error) {
  }
})