import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { apiSlice } from "../api/apiSlice";
import { authReducer } from "./auth/authSlice";
import { favoriteReducer } from "./favorites/favoriteSlice";
import { getFavoritesFromLocalStorage } from "../Utils/localStorage";
import cartSliceReducer from "./cart/cartSlice";
import shopReducer from "./shop/shopSlice";

const initialFavorites = getFavoritesFromLocalStorage() || [];

export const store = configureStore({
  reducer: {    
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    favorites: favoriteReducer,
    cart: cartSliceReducer,
    shop: shopReducer,
  },
  preloadedState: {
    favorites: {
      favorites: initialFavorites,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(apiSlice.middleware),
    devTools: true,
});
setupListeners(store.dispatch);