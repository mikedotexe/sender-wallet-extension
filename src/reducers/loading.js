import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    // Import page's loading status and result
    importLoading: false,
    importError: null,

    // Send page's loading status and result
    sendLoading: false,
    sendError: null,

    // Staking page's loading status and result
    stakingLoading: false,
    stakingError: null,

    // Unstaking page's loading status and result
    unstakingLoading: false,
    unstakingError: null,
  },
  reducers: {
    initStatus: (state) => {
      state.importLoading = false;
      state.importError = null;
      state.sendLoading = false;
      state.sendError = null;
    },
    setImportStatus: (state, { payload: { loading, error } }) => {
      state.importLoading = loading;
      state.importError = error;
    },
    setSendStatus: (state, { payload: { loading, error } }) => {
      state.sendLoading = loading;
      state.sendError = error;
    },
    setStakingStatus: (state, { payload: { loading, error } }) => {
      state.stakingLoading = loading;
      state.stakingError = error;
    },
    setUnstakingStatus: (state, { payload: { loading, error } }) => {
      state.unstakingLoading = loading;
      state.unstakingError = error;
    },
  }
})

export const { initStatus, setImportStatus, setSendStatus, setStakingStatus, setUnstakingStatus } = loadingSlice.actions;

export default loadingSlice.reducer;