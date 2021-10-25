import { createSlice } from '@reduxjs/toolkit';

export const appSlice = createSlice({
  name: 'app',
  initialState: {
    accounts: [],
    currentAccount: {},
    viewFunctionAccount: {},
    lockupPassword: '',
  },
  reducers: {
  }
})

export const { } = appSlice.actions;

export default appSlice.reducer;