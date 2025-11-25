// Favorites service layer
// Currently uses localStorage, but structured to easily switch to API calls
// When database is available, replace localStorage calls with API calls

import type { LocalFavorite } from "../types/favorite";

const FAVORITES_KEY = "attraction_favorites";
// const USER_ID_KEY = "current_user_id"; // For future use with database

// Get current user ID (for future database integration)
// For now, returns a default or stored user ID
// const getCurrentUserId = (): string => {
//   if (typeof window === "undefined") return "default-user";

//   try {
//     const userId = localStorage.getItem(USER_ID_KEY);
//     return userId || "default-user";
//   } catch (error) {
//     console.error("Error reading user ID:", error);
//     return "default-user";
//   }
// };

// Get all favorites from localStorage
export const getFavorites = (): LocalFavorite[] => {
  if (typeof window === "undefined") return [];

  try {
    const favorites = localStorage.getItem(FAVORITES_KEY);
    return favorites ? JSON.parse(favorites) : [];
  } catch (error) {
    console.error("Error reading favorites from localStorage:", error);
    return [];
  }
};

// Get favorite IDs only (for backward compatibility)
export const getFavoriteIds = (): number[] => {
  const favorites = getFavorites();
  return favorites.map((fav) => fav.placeId);
};

// Check if a place is favorited
export const isFavorite = (placeId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some((fav) => fav.placeId === placeId);
};

// Add a favorite
export const addFavorite = (placeId: number, userCategory?: string): void => {
  if (typeof window === "undefined") return;

  try {
    const favorites = getFavorites();

    // Check if already favorited
    if (favorites.some((fav) => fav.placeId === placeId)) {
      // Update category if provided
      if (userCategory) {
        const updatedFavorites = favorites.map((fav) =>
          fav.placeId === placeId
            ? { ...fav, userCategory, createdAt: fav.createdAt }
            : fav
        );
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));
      }
      return;
    }

    // Add new favorite
    const newFavorite: LocalFavorite = {
      placeId,
      userCategory,
      createdAt: new Date().toISOString(),
    };

    favorites.push(newFavorite);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  } catch (error) {
    console.error("Error adding favorite to localStorage:", error);
  }
};

// Remove a favorite
export const removeFavorite = (placeId: number): void => {
  if (typeof window === "undefined") return;

  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.filter((fav) => fav.placeId !== placeId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  } catch (error) {
    console.error("Error removing favorite from localStorage:", error);
  }
};

// Toggle favorite status
export const toggleFavorite = (
  placeId: number,
  userCategory?: string
): boolean => {
  if (isFavorite(placeId)) {
    removeFavorite(placeId);
    return false;
  } else {
    addFavorite(placeId, userCategory);
    return true;
  }
};

// Update favorite category
export const updateFavoriteCategory = (
  placeId: number,
  userCategory: string
): void => {
  if (typeof window === "undefined") return;

  try {
    const favorites = getFavorites();
    const updatedFavorites = favorites.map((fav) =>
      fav.placeId === placeId
        ? { ...fav, userCategory, createdAt: fav.createdAt }
        : fav
    );
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updatedFavorites));

    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent("favoritesUpdated"));
  } catch (error) {
    console.error("Error updating favorite category:", error);
  }
};

// Get favorite by place ID
export const getFavoriteByPlaceId = (
  placeId: number
): LocalFavorite | undefined => {
  const favorites = getFavorites();
  return favorites.find((fav) => fav.placeId === placeId);
};

// ============================================================================
// Future Database Integration Functions (to be implemented when DB is ready)
// ============================================================================

// These functions will replace localStorage calls with API calls:

/*
export const getFavoritesFromDB = async (userId: string): Promise<Favorite[]> => {
  const response = await fetch(`/api/favorites?userId=${userId}`);
  if (!response.ok) throw new Error("Failed to fetch favorites");
  return response.json();
};

export const addFavoriteToDB = async (
  userId: string,
  placeId: string,
  userCategory?: string
): Promise<Favorite> => {
  const response = await fetch("/api/favorites", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, placeId, userCategory }),
  });
  if (!response.ok) throw new Error("Failed to add favorite");
  return response.json();
};

export const removeFavoriteFromDB = async (
  favoriteId: string
): Promise<void> => {
  const response = await fetch(`/api/favorites/${favoriteId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to remove favorite");
};
*/
