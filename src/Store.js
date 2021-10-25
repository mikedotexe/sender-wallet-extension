import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import createChromeStorage from 'redux-persist-chrome-storage';
import createSagaMiddleware from 'redux-saga';
import logger from 'redux-logger';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { createHashHistory } from 'history';

import appReducer from './reducers/app';
import marketReducer from './reducers/market';
import loadingReducer from './reducers/loading';

import appSaga from './sagas/app';
import marketSaga from './sagas/market';

const storage = createChromeStorage(window.chrome, 'sync');

const config = {
  key: 'root',
  storage,
  blacklist: ['loading'],
  stateReconciler: autoMergeLevel2,
}

export const history = createHashHistory();

const reducer = combineReducers({
  router: connectRouter(history),
  app: appReducer,
  market: marketReducer,
  loading: loadingReducer,
});

const persistedReducer = persistReducer(config, reducer);

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }).concat(sagaMiddleware).concat(logger).concat(routerMiddleware(history)),
});
export const persistor = persistStore(store);

sagaMiddleware.run(appSaga);
sagaMiddleware.run(marketSaga);
