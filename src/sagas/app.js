import {
  put,
  select,
  takeLatest,
  call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { push } from 'connected-react-router';
import BN from 'bn.js';
import * as nearApi from 'near-api-js';

import { setImportStatus } from '../reducers/loading';
import { APP_ACCOUNT_STAKING, APP_ACCOUNT_TRANSFER, APP_ACCOUNT_UNSTAKING, APP_IMPORT_ACCOUNT, APP_SET_PASSWORD, APP_SWAP_NEAR, APP_UPDATE_ACCOUNT, APP_UPDATE_TRANSACTIONS } from '../actions/app';
import { getAppStore, getTempStore } from './';
import { formatAccount, parseNearAmount, parseTokenAmount } from '../utils';
import { addAccount, changeAccount, setPassword, setSalt, updateAccounts } from '../reducers/app';
import passwordHash from '../core/passwordHash';
import { nearService } from '../core/near';
import apiHelper from '../apiHelper';
import { setStakingResultDrawer, setSwapResultDrawer, setTransferConfirmDrawer, setTransferResultDrawer, setUnstakingConfirmDrawer, setUnstakingResultDrawer } from '../reducers/temp';

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
  const { mnemonic } = action;
  try {
    const appStore = yield select(getAppStore);
    const { accounts, lockupPassword } = appStore;
    const isExist = _.findIndex(accounts, item => item.mnemonic === mnemonic);
    if (isExist < 0) {
      const account = yield call(formatAccount, { mnemonic });
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
    const { currentAccount, accounts } = appStore;
    const { mnemonic, accountId } = currentAccount;

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
    const { currentAccount } = appStore;
    const { mnemonic, accountId } = currentAccount;
    yield call(nearService.setSigner, { mnemonic, accountId });

    let parseAmount;
    if (contractId) {
      parseAmount = parseTokenAmount(amount, decimals);
    } else {
      parseAmount = parseNearAmount(amount);
    }
    yield call(nearService.transfer, { contractId, amount: `${parseAmount}`, receiverId });
    yield put(setTransferConfirmDrawer({ display: false }));
    yield put(setTransferResultDrawer({ display: true, error: null, selectToken: token, sendAmount: amount, receiver: receiverId }))
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    console.log('transfer error: ', error);
    yield put(setTransferConfirmDrawer({ display: false }));
    yield put(setTransferResultDrawer({ display: true, error: error.message, selectToken: token, sendAmount: amount, receiver: receiverId }))
  }
}

function* stakingSaga(action) {
  const { amount } = action;
  const appStore = yield select(getAppStore);
  const tempStore = yield select(getTempStore);
  const { currentAccount } = appStore;
  const { mnemonic, accountId } = currentAccount;
  const { selectValidator } = tempStore;
  try {
    yield call(nearService.setSigner, { mnemonic, accountId });

    const parseAmount = parseNearAmount(amount);
    yield call(nearService.stake, { amount: `${parseAmount}`, validatorId: selectValidator.accountId });
    yield put(setStakingResultDrawer({ display: true, error: null, selectValidator, stakeAmount: amount }));
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    console.log('staking error: ', error);
    yield put(setStakingResultDrawer({ display: true, error: error.message, selectValidator, stakeAmount: amount }));
  }
}

function* unstakeSaga(action) {
  const { amount } = action;
  const appStore = yield select(getAppStore);
  const tempStore = yield select(getTempStore);
  const { currentAccount } = appStore;
  const { mnemonic, accountId } = currentAccount;
  const { selectUnstakeValidator } = tempStore;
  try {
    yield call(nearService.setSigner, { mnemonic, accountId });

    const parseAmount = parseNearAmount(amount);
    yield call(nearService.unstake, { amount: `${parseAmount}`, validatorId: selectUnstakeValidator.accountId });
    yield put(setUnstakingConfirmDrawer({ display: false }));
    yield put(setUnstakingResultDrawer({ display: true, error: null, selectUnstakeValidator, unstakeAmount: amount }));
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    console.log('unstaking error: ', error);
    yield put(setUnstakingResultDrawer({ display: true, error: error.message, selectUnstakeValidator, unstakeAmount: amount }));
  }
}

function* swapSaga(action) {
  const { swapFrom, swapTo, amount } = action;
  try {
    const appStore = yield select(getAppStore);
    const { currentAccount } = appStore;
    const { mnemonic, accountId } = currentAccount;
    yield call(nearService.setSigner, { mnemonic, accountId });

    const parseAmount = parseNearAmount(amount);
    if (swapFrom === 'NEAR' && swapTo === 'wNEAR') {
      yield call(nearService.wrapNearDeposit, { amount: `${parseAmount}` });
    } else {
      yield call(nearService.wrapNearWithdraw, { amount: `${parseAmount}` });
    }
    yield put(setSwapResultDrawer({ display: true, error: null, swapFrom, swapTo, swapAmount: amount }));
    yield put({ type: APP_UPDATE_ACCOUNT })
  } catch (error) {
    console.log('swap error: ', error);
    yield put(setSwapResultDrawer({ display: true, error: error.message, swapFrom, swapTo, swapAmount: amount }));
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
}