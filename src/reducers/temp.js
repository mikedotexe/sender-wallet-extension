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
    stakingConfirmDrawer: {
      display: false,
      stakeAmount: 0,
      selectValidator: {},
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
    swapConfirmDrawer: {
      display: false,
      swapAmount: 0,
      swapFrom: '',
      swapTo: '',
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
      method: '',
      error: null,
      loading: false,
      requestId: null,
    },
    networkResultDrawer: {
      display: false,
      error: null,
      loading: false,
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

    setStakingConfirmDrawer: (state, action) => {
      const stakingConfirmDrawer = action.payload;
      state.stakingConfirmDrawer = { ...state.stakingConfirmDrawer, ...stakingConfirmDrawer };
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

    setSwapConfirmDrawer: (state, action) => {
      const swapConfirmDrawer = action.payload;
      state.swapConfirmDrawer = { ...state.swapConfirmDrawer, ...swapConfirmDrawer };
    },

    setSwapResultDrawer: (state, action) => {
      const swapResultDrawer = action.payload;
      state.swapResultDrawer = { ...state.swapResultDrawer, ...swapResultDrawer };
    },

    setTwoFaDrawer: (state, action) => {
      const twoFaDrawer = action.payload;
      state.transferConfirmDrawer = { ...state.transferConfirmDrawer, display: false };
      state.transferResultDrawer = { ...state.transferResultDrawer, display: false };
      state.stakingResultDrawer = { ...state.stakingResultDrawer, display: false };
      state.unstakingConfirmDrawer = { ...state.unstakingConfirmDrawer, display: false };
      state.unstakingResultDrawer = { ...state.unstakingResultDrawer, display: false };
      state.swapResultDrawer = { ...state.swapResultDrawer, display: false };
      state.twoFaDrawer = { ...state.twoFaDrawer, ...twoFaDrawer };
    },

    setNetworkResultDrawer: (state, action) => {
      const networkResultDrawer = action.payload;
      state.networkResultDrawer = { ...state.networkResultDrawer, ...networkResultDrawer };
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
  setStakingConfirmDrawer,
  setStakingResultDrawer,
  setUnstakingConfirmDrawer,
  setUnstakingResultDrawer,
  setSwapConfirmDrawer,
  setSwapResultDrawer,
  setTwoFaDrawer,
  setNetworkResultDrawer,
} = tempSlice.actions;

export default tempSlice.reducer;