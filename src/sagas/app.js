import {
  put,
  select,
  takeLatest,
  call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { push } from 'connected-react-router';

import { setImportStatus, setSendStatus, setStakingStatus, setUnstakingStatus } from '../reducers/loading';
import { APP_ACCOUNT_STAKING, APP_ACCOUNT_TRANSFER, APP_ACCOUNT_UNSTAKING, APP_IMPORT_ACCOUNT, APP_SET_PASSWORD, APP_UPDATE_ACCOUNT } from '../actions/app';
import { getAppStore, getTempStore } from './';
import { formatAccount, parseNearAmount, parseTokenAmount } from '../utils';
import { addAccount, changeAccount, setPassword, setSalt, updateAccounts } from '../reducers/app';
import passwordHash from '../core/passwordHash';
import { nearService } from '../core/near';

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
      yield put(addAccount(account));
      if (lockupPassword) {
        yield put(push('/home'));
      } else {
        yield put(push('/setPwd'));
      }
      yield put(setImportStatus({ loading: false }));
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
    const {
      validators,
      totalUnstaked,
      totalStaked,
      totalUnclaimed,
      totalAvailable,
      totalPending,
    } = yield call(nearService.getValidatorsAndBalance, { balance, validatorDepositMap });

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
  yield put(setSendStatus({ loading: true }))
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
    yield put(setSendStatus({ loading: false, error: null }));
  } catch (error) {
    console.log('transfer error: ', error);
    yield put(setSendStatus({ loading: false, error: error.message }))
  }
}

function* stakingSaga(action) {
  const { amount } = action;
  yield put(setStakingStatus({ loading: true }));
  try {
    const appStore = yield select(getAppStore);
    const tempStore = yield select(getTempStore);
    const { currentAccount } = appStore;
    const { mnemonic, accountId } = currentAccount;
    const { selectValidator } = tempStore;
    yield call(nearService.setSigner, { mnemonic, accountId });

    const parseAmount = parseNearAmount(amount);
    yield call(nearService.stake, { amount: `${parseAmount}`, validatorId: selectValidator.accountId });
    yield put(setStakingStatus({ loading: false, error: null }));
  } catch (error) {
    console.log('staking error: ', error);
    yield put(setStakingStatus({ loading: false, error: error.message }))
  }
}

function* unstakeSaga(action) {
  const { amount } = action;
  yield put(setUnstakingStatus({ loading: true }));
  try {
    const appStore = yield select(getAppStore);
    const tempStore = yield select(getTempStore);
    const { currentAccount } = appStore;
    const { mnemonic, accountId } = currentAccount;
    const { selectUnstakeValidator } = tempStore;
    yield call(nearService.setSigner, { mnemonic, accountId });

    const parseAmount = parseNearAmount(amount);
    yield call(nearService.unstake, { amount: `${parseAmount}`, validatorId: selectUnstakeValidator.accountId });
    yield put(setUnstakingStatus({ loading: false, error: null }));
  } catch (error) {
    console.log('unstaking error: ', error);
    yield put(setUnstakingStatus({ loading: false, error: error.message }))
  }
}

export default function* appSagas() {
  yield takeLatest(APP_SET_PASSWORD, setPasswordSaga);
  yield takeLatest(APP_IMPORT_ACCOUNT, importAccountSaga);
  yield takeLatest(APP_UPDATE_ACCOUNT, updateAccountSaga);
  yield takeLatest(APP_ACCOUNT_TRANSFER, transferSaga);
  yield takeLatest(APP_ACCOUNT_STAKING, stakingSaga);
  yield takeLatest(APP_ACCOUNT_UNSTAKING, unstakeSaga);
}