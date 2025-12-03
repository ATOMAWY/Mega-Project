const API_URL = import.meta.env.VITE_API;

type PlaceVibeTag = {
  placeVibeTagId: string;
  placeId: string;
  value: string;
};

// Cache for vibe tags by placeId
const vibeTagsCache = new Map<string, string[]>();
const vibeTagsPromises = new Map<string, Promise<string[]>>();

/**
 * Fetches vibe tags for a specific place using the API endpoint
 * @param placeId - The UUID of the place
 * @returns Promise<string[]> - Array of vibe tag values (e.g., ["Family", "Photography"])
 */
export const fetchVibeTagsForPlace = async (
  placeId: string
): Promise<string[]> => {
  // Return cached data if available
  if (vibeTagsCache.has(placeId)) {
    return vibeTagsCache.get(placeId)!;
  }

  // Return existing promise if fetch is in progress
  if (vibeTagsPromises.has(placeId)) {
    return vibeTagsPromises.get(placeId)!;
  }

  // Start new fetch
  const promise = (async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/PlaceVibeTag/place/${placeId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (!response.ok) {
        console.warn(
          `Error fetching vibe tags for place ${placeId}:`,
          response.statusText
        );
        // Return empty array on error instead of throwing
        vibeTagsCache.set(placeId, []);
        return [];
      }

      const data: unknown = await response.json();
      const vibeTags: PlaceVibeTag[] = Array.isArray(data) ? data : [];

      // Extract just the values
      const values = vibeTags.map((tag) => tag.value);

      vibeTagsCache.set(placeId, values);
      return values;
    } catch (error) {
      console.error(
        `Error fetching vibe tags for place ${placeId} from API:`,
        error
      );
      // Cache empty array to avoid repeated failed requests
      vibeTagsCache.set(placeId, []);
      return [];
    } finally {
      vibeTagsPromises.delete(placeId);
    }
  })();

  vibeTagsPromises.set(placeId, promise);
  return promise;
};

/**
 * Fetches vibe tags for multiple places in parallel
 * @param placeIds - Array of place UUIDs
 * @returns Promise<Map<string, string[]>> - Map of placeId to vibe tag values
 */
export const fetchVibeTagsForPlaces = async (
  placeIds: string[]
): Promise<Map<string, string[]>> => {
  // Filter out already cached placeIds
  const uncachedPlaceIds = placeIds.filter((id) => !vibeTagsCache.has(id));

  // Fetch all uncached places in parallel
  if (uncachedPlaceIds.length > 0) {
    await Promise.all(
      uncachedPlaceIds.map((placeId) => fetchVibeTagsForPlace(placeId))
    );
  }

  // Build result map from cache
  const result = new Map<string, string[]>();
  placeIds.forEach((placeId) => {
    result.set(placeId, vibeTagsCache.get(placeId) || []);
  });

  return result;
};

