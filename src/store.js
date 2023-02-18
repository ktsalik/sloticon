import { configureStore } from "@reduxjs/toolkit";
import lobbySlice from "./lobbySlice";

const store = configureStore({
  reducer: {
    lobby: lobbySlice.reducer,
  },
});

export default store;
