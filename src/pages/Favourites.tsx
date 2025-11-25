import { useState, useEffect, useMemo } from "react";
import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import RecommendedCards from "../components/Recommended Cards/RecommendedCards";
import { attractions } from "../data/attractions";
import {
  getFavorites,
  removeFavorite,
  updateFavoriteCategory,
} from "../services/favoritesService";
import type { LocalFavorite } from "../types/favorite";
import { FaHeart, FaFilter } from "react-icons/fa";

type SortOption = "newest" | "oldest" | "rating" | "name";
type FilterOption = "all" | string; // "all" or category name

const Favourites = () => {
  const [favorites, setFavorites] = useState<LocalFavorite[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");

  // Load favorites and listen for updates
  useEffect(() => {
    const loadFavorites = () => {
      const favs = getFavorites();
      setFavorites(favs);
    };

    loadFavorites();

    // Listen for storage changes (cross-tab)
    const handleStorageChange = () => {
      loadFavorites();
    };

    // Listen for custom event (same-tab)
    const handleFavoritesUpdated = () => {
      loadFavorites();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
    };
  }, []);

  // Get favorite attractions with their data
  const favoriteAttractions = useMemo(() => {
    const favoriteIds = favorites.map((fav) => fav.placeId);
    return attractions
      .filter((attraction) => favoriteIds.includes(attraction.id))
      .map((attraction) => {
        const favorite = favorites.find((fav) => fav.placeId === attraction.id);
        return {
          ...attraction,
          isFavorite: true,
          favoriteData: favorite,
        };
      });
  }, [favorites]);

  // Get unique categories from attractions
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    favoriteAttractions.forEach((att) => categories.add(att.category));
    return Array.from(categories).sort();
  }, [favoriteAttractions]);

  // Filter and sort favorites
  const filteredAndSortedFavorites = useMemo(() => {
    let filtered = favoriteAttractions;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((att) => att.category === selectedCategory);
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          const dateA = a.favoriteData?.createdAt
            ? new Date(a.favoriteData.createdAt).getTime()
            : 0;
          const dateB = b.favoriteData?.createdAt
            ? new Date(b.favoriteData.createdAt).getTime()
            : 0;
          return dateB - dateA;
        case "oldest":
          const dateAOld = a.favoriteData?.createdAt
            ? new Date(a.favoriteData.createdAt).getTime()
            : 0;
          const dateBOld = b.favoriteData?.createdAt
            ? new Date(b.favoriteData.createdAt).getTime()
            : 0;
          return dateAOld - dateBOld;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        case "name":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [favoriteAttractions, selectedCategory, sortBy]);

  // Handle remove favorite
  const handleRemoveFavorite = (placeId: number) => {
    if (
      window.confirm("Are you sure you want to remove this from favorites?")
    ) {
      removeFavorite(placeId);
    }
  };

  // Handle category update
  const handleCategoryUpdate = (placeId: number, category: string) => {
    updateFavoriteCategory(placeId, category);
    setEditingCategory(null);
    setNewCategory("");
  };

  // Handle category edit
  const handleCategoryEdit = (placeId: number, currentCategory?: string) => {
    setEditingCategory(placeId);
    setNewCategory(currentCategory || "");
  };

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col">
      <NavBar />

      <div className="flex-grow">
        <div className="mx-4 sm:mx-6 lg:mx-20">
          {/* Header Section */}
          <div className="mt-8 mb-6">
            <div className="flex items-center gap-3 mb-2">
              <FaHeart className="text-orange-400 text-3xl" />
              <h1 className="text-3xl font-bold">My Favourites</h1>
            </div>
            <p className="text-lg text-gray-500">
              {favoriteAttractions.length === 0
                ? "You haven't added any favorites yet. Start exploring and save your favorite places!"
                : `You have ${favoriteAttractions.length} favorite place${
                    favoriteAttractions.length !== 1 ? "s" : ""
                  } saved.`}
            </p>
          </div>

          {/* Filters and Sort Section */}
          {favoriteAttractions.length > 0 && (
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-4 mb-4">
                {/* Filter Toggle */}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="btn btn-outline flex items-center gap-2"
                >
                  <FaFilter />
                  Filters
                </button>

                {/* Category Filter */}
                {showFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Category:
                    </span>
                    <select
                      value={selectedCategory}
                      onChange={(e) =>
                        setSelectedCategory(e.target.value as FilterOption)
                      }
                      className="select select-bordered select-sm"
                    >
                      <option value="all">All Categories</option>
                      {availableCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Sort */}
                {showFilters && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      Sort by:
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as SortOption)}
                      className="select select-bordered select-sm"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="rating">Highest Rated</option>
                      <option value="name">Name (A-Z)</option>
                    </select>
                  </div>
                )}

                {/* Results count */}
                {selectedCategory !== "all" && (
                  <span className="text-sm text-gray-600 ml-auto">
                    Showing {filteredAndSortedFavorites.length} of{" "}
                    {favoriteAttractions.length} favorites
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Empty State */}
          {favoriteAttractions.length === 0 ? (
            <div className="my-12">
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                <FaHeart className="text-gray-300 text-6xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                  No Favorites Yet
                </h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  Start exploring attractions and add them to your favorites by
                  clicking the heart icon on any attraction card or detail page.
                </p>
                <a
                  href="/browse"
                  className="btn bg-orange-400 text-white hover:bg-orange-500"
                >
                  Browse Attractions
                </a>
              </div>
            </div>
          ) : filteredAndSortedFavorites.length === 0 ? (
            <div className="my-12">
              <div className="flex flex-col items-center justify-center py-16 bg-gray-50 rounded-lg">
                <FaFilter className="text-gray-300 text-6xl mb-4" />
                <h2 className="text-2xl font-bold text-gray-600 mb-2">
                  No Results Found
                </h2>
                <p className="text-gray-500 mb-6 text-center max-w-md">
                  No favorites match your current filter. Try adjusting your
                  filters.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setShowFilters(false);
                  }}
                  className="btn bg-orange-400 text-white hover:bg-orange-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          ) : (
            /* Favorites Grid */
            <div className="my-4">
              <RecommendedCards
                attractions={filteredAndSortedFavorites}
                showCloseButton={true}
                onRemoveFavorite={handleRemoveFavorite}
                onEditCategory={handleCategoryEdit}
                editingCategory={editingCategory}
                newCategory={newCategory}
                onCategoryChange={setNewCategory}
                onCategorySave={handleCategoryUpdate}
                onCategoryCancel={() => {
                  setEditingCategory(null);
                  setNewCategory("");
                }}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Favourites;
