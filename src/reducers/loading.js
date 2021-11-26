import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    // Import page's loading status and result
    importLoading: false,
    importError: null,

    // Check custom rpc is valid
    customRpcLoading: false,
    customRpcError: null,
  },
  reducers: {
    initStatus: (state) => {
      state.importLoading = false;
      state.importError = null;

      state.customRpcLoading = false;
      state.customRpcError = null;
    },
    setImportStatus: (state, { payload: { loading, error } }) => {
      state.importLoading = loading;
      state.importError = error;
    },
    setCustomRpcStatus: (state, { payload: { loading, error } }) => {
      state.customRpcLoading = loading;
      state.customRpcError = error;
    },
  }
})

export const { initStatus, setImportStatus, setCustomRpcStatus } = loadingSlice.actions;

export default loadingSlice.reducer;