import {
  put,
  select,
  takeLatest,
  call,
} from 'redux-saga/effects';
import _ from 'lodash';
import { push } from 'connected-react-router';

import { setImportStatus } from '../reducers/loading';
import { APP_IMPORT_ACCOUNT } from '../actions/app';
import { getAppStore } from './';
import { formatAccount } from '../utils';
import { addAccount } from '../reducers/app';

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

export default function* appSagas() {
  yield takeLatest(APP_IMPORT_ACCOUNT, importAccountSaga);
}