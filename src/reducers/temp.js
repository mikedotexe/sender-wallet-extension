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
      error: null,
      stakeAmount: 0,
      selectValidator: {},
    },
    unstakingConfirmDrawer: {
      display: false,
      unstakeAmount: 0,
      selectUnstakeValidator: {},
    },
    unstakingResultDrawer: {
      display: false,
      error: null,
      unstakeAmount: 0,
      selectUnstakeValidator: {},
    },
    swapResultDrawer: {
      display: false,
      error: null,
      swapAmount: 0,
      swapFrom: '',
      swapTo: '',
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

    setStakingResultDrawer: (state, action) => {
      const stakingResultDrawer = action.payload;
      state.stakingResultDrawer = { ...state.stakingResultDrawer, ...stakingResultDrawer };
    },

    setUnstakingConfirmDrawer: (state, action) => {
      const unstakingConfirmDrawer = action.payload;
      state.unstakingConfirmDrawer = { ...state.unstakingConfirmDrawer, ...unstakingConfirmDrawer };
    },

    setUnstakingResultDrawer: (state, action) => {
      const unstakingResultDrawer = action.payload;
      state.unstakingResultDrawer = { ...state.unstakingResultDrawer, ...unstakingResultDrawer };
    },

    setSwapResultDrawer: (state, action) => {
      const swapResultDrawer = action.payload;
      state.swapResultDrawer = { ...state.swapResultDrawer, ...swapResultDrawer };
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
  setStakingResultDrawer,
  setUnstakingConfirmDrawer,
  setUnstakingResultDrawer,
  setSwapResultDrawer,
  setTwoFaDrawer,
} = tempSlice.actions;

export default tempSlice.reducer;