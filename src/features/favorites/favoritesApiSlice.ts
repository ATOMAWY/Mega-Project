import { apiSlice } from "../../app/api/apiSlice";

// API response types matching backend
interface FavoriteResponse {
  favoriteId: string;
  userId: string;
  placeId: string;
  userCategory: string | null;
  createdAt: string;
  user: any;
  place: any;
}

// Request body for adding a favorite
interface AddFavoriteRequest {
  userId: string;
  placeId: string;
}

export const favoritesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Get all favorites for a user
    getUserFavorites: builder.query<FavoriteResponse[], string>({
      query: (userId) => `/api/Favorites/user/${userId}`,
      providesTags: (result) => 
        result
          ? [...result.map(({ favoriteId }) => ({ type: "Favorites" as const, id: favoriteId })), "Favorites"]
          : ["Favorites"],
      keepUnusedDataFor: 0, // Don't cache - always fetch fresh
    }),

    // Check if a place is favorited
    checkFavorite: builder.query<{ isFavorite: boolean }, { userId: string; placeId: string }>({
      query: ({ userId, placeId }) =>
        `/api/Favorites/check?userId=${userId}&placeId=${placeId}`,
      providesTags: (_result, _error, { placeId }) => [
        { type: "Favorites", id: placeId },
      ],
    }),

    // Add a favorite
    addFavorite: builder.mutation<FavoriteResponse, AddFavoriteRequest>({
      query: (body) => ({
        url: "/api/Favorites",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Favorites"], // Invalidate all favorites to force refetch
    }),

    // Remove a favorite
    removeFavorite: builder.mutation<void, { userId: string; placeId: string }>({
      query: ({ userId, placeId }) => ({
        url: `/api/Favorites?UserId=${userId}&PlaceId=${placeId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Favorites"], // Invalidate all favorites to force refetch
    }),
  }),
});

export const {
  useGetUserFavoritesQuery,
  useCheckFavoriteQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
} = favoritesApiSlice;
