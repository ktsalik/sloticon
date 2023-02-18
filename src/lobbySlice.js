import { createSlice } from "@reduxjs/toolkit";

const lobbySlice = createSlice({
  name: 'lobby',
  initialState: {
    balance: -1,
  },
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export default lobbySlice;
