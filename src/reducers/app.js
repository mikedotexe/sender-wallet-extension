import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    accounts: [],
    currentAccount: {},
    viewFunctionAccount: {},
    lockupPassword: '',
    isLockup: false,
    salt: '',
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
    }
  }
})

export const { setSalt, setPassword, setLockup, addAccount, changeAccount, updateAccounts } = appSlice.actions;

export default appSlice.reducer;