import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    // Import page's loading status and result
    importLoading: false,
    importError: null,
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
  }
})

export const { initStatus, setImportStatus } = loadingSlice.actions;

export default loadingSlice.reducer;