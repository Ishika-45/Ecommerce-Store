//Add a product
export const addToFavoritesToLocalStorage = (product) => {
  const favorites = getFavoritesFromLocalStorage();
  if(!favorites.some(item => item._id === product._id)) {
    favorites.push(product);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }
}

// Remove a product
export const removeFromFavoritesFromLocalStorage = (productId) => {
  const favorites = getFavoritesFromLocalStorage();
  const updatedFavorites = favorites.filter(item => item._id !== productId);
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
}

export const getFavoritesFromLocalStorage = () => {
  const favoritesJSON = localStorage.getItem("favorites");
  return favoritesJSON ? JSON.parse(favoritesJSON) : [];
}