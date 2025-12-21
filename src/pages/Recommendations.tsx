import { useMemo, useState, useEffect } from "react";
import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import FilterRecommendations from "./../components/Filter Recommendations/FilterRecommendations";
import RecommendedCards from "./../components/Recommended Cards/RecommendedCards";
import { fetchAttractions, type Attraction } from "../data/attractions";
import { fetchVibeTagsForPlaces } from "../services/vibeTagsService";
import type { MLRecommendation } from "../features/recommendations/recommendationsApiSlice";

type SortOption =
  | "rating-desc"
  | "rating-asc"
  | "budget-desc"
  | "budget-asc"
  | "distance-asc";

type FilterState = {
  selectedCostTiers: string[];
  selectedMoods: string[];
  selectedActivityTypes: string[];
  selectedIndoorOutdoor: string[];
  minRating: number;
};

const DEFAULT_FILTERS: FilterState = {
  selectedCostTiers: [],
  selectedMoods: [],
  selectedActivityTypes: [],
  selectedIndoorOutdoor: [],
  minRating: 1,
};

const ITEMS_PER_PAGE = 12;

const Recommendations = () => {
  // In the future this can be replaced with data from an API / database.
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);
  const [mlRecommendations, setMlRecommendations] = useState<MLRecommendation[]>([]);
  const [matchedAttractions, setMatchedAttractions] = useState<Attraction[]>([]);
  const [vibeTagsMap, setVibeTagsMap] = useState<Map<string, string[]>>(
    new Map()
  );
  const [_, setLoadingVibeTags] = useState(false);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);
  const [isUsingMLRecommendations, setIsUsingMLRecommendations] = useState(false);

  // Load ML recommendations from sessionStorage
  useEffect(() => {
    const storedRecommendations = sessionStorage.getItem("mlRecommendations");
    if (storedRecommendations) {
      try {
        const parsed = JSON.parse(storedRecommendations);
        console.log("Loaded ML recommendations:", parsed.length);
        console.log("First recommendation structure:", parsed[0]);
        
        // Validate the data structure
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMlRecommendations(parsed);
          setIsUsingMLRecommendations(true);
        } else {
          console.error("Invalid ML recommendations data:", parsed);
        }
      } catch (error) {
        console.error("Error parsing ML recommendations:", error);
        sessionStorage.removeItem("mlRecommendations"); // Clean up invalid data
      }
    }
  }, []);

  // Fetch attractions
  useEffect(() => {
    fetchAttractions().then(setAllAttractions);
  }, []);

  // Match ML recommendations with full place data from Places API
  useEffect(() => {
    if (mlRecommendations.length > 0 && allAttractions.length > 0) {
      console.log("Matching ML recommendations with Places API...");
      console.log("Sample ML recommendation:", mlRecommendations[0]);
      console.log("Sample attraction:", allAttractions[0]);
      
      // Create a map of lowercase names to attractions for faster lookup
      // The normalized Attraction type uses 'title' instead of 'name'
      const attractionsByName = new Map<string, Attraction>();
      allAttractions.forEach((attr) => {
        if (attr.title) {
          const normalizedName = attr.title.toLowerCase().trim();
          attractionsByName.set(normalizedName, attr);
        }
      });
      
      console.log(`Built lookup map with ${attractionsByName.size} attractions`);
      
      // Match recommendations by name
      const matched: Attraction[] = [];
      mlRecommendations.forEach((rec) => {
        // Safety check for rec.Name
        if (!rec || !rec.Name) {
          console.warn("Invalid recommendation object:", rec);
          return;
        }
        
        const normalizedRecName = rec.Name.toLowerCase().trim();
        const matchedAttr = attractionsByName.get(normalizedRecName);
        
        if (matchedAttr) {
          // Add ML score to the attraction for sorting
          matched.push({
            ...matchedAttr,
            mlScore: rec.Final_Score || 0,
          });
          console.log(`✓ Matched: ${rec.Name} -> ${matchedAttr.title}`);
        } else {
          console.warn(`✗ No match found for: ${rec.Name}`);
        }
      });
      
      // Sort by ML score (highest first)
      matched.sort((a: any, b: any) => (b.mlScore || 0) - (a.mlScore || 0));
      
      setMatchedAttractions(matched);
      console.log(`Matched ${matched.length} out of ${mlRecommendations.length} recommendations`);
    }
  }, [mlRecommendations, allAttractions]);

  // Fetch vibe tags for attractions when they're loaded
  useEffect(() => {
    const attractionsToFetch = isUsingMLRecommendations && matchedAttractions.length > 0
      ? matchedAttractions
      : allAttractions;
      
    if (attractionsToFetch.length > 0) {
      setLoadingVibeTags(true);
      const placeIds = attractionsToFetch.map((attr) => attr.placeId);
      fetchVibeTagsForPlaces(placeIds)
        .then(setVibeTagsMap)
        .finally(() => setLoadingVibeTags(false));
    }
  }, [allAttractions, matchedAttractions, isUsingMLRecommendations]);

  const filteredAttractions = useMemo(() => {
    // Use ML-matched attractions if available, otherwise use all attractions
    const baseList = isUsingMLRecommendations && matchedAttractions.length > 0
      ? matchedAttractions
      : allAttractions;
    
    let list = [...baseList];

    // Apply filters
    list = list.filter((item: any) => {
      const matchesRating =
        typeof item.rating === "number" && item.rating >= filters.minRating;

      // Filter by cost tier (matching /api/Places/cost endpoint)
      // Check if any selected cost tier matches the item's level/costTier (case-insensitive)
      const matchesCostTier =
        !filters.selectedCostTiers.length ||
        filters.selectedCostTiers.some((selectedTier: string) => {
          // Check both level (normalized) and raw.costTier (from API)
          const itemTier =
            (item.level && item.level !== "Varies" ? item.level : null) ||
            item.raw?.costTier ||
            "";
          return (
            itemTier && itemTier.toLowerCase() === selectedTier.toLowerCase()
          );
        });

      // Filter by moods using /api/PlaceVibeTag/place/{placeId} endpoint
      // Get vibe tags from the API response (cached)
      const placeVibeTags = vibeTagsMap.get(item.placeId) || [];
      const matchesMoods =
        !filters.selectedMoods.length ||
        placeVibeTags.some((vibeTag: string) =>
          filters.selectedMoods.some(
            (selectedMood: string) =>
              vibeTag.toLowerCase() === selectedMood.toLowerCase()
          )
        );

      // Filter by category (matching /api/Places/category endpoint)
      const matchesActivityTypes =
        !filters.selectedActivityTypes.length ||
        (item.category &&
          filters.selectedActivityTypes.some(
            (selectedCategory: string) =>
              item.category.toLowerCase() === selectedCategory.toLowerCase()
          ));

      // Filter by Indoor/Outdoor (matching /api/Places/weather endpoint)
      const matchesIndoorOutdoor =
        !filters.selectedIndoorOutdoor.length ||
        (item.indoorOutdoor &&
          filters.selectedIndoorOutdoor.some(
            (selectedOption: string) =>
              item.indoorOutdoor.toLowerCase() === selectedOption.toLowerCase()
          ));

      return (
        matchesRating &&
        matchesCostTier &&
        matchesMoods &&
        matchesActivityTypes &&
        matchesIndoorOutdoor
      );
    });

    // Apply sorting
    // If using ML recommendations and no sort option selected, keep ML score order
    if (isUsingMLRecommendations && sortOption === "rating-desc" && matchedAttractions.length > 0) {
      // Keep the ML score order (already sorted when matched)
      // Don't re-sort
    } else {
      list.sort((a: any, b: any) => {
        switch (sortOption) {
          case "rating-asc":
            return (a.rating ?? 0) - (b.rating ?? 0);
          case "rating-desc":
            return (b.rating ?? 0) - (a.rating ?? 0);
          case "budget-asc":
            return (a.price ?? 0) - (b.price ?? 0);
          case "budget-desc":
            return (b.price ?? 0) - (a.price ?? 0);
          case "distance-asc":
            return (a.distanceKm ?? 0) - (b.distanceKm ?? 0);
          default:
            return 0;
        }
      });
    }

    return list;
  }, [allAttractions, matchedAttractions, filters, sortOption, vibeTagsMap, isUsingMLRecommendations]);

  // Reset to first page when filters or sort option changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filters, sortOption]);

  const totalPages = Math.ceil(filteredAttractions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAttractions = filteredAttractions.slice(startIndex, endIndex);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <div className="overflow-x-hidden">
      <NavBar />

      <div className="mx-4 sm:mx-6 lg:mx-20">
        <h1 className="text-3xl font-bold mt-8 mb-4">
          {isUsingMLRecommendations ? "AI-Powered Recommendations" : "Personalized Recommendations"}
        </h1>
        <p className="text-lg mb-6 text-gray-500">
          {isUsingMLRecommendations 
            ? `Discover ${matchedAttractions.length} AI-curated attractions tailored specifically for you based on your quiz results.`
            : "Discover amazing attractions in Cairo and Giza tailored to your preferences."
          }
        </p>
        {isUsingMLRecommendations && (
          <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-800">
              ✨ <strong>AI Recommendations Active:</strong> These places are ranked by our machine learning model based on your preferences.
              <button
                onClick={() => {
                  sessionStorage.removeItem("mlRecommendations");
                  setMlRecommendations([]);
                  setMatchedAttractions([]);
                  setIsUsingMLRecommendations(false);
                }}
                className="ml-2 text-orange-600 hover:text-orange-700 underline font-medium"
              >
                View all places instead
              </button>
            </p>
          </div>
        )}
      </div>

      <div className="flex justify-end items-end mx-4 sm:mx-6 lg:mx-20">
        <div className="flex w-full sm:w-auto">
          <select
            className="select select-bordered w-full max-w-xs"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
          >
            <option value="rating-desc">Rating: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="budget-desc">Budget: High to Low</option>
            <option value="budget-asc">Budget: Low to High</option>
            <option value="distance-asc">Distance: Nearest to Furthest</option>
          </select>
        </div>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-20 my-4 flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-auto">
          <FilterRecommendations
            filters={filters}
            onChange={setFilters}
            onReset={handleResetFilters}
          />
        </div>
        <div className="w-full lg:flex-1 min-w-0">
          <RecommendedCards
            attractions={paginatedAttractions}
            showCloseButton={true}
          />
        </div>
      </div>

      {totalPages > 1 && (
        <div className="mx-4 sm:mx-6 lg:mx-20 my-8 flex justify-center items-center gap-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className="btn btn-outline"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(totalPages, prev + 1))
            }
            disabled={currentPage === totalPages}
            className="btn btn-outline"
          >
            Next
          </button>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Recommendations;
