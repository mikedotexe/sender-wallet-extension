import {
  put,
  select,
  takeLatest,
  call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { push, goBack } from 'connected-react-router';
import BN from 'bn.js';
import * as nearApi from 'near-api-js';

import { setImportStatus, setCustomRpcStatus, initStatus } from '../reducers/loading';
import { APP_ACCOUNT_STAKING, APP_ACCOUNT_TRANSFER, APP_ACCOUNT_UNSTAKING, APP_IMPORT_ACCOUNT, APP_SET_PASSWORD, APP_SWAP_NEAR, APP_UPDATE_ACCOUNT, APP_ADD_PENDING_REQUEST, APP_UPDATE_PENDING_REQUEST, APP_REMOVE_PENDING_REQUEST, APP_ADD_CUSTOM_RPC, APP_REMOVE_CUSTOM_RPC, APP_UPDATE_CUSTOM_RPC } from '../actions/app';
import { getAppStore, getTempStore } from './';
import { formatAccount, parseNearAmount, parseTokenAmount } from '../utils';
import { addAccount, changeAccount, setPassword, setPendingRequests, setRpcs, setSalt, updateAccounts } from '../reducers/app';
import passwordHash from '../core/passwordHash';
import NearService from '../core/near';
import ApiHelper from '../apiHelper';
import { setStakingConfirmDrawer, setStakingResultDrawer, setSwapResultDrawer, setTransferConfirmDrawer, setTransferResultDrawer, setUnstakingConfirmDrawer, setUnstakingResultDrawer, setSwapConfirmDrawer } from '../reducers/temp';
import Rpc from '../data/Rpc';
import config from '../config';

function* setPasswordSaga(action) {
  const { password } = action;
  const appStore = yield select(getAppStore);
  let { salt } = appStore;
  if (!salt) {
    salt = passwordHash.generateSalt();
    yield put(setSalt(salt));
  }
  const hash = passwordHash.generate(salt, password);
  yield put(setPassword(hash));
  yield put(push('/Startup'));
}

function* importAccountSaga(action) {
  yield put(setImportStatus({ loading: true }))
  const { mnemonic, network } = action;
  try {
    const appStore = yield select(getAppStore);
    const { accounts, lockupPassword, currentRpc } = appStore;
    const isExist = _.findIndex(accounts, item => item.mnemonic === mnemonic);
    if (isExist < 0) {
      const account = yield call(formatAccount, { mnemonic, config: currentRpc[network] });
      if (!account.accountId) {
        yield put(setImportStatus({ loading: false, error: 'Account is not exist in mainnet' }));
      } else {
        yield put(addAccount(account));
        if (lockupPassword) {
          yield put(push('/home'));
        } else {
          yield put(push('/setPwd'));
        }
        yield put(setImportStatus({ loading: false }));
      }
    } else {
      yield put(setImportStatus({ loading: false, error: 'Account is exist' }));
    }
  } catch (error) {
    yield put(setImportStatus({ loading: false, error: error.message }));
  }
}

function* updateAccountSaga() {
  try {
    const appStore = yield select(getAppStore);
    const { currentAccount, accounts, currentRpc } = appStore;
    const { mnemonic, accountId, network } = currentAccount;

    const nearService = new NearService({ config: currentRpc[network] });
    yield call(nearService.setSigner, { mnemonic, accountId });
    const tokens = yield call(nearService.getTokensAndBalance);
    const validatorDepositMap = yield call(nearService.getValidatorDepositMap, { accountId });
    const balance = yield call(nearService.getAccountBalance);
    balance.reservedForTransactions = BN.min(new BN(balance.available), new BN(nearApi.utils.format.parseNearAmount('0.05'))).toString();
    balance.available = new BN(balance.available).sub(new BN(balance.reservedForTransactions)).toString();
    const {
      validators,
      totalUnstaked,
      totalStaked,
      totalUnclaimed,
      totalAvailable,
      totalPending,
    } = yield call(nearService.getValidatorsAndBalance, { balance, validatorDepositMap });

    const apiHelper = new ApiHelper({ helperUrl: currentRpc[network].helperUrl });
    const txs = yield call(apiHelper.getTransactions, currentAccount.accountId);

    const account = yield call(formatAccount, {
      mnemonic,
      balance,
      validators,
      totalUnstaked,
      totalStaked,
      totalUnclaimed,
      totalAvailable,
      totalPending,
      tokens: [{ symbol: 'NEAR', name: 'NEAR', balance: balance.available, accountId: '' }, ...tokens],
      transactions: txs,
      config: currentRpc[network],
    });
    const newAccounts = _.map(accounts, (item) => {
      if (item.accountId === account.accountId) {
        return account;
      }
      return item;
    })

    yield put(updateAccounts(newAccounts));
    yield put(changeAccount(account));
  } catch (error) {
    console.log('update current account error: ', error);
  }
}

function* transferSaga(action) {
  const { receiverId, amount, token } = action;
  const { accountId: contractId, decimals } = token;
  try {
    const appStore = yield select(getAppStore);
    const { currentAccount, currentRpc } = appStore;
    const { mnemonic, accountId, network } = currentAccount;

    const nearService = new NearService({ config: currentRpc[network] });
    yield call(nearService.setSigner, { mnemonic, accountId });

    let parseAmount;
    if (contractId) {
      parseAmount = parseTokenAmount(amount, decimals);
    } else {
      parseAmount = parseNearAmount(amount);
    }

    const { pendingRequests } = appStore;
    if (_.isEmpty(pendingRequests)) {
      const pendingRequest = { selectToken: token, sendAmount: amount, receiver: receiverId, type: 'transfer', signerId: accountId }
      yield put({ type: APP_ADD_PENDING_REQUEST, pendingRequest })
    }

    yield call(nearService.transfer, { contractId, amount: `${parseAmount}`, receiverId });

    yield put(setTransferConfirmDrawer({ display: false }));
    yield put(setTransferResultDrawer({ display: true, error: null, selectToken: token, sendAmount: amount, receiver: receiverId }))
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    yield put(setTransferConfirmDrawer({ display: false }));
    yield put(setTransferResultDrawer({ display: true, error: error.message, selectToken: token, sendAmount: amount, receiver: receiverId }))
  }
}

function* stakingSaga(action) {
  const { amount } = action;
  const appStore = yield select(getAppStore);
  const tempStore = yield select(getTempStore);
  const { currentAccount, currentRpc } = appStore;
  const { mnemonic, accountId, network } = currentAccount;
  const { selectValidator } = tempStore;
  try {
    const nearService = new NearService({ config: currentRpc[network] });
    yield call(nearService.setSigner, { mnemonic, accountId });
    const parseAmount = parseNearAmount(amount);

    const { pendingRequests } = appStore;
    if (_.isEmpty(pendingRequests)) {
      const pendingRequest = { selectValidator, stakeAmount: amount, type: 'staking', signerId: accountId };
      yield put({ type: APP_ADD_PENDING_REQUEST, pendingRequest })
    }

    yield call(nearService.stake, { amount: `${parseAmount}`, validatorId: selectValidator.accountId });

    yield put(setStakingConfirmDrawer({ display: false }));
    yield put(setStakingResultDrawer({ display: true, error: null, selectValidator, stakeAmount: amount }));
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    yield put(setStakingConfirmDrawer({ display: false }));
    yield put(setStakingResultDrawer({ display: true, error: error.message, selectValidator, stakeAmount: amount }));
  }
}

function* unstakeSaga(action) {
  const { amount } = action;
  const appStore = yield select(getAppStore);
  const tempStore = yield select(getTempStore);
  const { currentAccount, currentRpc } = appStore;
  const { mnemonic, accountId, network } = currentAccount;
  const { selectUnstakeValidator } = tempStore;
  try {
    const nearService = new NearService({ config: currentRpc[network] });
    yield call(nearService.setSigner, { mnemonic, accountId });
    const parseAmount = parseNearAmount(amount);

    const { pendingRequests } = appStore;
    if (_.isEmpty(pendingRequests)) {
      const pendingRequest = { selectUnstakeValidator, unstakeAmount: amount, type: 'unstake', signerId: accountId };
      yield put({ type: APP_ADD_PENDING_REQUEST, pendingRequest })
    }

    yield call(nearService.unstake, { amount: `${parseAmount}`, validatorId: selectUnstakeValidator.accountId });

    yield put(setUnstakingConfirmDrawer({ display: false }));
    yield put(setUnstakingResultDrawer({ display: true, error: null, selectUnstakeValidator, unstakeAmount: amount }));
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    yield put(setUnstakingConfirmDrawer({ display: false }));
    yield put(setUnstakingResultDrawer({ display: true, error: error.message, selectUnstakeValidator, unstakeAmount: amount }));
  }
}

function* swapSaga(action) {
  const { swapFrom, swapTo, amount } = action;
  try {
    const appStore = yield select(getAppStore);
    const { currentAccount, currentRpc } = appStore;
    const { mnemonic, accountId, network } = currentAccount;
    const nearService = new NearService({ config: currentRpc[network] });
    yield call(nearService.setSigner, { mnemonic, accountId });

    const parseAmount = parseNearAmount(amount);

    const { pendingRequests } = appStore;
    if (_.isEmpty(pendingRequests)) {
      const pendingRequest = { swapFrom, swapTo, swapAmount: amount, type: 'swap', signerId: accountId };
      yield put({ type: APP_ADD_PENDING_REQUEST, pendingRequest })
    }

    if (swapFrom === 'NEAR' && swapTo === 'wNEAR') {
      yield call(nearService.wrapNearDeposit, { amount: `${parseAmount}` });
    } else {
      yield call(nearService.wrapNearWithdraw, { amount: `${parseAmount}` });
    }

    yield put(setSwapConfirmDrawer({ display: false }));
    yield put(setSwapResultDrawer({ display: true, error: null, swapFrom, swapTo, swapAmount: amount }));
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    yield put(setSwapConfirmDrawer({ display: false }));
    yield put(setSwapResultDrawer({ display: true, error: error.message, swapFrom, swapTo, swapAmount: amount }));
  }
}

function* addPendingRequestSaga(action) {
  try {
    const { pendingRequest } = action;
    const appStore = yield select(getAppStore);
    const { pendingRequests } = appStore;
    const newpendingRequests = [...pendingRequests, pendingRequest];
    yield put(setPendingRequests(newpendingRequests));
  } catch (error) {
    console.log('addPendingRequestSaga error: ', error);
  }
}

function* updatePendingRequestSaga(action) {
  try {
    const { requestId } = action;
    const appStore = yield select(getAppStore);
    const { pendingRequests } = appStore;
    const newpendingRequests = [...pendingRequests];

    if (!_.isEmpty(newpendingRequests)) {
      const { length } = newpendingRequests;
      const latestPendingRequest = { ...newpendingRequests[length - 1], requestId }
      newpendingRequests[length - 1] = latestPendingRequest;
    }

    yield put(setPendingRequests(newpendingRequests));
  } catch (error) {
    console.log('updatePendingRequestSaga error: ', error);
  }
}

function* removePendingRequestSaga(action) {
  try {
    const { requestId } = action;
    const appStore = yield select(getAppStore);
    const { pendingRequests } = appStore;
    let newpendingRequests = [...pendingRequests];
    if (requestId) {
      newpendingRequests = _.filter(pendingRequests, (request) => request.requestId !== requestId);
    } else {
      newpendingRequests.pop();
    }
    yield put(setPendingRequests(newpendingRequests));
  } catch (error) {
    console.log('removePendingRequestSaga error: ', error);
  }
}

function* addCustomRpcSaga(action) {
  try {
    const { network, name, nodeUrl } = action;
    yield put(setCustomRpcStatus({ loading: true }));
    const appStore = yield select(getAppStore);
    const { rpcs } = appStore;

    const nearService = new NearService({ config: { ...config[network], nodeUrl } });
    const status = yield call(nearService.getStatus);
    if (status && status.error) {
      throw new Error(status.error.message);
    }

    if (status && status.chain_id !== network) {
      throw new Error(`RPC server's network (${status.chain_id}) is different with this network (${network})`);
    }

    const rpc = new Rpc({ network, name, nodeUrl });
    yield put(setRpcs([...rpcs, rpc]));
    yield put(initStatus());
    yield put(goBack());
  } catch (error) {
    yield put(setCustomRpcStatus({ loading: false, error: error.message }));
  }
}

function* updateCustomRpcSaga(action) {
  try {
    const { network, name, nodeUrl, index } = action;
    yield put(setCustomRpcStatus({ loading: true }));
    const appStore = yield select(getAppStore);
    const { rpcs } = appStore;

    const nearService = new NearService({ config: { ...config[network], nodeUrl } });
    const status = yield call(nearService.getStatus);
    if (status && status.error) {
      throw new Error(status.error.message);
    }

    if (status && status.chain_id !== network) {
      throw new Error(`RPC server's network (${status.chain_id}) is different with this network (${network})`);
    }

    const newRpcs = _.map(rpcs, (item) => {
      if (item.index === index) {
        return new Rpc({ index, network, name, nodeUrl });
      }
      return item;
    })

    yield put(setRpcs(newRpcs));
    yield put(initStatus());
    yield put(goBack());
  } catch (error) {
    yield put(setCustomRpcStatus({ loading: false, error: error.message }));
  }
}

function* removeCustomRpcSaga(action) {
  try {
    const { index } = action;
    yield put(setCustomRpcStatus({ loading: true }));
    const appStore = yield select(getAppStore);
    const { rpcs } = appStore;

    const newRpcs = _.filter(rpcs, (item) => item.index !== index);
    yield put(setRpcs(newRpcs));
    yield put(initStatus());
    yield put(goBack());
  } catch (error) {
    yield put(setCustomRpcStatus({ loading: false, error: error.message }));
  }
}

export default function* appSagas() {
  yield takeLatest(APP_SET_PASSWORD, setPasswordSaga);
  yield takeLatest(APP_IMPORT_ACCOUNT, importAccountSaga);
  yield takeLatest(APP_UPDATE_ACCOUNT, updateAccountSaga);
  yield takeLatest(APP_ACCOUNT_TRANSFER, transferSaga);
  yield takeLatest(APP_ACCOUNT_STAKING, stakingSaga);
  yield takeLatest(APP_ACCOUNT_UNSTAKING, unstakeSaga);
  yield takeLatest(APP_SWAP_NEAR, swapSaga);
  yield takeLatest(APP_ADD_PENDING_REQUEST, addPendingRequestSaga);
  yield takeLatest(APP_UPDATE_PENDING_REQUEST, updatePendingRequestSaga);
  yield takeLatest(APP_REMOVE_PENDING_REQUEST, removePendingRequestSaga);
  yield takeLatest(APP_ADD_CUSTOM_RPC, addCustomRpcSaga);
  yield takeLatest(APP_UPDATE_CUSTOM_RPC, updateCustomRpcSaga);
  yield takeLatest(APP_REMOVE_CUSTOM_RPC, removeCustomRpcSaga);
}