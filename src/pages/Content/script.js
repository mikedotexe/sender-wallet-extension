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

  /**
   * Initial the wallet. If the dapp has requestSignIn this contract already, init() will auto signin
   * @param {*} contractId contract account id
   * @returns 
   */
  init = ({ contractId }) => {
    return new Promise((resolve, reject) => {
      this.contractId = contractId;
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', contractId, notificationId, method: 'init' };
      window.postMessage(JSON.stringify(data));
    })
  }

  /**
   * 
   * @returns current account id
   */
  getAccountId = () => {
    return this.accountId;
  }

  /**
   * Listen the current account changed
   * @param {*} callback (accountId) => { "TODO if account has changed" }
   */
  onAccountChanged = (callback) => {
    window.addEventListener('message', function (event) {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'sender-wallet-fromContent' && data.method === 'accountChanged') {
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
      const data = { type: 'sender-wallet-fromPage', contractId: this.contractId, notificationId, method: 'signout' };
      window.postMessage(JSON.stringify(data));
    })
  }

  /**
   * Check the current account is signed in with initial contract
   * @returns 
   */
  isSignedIn = () => {
    return !!this.authData.accountId;
  }

  /**
   * 
   * @param {*} contractId contract account id
   * @param {*} methodNames the method names on the contract that should be allowed to be called. Pass null for no method names and '' or [] for any method names.
   * @returns 
   */
  requestSignIn = ({ contractId, methodNames }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', contractId: (contractId || this.contractId), methodNames, method: 'signin', notificationId };
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

  /**
   * 
   * @param {*} contractId contract account id
   * @param {*} methodName contract method name
   * @param {*} receiverId receiver account id
   * @param {*} amount transfer near amount
   * @param {*} params function call arguments
   * @param {*} gas transaction gas
   * @param {*} deposit transaction attached deposit
   * @param {*} usingAccessKey If 'true', will using access key to make function call and no need to request user to sign this transaction. Set 'false' will popup a notification window to request user to sign this transaction.
   * 
   * @returns the result of send transaction
   */
  signAndSendTransaction = ({ contractId, methodName, receiverId, amount, params, gas, deposit, usingAccessKey }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', contractId, receiverId, amount, methodName, params, gas, deposit, method: 'signAndSendTransaction', notificationId };
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
  try {
    const data = JSON.parse(event.data);
    if (data.type === 'sender-wallet-result') {
      console.log('inject script message: ', event.data);
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
      } else if (data.method === 'unlock' && data.res === 'success') {
        window.postMessage(JSON.stringify({ ...data, method: 'init', type: 'sender-wallet-fromPage' }));
      } else {
        resolves[data.notificationId](data);
      }
    }
  } catch (error) {
  }
})