import { useMemo, useState } from "react";
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
  budget: number;
  selectedMoods: string[];
  selectedActivityTypes: string[];
  minRating: number;
};

const DEFAULT_FILTERS: FilterState = {
  budget: 50000,
  selectedMoods: [],
  selectedActivityTypes: [],
  minRating: 1,
};

const Recommendations = () => {
  // In the future this can be replaced with data from an API / database.
  const [allAttractions] = useState(staticAttractions);
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sortOption, setSortOption] = useState<SortOption>("rating-desc");

  const filteredAttractions = useMemo(() => {
    let list = [...allAttractions];

    // Apply filters
    list = list.filter((item: any) => {
      const matchesRating =
        typeof item.rating === "number" && item.rating >= filters.minRating;

      const matchesBudget =
        typeof item.price === "number" ? item.price <= filters.budget : true;

      const matchesMoods =
        !filters.selectedMoods.length ||
        (Array.isArray(item.moods) &&
          item.moods.some((m: string) => filters.selectedMoods.includes(m)));

      const matchesActivityTypes =
        !filters.selectedActivityTypes.length ||
        (Array.isArray(item.activityTypes) &&
          item.activityTypes.some((a: string) =>
            filters.selectedActivityTypes.includes(a)
          ));

      return matchesRating && matchesBudget && matchesMoods && matchesActivityTypes;
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
            attractions={filteredAttractions}
            showCloseButton={true}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;
