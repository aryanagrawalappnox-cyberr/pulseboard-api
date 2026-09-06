import { createSlice } from "@reduxjs/toolkit";

const MAX_ENTRIES = 50;

let nextId = 0;

const devLogSlice = createSlice({
  name: "devLog",
  initialState: {
    entries: [],
    isOpen: false,
  },
  reducers: {
    logRequest: {
      reducer(state, action) {
        // Newest first, capped so a long session cannot grow unbounded.
        state.entries.unshift(action.payload);
        state.entries.splice(MAX_ENTRIES);
      },
      prepare(entry) {
        nextId += 1;
        return { payload: { id: nextId, at: Date.now(), ...entry } };
      },
    },
    clearLog(state) {
      state.entries = [];
    },
    togglePanel(state) {
      state.isOpen = !state.isOpen;
    },
    setPanelOpen(state, action) {
      state.isOpen = action.payload;
    },
  },
});

export const { logRequest, clearLog, togglePanel, setPanelOpen } = devLogSlice.actions;

export const selectDevLogEntries = (state) => state.devLog.entries;
export const selectDevPanelOpen = (state) => state.devLog.isOpen;

export default devLogSlice.reducer;
