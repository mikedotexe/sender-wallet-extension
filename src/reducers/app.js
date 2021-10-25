import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    accounts: [],
    currentAccount: {},
    viewFunctionAccount: {},
    lockupPassword: '',
    isLockup: false,
  },
  reducers: {
    addAccount: (state, action) => {
      const account = action.payload;
      state.accounts = [...state.accounts, account]
      state.currentAccount = account;
    },
  }
})

export const { addAccount } = appSlice.actions;

export default appSlice.reducer;