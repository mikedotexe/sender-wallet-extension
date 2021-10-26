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
  }
})

export const { initStatus, setImportStatus, setSendStatus } = loadingSlice.actions;

export default loadingSlice.reducer;