const resolves = {};

const emptyAuthData = { accountId: '', allKeys: [] };

// ensure the unique notification id
const getNotificationId = () => {
  return Date.now();
}

class Wallet {
  constructor() {
    this.contractId = '';
    this.accountId = '';
    this.authData = emptyAuthData;
  }

  init = ({ contractId }) => {
    return new Promise((resolve, reject) => {
      this.contractId = contractId;
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'fromPage', contractId, notificationId, method: 'init' };
      window.postMessage(JSON.stringify(data));
    })
  }

  onAccountChanged = (callback) => {
    window.addEventListener('message', function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'fromContent' && data.method === 'accountChanged') {
          callback(data.accountId);
        }
      } catch (error) {
      }
    })
  }

  signOut = () => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'fromPage', contractId: this.contractId, notificationId, method: 'signout' };
      window.postMessage(JSON.stringify(data));
    })
  }

  isSignedIn = () => {
    return !!this.authData.accountId;
  }

  requestSignIn = ({ contractId, methodNames = [] }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'fromPage', contractId: (contractId || this.contractId), methodNames, method: 'signin', notificationId };
      window.postMessage(JSON.stringify(data));
    })
  }

  signOutSuccess = () => {
    this.authData = emptyAuthData;
    this.accountId = '';
  }

  signInSuccess = ({ accountId, publickKey, accessKey }) => {
    this.accountId = accountId;
    this.authData = { accountId, allKeys: [publickKey], accessKey };
  }

  signAndSendTransaction = ({ contractId, methodName, receiverId, amount, params, gas, deposit, usingAccessKey }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'fromPage', contractId, receiverId, amount, methodName, params, gas, deposit, method: 'signAndSendTransaction', notificationId };
      if (usingAccessKey) {
        const { accessKey } = this.authData;
        data.accessKey = accessKey;
      }
      window.postMessage(JSON.stringify(data));
    })
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
          resolves[data.notificationId]({ accessKey: '' });
        } else {
          const { accountId, publickKey, accessKey } = data;
          window.wallet.signInSuccess({ accountId, publickKey, accessKey });
          resolves[data.notificationId]({ accessKey });
        }
      } else if (data.method === 'signout' && data.res === 'success') {
        window.wallet.signOutSuccess();
        resolves[data.notificationId]({ result: 'success' });
      } else if (data.method === 'signin' && data.res && data.accessKey) {
        const { accountId, publickKey, accessKey } = data;
        window.wallet.signInSuccess({ accountId, publickKey, accessKey });
        resolves[data.notificationId]({ accessKey });
      } else {
        resolves[data.notificationId](data);
      }
    }
  } catch (error) {
    console.log('2');
  }
})