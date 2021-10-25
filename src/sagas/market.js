import {
  takeLatest,
  call,
  put,
} from 'redux-saga/effects';
import _ from 'lodash';

import { MARKET_UPDATE_PRICE } from '../actions/market';
import apiHelper from '../apiHelper';
import { updateMarket } from '../reducers/market';

function* updateMarketSaga(action) {
  const { tokens } = action;
  try {
    const res = yield call(apiHelper.getCurrencyQuote, tokens);
    const currencyQuote = res.data.data;
    const symbols = _.keys(currencyQuote);
    const prices = {};
    _.forEach(symbols, symbol => {
      prices[symbol] = currencyQuote[symbol].quote.USD.price;
    })
    yield put(updateMarket(prices));
  } catch (error) {
    console.log('update market error: ', error);
  }
}

export default function* marketSagas() {
  yield takeLatest(MARKET_UPDATE_PRICE, updateMarketSaga);
}