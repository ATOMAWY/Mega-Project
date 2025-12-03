import { useMemo, useState, useEffect } from "react";
import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import FilterRecommendations from "./../components/Filter Recommendations/FilterRecommendations";
import RecommendedCards from "./../components/Recommended Cards/RecommendedCards";
import { attractions as staticAttractions } from "../data/attractions";

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
  const [allAttractions] = useState(staticAttractions);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("rating-desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAttractions = useMemo(() => {
    let list = [...allAttractions];

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
            itemTier &&
            itemTier.toLowerCase() === selectedTier.toLowerCase()
          );
        });

      // Filter by moods (matching /api/Places/vibe endpoint)
      // Check if any selected mood matches any mood in the item's moods array (case-insensitive)
      const matchesMoods =
        !filters.selectedMoods.length ||
        (Array.isArray(item.moods) &&
          item.moods.some((m: string) =>
            filters.selectedMoods.some(
              (selectedMood: string) =>
                m.toLowerCase() === selectedMood.toLowerCase()
            )
          ));

      // Filter by category (matching /api/Places/category endpoint)
      const matchesActivityTypes =
        !filters.selectedActivityTypes.length ||
        (item.category &&
          filters.selectedActivityTypes.some((selectedCategory: string) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase()
          ));

      // Filter by Indoor/Outdoor (matching /api/Places/weather endpoint)
      const matchesIndoorOutdoor =
        !filters.selectedIndoorOutdoor.length ||
        (item.indoorOutdoor &&
          filters.selectedIndoorOutdoor.some((selectedOption: string) =>
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

    return list;
  }, [allAttractions, filters, sortOption]);

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
          Personalized Recommendations
        </h1>
        <p className="text-lg mb-6 text-gray-500">
          Discover amazing attractions in Cairo and Giza tailored to your
          preferences.
        </p>
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
