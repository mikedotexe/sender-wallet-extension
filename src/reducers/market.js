import { createSlice } from '@reduxjs/toolkit';

export const marketSlice = createSlice({
  name: 'market',
  initialState: {
    prices: {},
  },
  reducers: {
    updateMarket: (state, action) => {
      const prices = action.payload;
      state.prices = { ...state.prices, ...prices };
    },
  }
})

export const { updateMarket } = marketSlice.actions;

export default marketSlice.reducer;