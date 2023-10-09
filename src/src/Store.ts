import { configureStore } from "@reduxjs/toolkit";
import { useSelector as rawUseSelector, TypedUseSelectorHook } from 'react-redux';
import UserReducer from "./reducers/UserReducer";
import OrderReducer from "./reducers/OrderReducer";
import ProcessReducer from "./reducers/ProcessReducer";
import WorkReducer from "./reducers/WorkReducer";


export const store = configureStore({
  reducer: {
    user: UserReducer,
    order: OrderReducer,
    process: ProcessReducer,
    work: WorkReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false  // FIXME: non-serializable...のエラー対策、本当は良くないけど、ひとまずこれで黙らせる
    })
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;