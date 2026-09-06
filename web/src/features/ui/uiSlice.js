import { createSlice } from "@reduxjs/toolkit";

let nextId = 0;

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    toasts: [],
  },
  reducers: {
    toastPushed: {
      reducer(state, action) {
        state.toasts.push(action.payload);
      },
      prepare({ message, tone = "info" }) {
        nextId += 1;
        return { payload: { id: nextId, message, tone } };
      },
    },
    toastDismissed(state, action) {
      state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
    },
  },
});

export const { toastPushed, toastDismissed } = uiSlice.actions;

export const selectToasts = (state) => state.ui.toasts;

export default uiSlice.reducer;
