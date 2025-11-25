// Backward compatibility wrapper for favorites service
// This file maintains compatibility with existing code while using the new service layer
// Eventually, all code should migrate to use services/favoritesService directly

import {
  getFavoriteIds,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
} from "../services/favoritesService";

// Export getFavoriteIds as getFavorites for backward compatibility
// Old code expected getFavorites() to return number[]
export const getFavorites = (): number[] => {
  return getFavoriteIds();
};

export { addFavorite, removeFavorite, isFavorite, toggleFavorite };
