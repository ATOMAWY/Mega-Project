// Types for Favorite entity matching database structure
// These types will be used when integrating with the database

export interface Favorite {
  favoriteId: string; // Guid in database
  userId: string; // Guid in database
  placeId: string; // Guid in database
  userCategory?: string; // string(50) in database - optional category user assigns
  createdAt: Date;
}

// Extended favorite with place data for UI
export interface FavoriteWithPlace extends Favorite {
  place: {
    placeId: string;
    name: string;
    description: string;
    imageUrl?: string;
    category: string;
    rating: number;
    // Add other place fields as needed
  };
}

// Local storage favorite structure (simplified for now)
export interface LocalFavorite {
  placeId: number; // Using number for now, will be Guid string when DB integrated
  userCategory?: string;
  createdAt: string; // ISO date string
}

