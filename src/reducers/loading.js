import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    // Import page's loading status and result
    importLoading: false,
    importError: null,
  },
  reducers: {
    setImportStatus: (state, { payload: { loading, error } }) => {
      state.importLoading = loading;
      state.importError = error;
    },
  }
})

export const { setImportStatus } = loadingSlice.actions;

export default loadingSlice.reducer;