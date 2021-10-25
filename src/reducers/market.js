import { createSlice } from '@reduxjs/toolkit';

export const marketSlice = createSlice({
  name: 'market',
  initialState: {
    price: {},
  },
  reducers: {

  }
})

export const { } = marketSlice.actions;

export default marketSlice.reducer;