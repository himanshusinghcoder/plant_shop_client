import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productSlice from "./productSlice";
import layoutSlice from "./layoutSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import userSlice from "./userSlice";
import cartSlice from "./cartSlice";

const persistConfig = {
    key: 'plant_shop',
    blacklist: ['layout', 'product'],
    version: 1,
    storage,
}

const rootReducer = combineReducers({layout: layoutSlice, product: productSlice, user: userSlice, cart: cartSlice})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export let persistor = persistStore(store)
