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
      window.postMessage(data);
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
      window.postMessage(data);
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
      window.postMessage(data);
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
   * @param {*} receiverId received account id
   * @param {*} actions { methodName, args, gas, deposit, msg }
   * @param {*} usingAccessKey If 'true', will using access key to make function call and no need to request user to sign this transaction. Set 'false' will popup a notification window to request user to sign this transaction.
   * @returns 
   */
  signAndSendTransaction = ({ receiverId, actions, usingAccessKey = false }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', receiverId, actions, method: 'signAndSendTransaction', notificationId };
      if (usingAccessKey) {
        const { accessKey } = this.authData;
        data.accessKey = accessKey;
      }
      window.postMessage(data);
    })
  }

  /**
   * @param {*} receiverId received account id
   * @param {*} amount send near amount
   */
  sendMoney = ({ receiverId, amount }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', receiverId, amount, method: 'sendMoney', notificationId };
      window.postMessage(data);
    })
  }
}

window.wallet = new Wallet();

window.addEventListener('message', function (event) {
  try {
    const { data } = event;
    if (data.type === 'sender-wallet-result') {
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
        window.postMessage({ ...data, method: 'init', type: 'sender-wallet-fromPage' });
      } else {
        resolves[data.notificationId](data);
      }
    }
  } catch (error) {
  }
})