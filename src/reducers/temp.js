import { createSlice } from '@reduxjs/toolkit';

export const tempSlice = createSlice({
  name: 'temp',
  initialState: {
    bottomTabValue: 0,
    selectToken: 'NEAR',
    selectValidator: '',
  },
  reducers: {
    setBottomTabValue: (state, action) => {
      const bottomTabValue = action.payload;
      state.bottomTabValue = bottomTabValue;
    },
    setSelectToken: (state, action) => {
      const selectToken = action.payload;
      state.selectToken = selectToken;
    },
    setSelectValidator: (state, action) => {
      const selectValidator = action.payload;
      state.selectValidator = selectValidator;
    }
  }
})

export const { setBottomTabValue, setSelectToken, setSelectValidator } = tempSlice.actions;

export default tempSlice.reducer;