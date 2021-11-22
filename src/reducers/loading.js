import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    // Import page's loading status and result
    importLoading: false,
    importError: null,

    // Swap page's loading status and result
    swapLoading: false,
    swapError: null,
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
    setSwapStatus: (state, { payload: { loading, error } }) => {
      state.swapLoading = loading;
      state.swapError = error;
    },
  }
})

export const { initStatus, setImportStatus, setSwapStatus } = loadingSlice.actions;

export default loadingSlice.reducer;