import { createSlice } from '@reduxjs/toolkit';

export const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    bottomTabValue: 0,
    selectToken: 'NEAR',
    selectValidator: { fee: {} },
    selectUnstakeValidator: { fee: {} },
    transferConfirmDrawer: {
      display: false,
      selectToken: {},
      sendAmount: 0,
      receiver: '',
    },
    transferResultDrawer: {
      display: false,
      selectToken: {},
      sendAmount: 0,
      receiver: '',
      error: null,
    },
    stakingResultDrawer: {
      display: false,
    },
    unstakingConfirmDrawer: {
      display: false,
    },
    unstakingResultDrawer: {
      display: false,
    },
    twoFaDrawer: {
      display: false,
      resolver: null,
      rejecter: null,
    },
  },
  reducers: {
    setBottomTabValue: (state, action) => {
      const bottomTabValue = action.payload;
      state.bottomTabValue = bottomTabValue;
    },
    setSelectToken: (state, action) => {
      const selectToken = action.payload;
      state.selectToken = selectToken;
    },
    setSelectValidator: (state, action) => {
      const selectValidator = action.payload;
      state.selectValidator = selectValidator;
    },
    setSelectUnstakeValidator: (state, action) => {
      const selectUnstakeValidator = action.payload;
      state.selectUnstakeValidator = selectUnstakeValidator;
    },

    setTransferConfirmDrawer: (state, action) => {
      const transferConfirmDrawer = action.payload;
      state.transferConfirmDrawer = { ...state.transferConfirmDrawer, ...transferConfirmDrawer };
    },

    setTransferResultDrawer: (state, action) => {
      const transferResultDrawer = action.payload;
      state.transferResultDrawer = { ...state.transferResultDrawer, ...transferResultDrawer };
    },

    setTwoFaDrawer: (state, action) => {
      const { display, resolver, rejecter } = action.payload;
      state.twoFaDrawer = { display, resolver, rejecter };
    }
  }
})

export const {
  setBottomTabValue,
  setSelectToken,
  setSelectValidator,
  setSelectUnstakeValidator,
  setTransferConfirmDrawer,
  setTransferResultDrawer,
  setTwoFaDrawer,
} = tempSlice.actions;

export default tempSlice.reducer;