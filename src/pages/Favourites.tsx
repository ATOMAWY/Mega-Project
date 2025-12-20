import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import RecommendedCards from "../components/Recommended Cards/RecommendedCards";
import { type Attraction } from "../data/attractions";
import {
  useGetUserFavoritesQuery,
} from "../features/favorites/favoritesApiSlice";
import { selectCurrentUser } from "../features/auth/slice";
import { FaHeart, FaFilter } from "react-icons/fa";
import { Link } from "react-router";

type SortOption = "newest" | "oldest" | "rating" | "name";
type FilterOption = "all" | string; // "all" or category name

const Favourites = () => {
  const user = useSelector(selectCurrentUser);
  const [selectedCategory, setSelectedCategory] = useState<FilterOption>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [editingCategory, setEditingCategory] = useState<number | null>(null);
  const [newCategory, setNewCategory] = useState("");

  // Fetch favorites from API
  const {
    data: favoritesData = [],
    isLoading,
    isError,
    error,
  } = useGetUserFavoritesQuery(user?.id || "", {
    skip: !user?.id, // Skip if no user logged in
  });

  // Transform API favorites to Attraction format
  const favoriteAttractions = useMemo(() => {
    return favoritesData
      .filter((fav) => fav.place) // Only include favorites with place data
      .map((fav) => {
        const place = fav.place;
        const attraction: Attraction = {
          id: 0, // Not used when we have placeId
          placeId: place.placeId,
          title: place.name || "Unknown Place",
          description: place.description || "",
          fullDescription: place.description || "",
          photo: place.imageUrl,
          rating: place.rating || 0,
          category: place.category || "Uncategorized",
          level: place.priceRange || "Varies",
          distance: place.address || "Cairo",
          district: place.address,
          isFavorite: true,
          favoriteData: {
            placeId: 0, // legacy field
            userCategory: fav.userCategory || undefined,
            createdAt: fav.createdAt,
          },
          raw: place as any,
        };
        return attraction;
      });
  }, [favoritesData]);

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

  // Handle category update (not implemented in backend yet)
  const handleCategoryUpdate = (_placeId: number, _category: string) => {
    // TODO: Backend doesn't have update category endpoint yet
    setEditingCategory(null);
    setNewCategory("");
  };

  // Handle category edit
  const handleCategoryEdit = (placeId: number, currentCategory?: string) => {
    setEditingCategory(placeId);
    setNewCategory(currentCategory || "");
  };

  // Show login prompt if not logged in
  if (!user) {
    return (
      <div className="overflow-x-hidden min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <FaHeart className="text-gray-300 text-6xl mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-gray-600 mb-4">Please Log In</h2>
            <p className="text-gray-500 mb-6">
              You need to be logged in to view your favorites.
            </p>
            <Link
              to="/login"
              className="btn bg-orange-400 text-white hover:bg-orange-500"
            >
              Go to Login
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="overflow-x-hidden min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="loading loading-spinner loading-lg text-orange-400"></div>
            <p className="mt-4 text-gray-600">Loading your favorites...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="overflow-x-hidden min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-gray-500 mb-6">
              Failed to load favorites: {(error as any)?.message || "Unknown error"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn bg-orange-400 text-white hover:bg-orange-500"
            >
              Retry
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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
                <Link
                  to="/browse"
                  className="btn bg-orange-400 text-white hover:bg-orange-500"
                >
                  Browse Attractions
                </Link>
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
