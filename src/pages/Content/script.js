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
        const { data } = event;
        if (data.type === 'sender-wallet-fromContent' && data.method === 'accountChanged') {
          this.authData = emptyAuthData;
          this.accountId = '';
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

  signInSuccess = ({ accountId, publicKey, accessKey }) => {
    this.accountId = accountId;
    this.authData = { accountId, allKeys: [publicKey], accessKey };
  }

  /**
   * Make a view function call
   * @param {*} contractId contract account id
   * @param {*} methodName function call methodName
   * @param {*} params function call params
   * @returns 
   */
  viewFunctionCall = ({ contractId, methodName, params = {} }) => {
    // eslint-disable-next-line no-undef
    const connection = nearApi.Connection.fromConfig({
      // networkId: 'testnet',
      // provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.testnet.near.org/' } },
      networkId: 'mainnet',
      provider: { type: 'JsonRpcProvider', args: { url: 'https://rpc.mainnet.near.org/' } },
      signer: {},
    })

    // eslint-disable-next-line no-undef
    const account = new nearApi.Account(connection, 'dontcare');
    return account.viewFunction(contractId, methodName, params);
  }

  /**
   * 
   * @param {*} receiverId received account id
   * @param {*} actions { methodName, args, gas, deposit, msg }
   * @returns 
   */
  signAndSendTransaction = ({ receiverId, actions }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', transactions: [{ receiverId, actions }], method: 'signAndSendTransaction', notificationId };
      // const data = { type: 'sender-wallet-fromPage', receiverId, actions, method: 'signAndSendTransaction', notificationId };
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

  /**
   * 
   * @param {*} transactions transaction list
   * @returns
   */
  requestSignTransactions = ({ transactions }) => {
    return new Promise((resolve, reject) => {
      const notificationId = getNotificationId();
      resolves[notificationId] = resolve;
      const data = { type: 'sender-wallet-fromPage', transactions, method: 'requestSignTransactions', notificationId };
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
          const { accountId, publicKey, accessKey } = data;
          window.wallet.signInSuccess({ accountId, publicKey, accessKey });
          resolves[data.notificationId]({ accessKey });
        }
      } else if (data.method === 'signout' && data.res === 'success') {
        window.wallet.signOutSuccess();
        resolves[data.notificationId]({ result: 'success' });
      } else if (data.method === 'signin' && data.res && data.accessKey) {
        const { accountId, publicKey, accessKey } = data;
        window.wallet.signInSuccess({ accountId, publicKey, accessKey });
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