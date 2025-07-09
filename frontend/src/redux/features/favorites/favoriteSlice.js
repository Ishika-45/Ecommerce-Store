import { createSlice } from "@reduxjs/toolkit";

const favoriteSLice = createSlice({
    name: "favorites",
    initialState: {
        favorites: [],
    },
    reducers: {
        addToFavorites: (state, action) => {
            if (!state.favorites.some(product => product._id === action.payload._id)) {
                state.favorites.push(action.payload);
            }
        },
        removeFromFavorites: (state, action) => {
            return state.filter((product) => product._id !== action.payload._id);
        },
        setFavorites: (state, action) => {
            return action.payload;
        }
    }
});

export const { addToFavorites, removeFromFavorites, setFavorites } = favoriteSLice.actions;
export const selectFavoriteProduct = (state) => state.favorites.favorites;
export default favoriteSLice.reducer;

