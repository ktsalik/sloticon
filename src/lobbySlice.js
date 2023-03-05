import { createSlice } from "@reduxjs/toolkit";

const lobbySlice = createSlice({
  name: 'lobby',
  initialState: {
    loggedIn: false,
    username: null,
    balance: -1,
  },
  reducers: {
    updateLoginState: (state, action) => {
      state.loggedIn = action.payload.status === 'logged-in';
      state.username = action.payload.username;
    },
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
});

export default lobbySlice;
