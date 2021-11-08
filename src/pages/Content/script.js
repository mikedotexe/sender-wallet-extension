const callbacks = {};

const emptyAuthData = { accountId: '', allKeys: [] };

const getNotificationId = () => {
  return Date.now();
}

class Wallet {
  constructor() {
    this.contractId = '';
    this.accountId = '';
    this.authData = emptyAuthData;
  }

  init = ({ contractId }, callback) => {
    this.contractId = contractId;

    const notificationId = getNotificationId();
    callbacks[notificationId] = callback;
    const data = { type: 'fromPage', contractId, notificationId, method: 'init' };
    window.postMessage(JSON.stringify(data));
  }

  signOut = () => {
    const notificationId = getNotificationId();
    const data = { type: 'fromPage', contractId: this.contractId, notificationId, method: 'signout' };
    window.postMessage(JSON.stringify(data));
  }

  isSignedIn = () => {
    return !!this.authData.accountId;
  }

  requestSignIn = ({ contractId, methodNames = [] }, callback) => {
    // ensure the unique notification id
    const notificationId = getNotificationId();
    callbacks[notificationId] = callback;
    const data = { type: 'fromPage', contractId: (contractId || this.contractId), methodNames, method: 'signin', notificationId };
    window.postMessage(JSON.stringify(data));
  }

  signOutSuccess = () => {
    this.authData = emptyAuthData;
    this.accountId = '';
  }

  signInSuccess = ({ accountId, publickKey, accessKey }) => {
    this.accountId = accountId;
    this.authData = { accountId, allKeys: [publickKey], accessKey };
  }

  signAndSendTransaction = ({ contractId, methodName, receiverId, amount, params, gas, deposit, usingAccessKey }, callback) => {
    const notificationId = getNotificationId();
    callbacks[notificationId] = callback;
    const data = { type: 'fromPage', contractId, receiverId, amount, methodName, params, gas, deposit, method: 'signAndSendTransaction', notificationId };
    if (usingAccessKey) {
      const { accessKey } = this.authData;
      data.accessKey = accessKey;
    }
    window.postMessage(JSON.stringify(data));
  }
}

window.wallet = new Wallet();

window.addEventListener('message', function (event) {
  console.log('inject script message: ', event.data);
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'result') {
      if (data.method === 'init') {
        if (data.res === 'empty') {
          callbacks[data.notificationId]({ accessKey: '' });
        } else {
          const { accountId, publickKey, accessKey } = data;
          window.wallet.signInSuccess({ accountId, publickKey, accessKey });
          callbacks[data.notificationId]({ accessKey });
        }
      } else if (data.method === 'signout' && data.res === 'success') {
        window.wallet.signOutSuccess();
      } else if (data.method === 'signin' && data.res && data.accessKey) {
        const { accountId, publickKey, accessKey } = data;
        window.wallet.signInSuccess({ accountId, publickKey, accessKey });
        callbacks[data.notificationId]({ accessKey });
      } else {
        callbacks[data.notificationId](data);
      }
    }
  } catch (error) {
    console.log('2');
  }
})