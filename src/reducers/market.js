import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

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