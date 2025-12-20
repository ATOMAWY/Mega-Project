const API_URL = import.meta.env.VITE_API;

// Raw attraction coming from the backend API
type ApiAttraction = {
  placeId: string;
  name: string;
  description: string;
  fullDescription?: string;
  imageUrl?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  category?: string;
  costTier?: string;
  indoorOutdoor?: string;
  bestTimeOfDay?: string;
  avgVisitDurationMinutes?: number;
  rating?: number;
  website?: string;
  phoneNumber?: string | null;
  accessibilityInfo?: string;
  parkingInfo?: string;
  bestTimeToVisit?: string;
  visitorsPerYear?: number;
  vibeTags?: string[];
  operatingHours?: unknown;
  tripSlots?: unknown;
  alternateTripSlots?: unknown;
  nearby?: unknown;
  itineraries?: unknown;
  favorites?: unknown;
  reviews?: unknown;
  recommendationLogs?: unknown;
  activities?: string[];
  trendingTags?: string[];
};

// Normalised attraction used across the frontend
export type Attraction = {
  /** Synthetic numeric id used by the UI and favorites system */
  id: number;
  /** Backend place identifier (Guid) */
  placeId: string;
  title: string;
  description: string;
  fullDescription?: string;
  photo?: string;
  rating: number;
  category: string;
  /** Budget level label (mapped from costTier) */
  level: string;
  /** Distance label shown in cards – currently a friendly location string */
  distance: string;
  /** High-level area / district within the city */
  district?: string;
  /** Numeric price estimation used by recommendations sorting / filtering */
  price?: number;
  /** Approximate distance in KM – optional, used for sorting only */
  distanceKm?: number;
  /** Mapped from vibeTags */
  moods?: string[];
  /** Mapped from activities */
  activityTypes?: string[];
  /** Additional place metadata surfaced in details page */
  website?: string;
  phoneNumber?: string | null;
  accessibilityInfo?: string;
  parkingInfo?: string;
  bestTimeToVisit?: string;
  indoorOutdoor?: string;
  bestTimeOfDay?: string;
  avgVisitDurationMinutes?: number;
  /** Optional favorite status (used in favorites page) */
  isFavorite?: boolean;
  /** Optional favorite metadata (used in favorites page) */
  favoriteData?: {
    placeId: number;
    userCategory?: string;
    createdAt: string;
  };
  /** Keep the original API object around in case we need extra fields */
  raw: ApiAttraction;
};

const mapCostTierToPrice = (costTier?: string): number | undefined => {
  if (!costTier) return undefined;

  switch (costTier.toLowerCase()) {
    case "low":
      return 200;
    case "medium":
      return 500;
    case "high":
      return 1000;
    default:
      return undefined;
  }
};

const normaliseImageUrl = (rawUrl?: string): string | undefined => {
  if (!rawUrl) return undefined;

  const trimmed = rawUrl.trim();
  if (!trimmed) return undefined;

  // If it's already an absolute URL, optionally rewrite it to go through the dev proxy
  if (/^https?:\/\//i.test(trimmed)) {
    try {
      const absolute = new URL(trimmed);

      // If we're using a Vite proxy (API_URL starts with "/") and this URL already
      // points at our backend origin, rewrite it so the browser calls the proxy
      if (API_URL?.startsWith("/") && absolute.origin === API_URL) {
        const base = API_URL.replace(/\/$/, "");
        return `${base}${absolute.pathname}${absolute.search}${absolute.hash}`;
      }

      return trimmed;
    } catch {
      return trimmed;
    }
  }

  // Otherwise treat it as a path on the backend API host
  try {
    if (!API_URL) return trimmed;
    const resolved = new URL(trimmed, API_URL);
    return resolved.href;
  } catch {
    return trimmed;
  }
};

const mapApiToAttraction = (
  apiAttraction: ApiAttraction,
  index: number
): Attraction => {
  const {
    placeId,
    name,
    description,
    fullDescription,
    imageUrl,
    district,
    category,
    costTier,
    rating,
    vibeTags,
    activities,
    website,
    phoneNumber,
    accessibilityInfo,
    parkingInfo,
    bestTimeToVisit,
    indoorOutdoor,
    bestTimeOfDay,
    avgVisitDurationMinutes,
  } = apiAttraction;

  const safeRating = typeof rating === "number" ? rating : 0;

  return {
    id: index + 1, // synthetic id used internally
    placeId,
    title: name,
    description:
      description ||
      fullDescription ||
      "No description available at the moment.",
    fullDescription,
    photo: normaliseImageUrl(imageUrl),
    rating: safeRating,
    category: category || "Attraction",
    level: costTier || "Varies",
    // We don't get real distance from the API yet, so show the district / area
    distance: district || "Cairo",
    district,
    price: mapCostTierToPrice(costTier),
    // No real distance data yet – can be wired once backend exposes it
    distanceKm: undefined,
    moods: Array.isArray(vibeTags) ? vibeTags : [],
    activityTypes: Array.isArray(activities) ? activities : [],
    website,
    phoneNumber: phoneNumber ?? null,
    accessibilityInfo,
    parkingInfo,
    bestTimeToVisit,
    indoorOutdoor,
    bestTimeOfDay,
    avgVisitDurationMinutes,
    raw: apiAttraction,
  };
};

// Cache for fetched attractions
let attractionsCache: Attraction[] | null = null;
let attractionsPromise: Promise<Attraction[]> | null = null;

// Async function to fetch attractions from API
export const fetchAttractions = async (): Promise<Attraction[]> => {
  // Return cached data if available
  if (attractionsCache) {
    return attractionsCache;
  }

  // Return existing promise if fetch is in progress
  if (attractionsPromise) {
    return attractionsPromise;
  }

  // Start new fetch
  attractionsPromise = (async () => {
    try {
      const response = await fetch(`${API_URL}/api/places`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.error("Error fetching attractions data:", response.statusText);
        throw new Error(`Failed to fetch attractions: ${response.statusText}`);
      }

      const data: unknown = await response.json();

      const attractions = Array.isArray(data)
        ? data.map((item, index) =>
            mapApiToAttraction(item as ApiAttraction, index)
          )
        : [];

      attractionsCache = attractions;
      return attractions;
    } catch (error) {
      console.error("Error fetching attractions from API:", error);
      console.warn("Using empty array as fallback. Please check:");
      console.warn("1. Backend server is running at", API_URL);
      console.warn("2. CORS is properly configured on the backend");
      console.warn("3. API endpoint is correct:", `${API_URL}/api/places`);
      attractionsCache = [];
      return [];
    } finally {
      attractionsPromise = null;
    }
  })();

  return attractionsPromise;
};

// Export empty array initially (non-blocking)
// Components should use fetchAttractions() to get data
export const attractions: Attraction[] = [];
