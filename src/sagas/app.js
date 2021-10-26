import {
  put,
  select,
  takeLatest,
  call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { push } from 'connected-react-router';

import { setImportStatus } from '../reducers/loading';
import { APP_IMPORT_ACCOUNT, APP_SET_PASSWORD, APP_UPDATE_ACCOUNT } from '../actions/app';
import { getAppStore } from './';
import { formatAccount } from '../utils';
import { addAccount, changeAccount, setPassword, setSalt, updateAccounts } from '../reducers/app';
import passwordHash from '../core/passwordHash';
import { getSigner, nearService } from '../core/near';

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
    yield put(setImportStatus({ loading: false, error }));
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
      tokens: [{ symbol: 'NEAR', name: 'NEAR', balance: balance.available }, ...tokens],
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

export default function* appSagas() {
  yield takeLatest(APP_SET_PASSWORD, setPasswordSaga);
  yield takeLatest(APP_IMPORT_ACCOUNT, importAccountSaga);
  yield takeLatest(APP_UPDATE_ACCOUNT, updateAccountSaga);
}