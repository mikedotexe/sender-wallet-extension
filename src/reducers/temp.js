import { createSlice } from '@reduxjs/toolkit';

export const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    selectToken: 'NEAR',
  },
  reducers: {
    setSelectToken: (state, action) => {
      const selectToken = action.payload;
      state.selectToken = selectToken;
    }
  }
})

export const { setSelectToken } = tempSlice.actions;

export default tempSlice.reducer;