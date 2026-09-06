import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { api } from "../services/api.js";
import authReducer from "../features/auth/authSlice.js";
import uiReducer from "../features/ui/uiSlice.js";
import devLogReducer from "../features/devtools/devLogSlice.js";

// Endpoint modules inject themselves into `api` on import, so they must be
// loaded before the store is consumed.
import "../services/endpoints/auth.api.js";
import "../services/endpoints/users.api.js";
import "../services/endpoints/projects.api.js";
import "../services/endpoints/members.api.js";
import "../services/endpoints/tasks.api.js";
import "../services/endpoints/comments.api.js";
import "../services/endpoints/attachments.api.js";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    auth: authReducer,
    ui: uiReducer,
    devLog: devLogReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

setupListeners(store.dispatch);
