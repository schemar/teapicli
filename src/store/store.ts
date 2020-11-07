import { combineReducers } from "redux";
import { configureStore } from "@reduxjs/toolkit";

import collectionReducer from "./collectionSlice";

export const store = configureStore({
  reducer: combineReducers({ collection: collectionReducer }),
});

export type RootState = ReturnType<typeof store.getState>;
