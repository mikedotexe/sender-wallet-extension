import { createSlice } from '@reduxjs/toolkit';
import { DEFAULT_MAINNET_RPC, DEFAULT_TESTNET_RPC } from '../config/rpc';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    accounts: [],
    currentAccount: {},
    viewFunctionAccount: {},
    lockupPassword: '',
    isLockup: false,
    salt: '',
    pendingRequests: [],
    rpcs: [
      DEFAULT_MAINNET_RPC,
      DEFAULT_TESTNET_RPC,
    ],
    currentRpc: {
      'mainnet': DEFAULT_MAINNET_RPC,
      'testnet': DEFAULT_TESTNET_RPC,
    },
  },
  reducers: {
    setSalt: (state, action) => {
      const salt = action.payload;
      state.salt = salt;
    },
    setPassword: (state, action) => {
      const password = action.payload;
      state.lockupPassword = password;
    },
    setLockup: (state, action) => {
      const status = action.payload;
      state.isLockup = status;
    },
    addAccount: (state, action) => {
      const account = action.payload;
      state.accounts = [...state.accounts, account]
      state.currentAccount = account;
    },
    changeAccount: (state, action) => {
      const account = action.payload;
      state.currentAccount = account;
    },
    updateAccounts: (state, action) => {
      const accounts = action.payload;
      state.accounts = accounts;
    },
    setPendingRequests: (state, action) => {
      const pendingRequests = action.payload;
      state.pendingRequests = pendingRequests;
    },
    setRpcs: (state, action) => {
      const rpcs = action.payload;
      state.rpcs = rpcs;
    },
    changeRpc: (state, action) => {
      const { rpc, network } = action.payload;
      state.currentRpc = { ...state.currentRpc, [network]: rpc };
    }
  }
})

export const { setSalt, setPassword, setLockup, addAccount, changeAccount, updateAccounts, setPendingRequests, setRpcs, changeRpc } = appSlice.actions;

export default appSlice.reducer;