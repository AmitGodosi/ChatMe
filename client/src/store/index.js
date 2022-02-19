import { createSlice, configureStore } from "@reduxjs/toolkit";

const initialState = { users: "", friends: "" };

const querySlice = createSlice({
  name: "QuarySlice",
  initialState,
  reducers: {
    users(state, actions) {
      state.users = actions.payload;
    },
    friends(state, actions) {
      state.friends = actions.payload;
    },
  },
});

const store = configureStore({
  reducer: querySlice.reducer,
});

export const queryActions = querySlice.actions;

export default store;
