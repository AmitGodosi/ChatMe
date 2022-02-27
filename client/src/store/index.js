import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = { friendQuery: "", chats: [] };

const querySlice = createSlice({
  name: "QuarySlice",
  initialState,
  reducers: {
    setQuery(state, actions) {
      state.friendQuery = actions.payload;
    },
    setChats(state, actions) {
      state.chats = actions.payload;
    },
  },
});

const store = configureStore({
  reducer: querySlice.reducer,
});

export const queryActions = querySlice.actions;

export default store;
