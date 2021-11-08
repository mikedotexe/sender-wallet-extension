const callbacks = {};

const emptyAuthData = { accountId: '', allKeys: [] };

const getNotificationId = () => {
  return Date.now();
}

class Wallet {
  constructor() {
    this.accountId = '';
    this.authData = emptyAuthData;
  }

  signOut = () => {
    this.authData = emptyAuthData;
  }

  isSignedIn = () => {
    return !!this.authData.accountId;
  }

  requestSignIn = ({ contractId, methodNames = [] }, callback) => {
    // ensure the unique notification id
    const notificationId = getNotificationId();
    callbacks[notificationId] = callback;
    const data = { type: 'fromPage', contractId, methodNames, method: 'signin', notificationId };
    window.postMessage(JSON.stringify(data));
  }

  signSuccess = ({ accountId, publickKey, accessKey }) => {
    this.accountId = accountId;
    this.authData = { accountId, allKeys: [publickKey], accessKey };
  }

  signAndSendTransaction = ({ contractId, methodName, params, usingAccessKey }, callback) => {
    const notificationId = getNotificationId();
    callbacks[notificationId] = callback;
    const data = { type: 'fromPage', contractId, methodName, params, method: 'signAndSendTransaction', notificationId };
    if (usingAccessKey) {
      const { accessKey } = this.authData;
      data.accessKey = accessKey;
    }
    window.postMessage(JSON.stringify(data));
  }
}

window.walletAccount = new Wallet();

window.addEventListener('message', function (event) {
  console.log('inject script message: ', event.data);
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'result') {
      if (data.method === 'signin' && data.res && data.accessKey) {
        const { accountId, publickKey, accessKey } = data;
        window.walletAccount.signSuccess({ accountId, publickKey, accessKey });
        callbacks[data.notificationId]({ accessKey });
      } else {
        callbacks[data.notificationId](data);
      }
    }
  } catch (error) {
    console.log('2');
  }
})