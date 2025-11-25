import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import TrendingAttractions from "../components/TrendingAttractions/TrendingAttractions";
import HiddenGems from "../components/HiddenGems/HiddenGems";
import { attractions } from "../data/attractions";
import { LuPiggyBank } from "react-icons/lu";
import { TbMapRoute } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { isFavorite, toggleFavorite as toggleFavoriteService } from "../services/favoritesService";

const AttractionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavoriteState, setIsFavoriteState] = useState(false);

  // Find the attraction by id
  const attractionId = id ? parseInt(id) : null;
  const attraction = attractions.find((attr) => attr.id === attractionId) || null;

  // If attraction not found, show error or redirect
  if (!attraction) {
    return (
      <div className="overflow-x-hidden">
        <NavBar />
        <div className="mx-4 sm:mx-6 lg:mx-20 mt-8">
          <h1 className="text-3xl font-bold mb-4">Attraction Not Found</h1>
          <button
            onClick={() => navigate("/browse")}
            className="btn bg-orange-400 text-white"
          >
            Back to Browse
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const roundedRating = Math.max(
    0,
    Math.min(5, Math.round(attraction.rating ?? 0))
  );
  const formatedRating = (Math.round(attraction.rating * 10) / 10).toFixed(1);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? "★" : "☆"
  ).join("");

  // Initialize favorite state from localStorage
  useEffect(() => {
    if (attractionId !== null) {
      setIsFavoriteState(isFavorite(attractionId));
    }
  }, [attractionId]);

  // Listen for favorite updates
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      if (attractionId !== null) {
        setIsFavoriteState(isFavorite(attractionId));
      }
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    window.addEventListener("storage", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
      window.removeEventListener("storage", handleFavoritesUpdated);
    };
  }, [attractionId]);

  const toggleFavorite = () => {
    if (attractionId !== null) {
      const newState = toggleFavoriteService(attractionId);
      setIsFavoriteState(newState);
    }
  };

  // Get other attractions (excluding current one) for trending and hidden gems
  const otherAttractions = attractions.filter(
    (attr) => attr.id !== attractionId
  );

  return (
    <div className="overflow-x-hidden">
      <NavBar />

      <div className="mx-4 sm:mx-6 lg:mx-20">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 mb-4 text-gray-600 hover:text-orange-400 flex items-center gap-2"
        >
          <span>←</span> Back
        </button>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8 mb-8">
          {/* Image Section */}
          <div className="lg:w-1/2">
            {attraction.photo ? (
              <img
                src={attraction.photo}
                alt={attraction.title}
                className="w-full h-96 lg:h-[500px] object-cover rounded-xl shadow-lg"
              />
            ) : (
              <div className="w-full h-96 lg:h-[500px] bg-gray-200 flex items-center justify-center text-gray-500 rounded-xl">
                No image available
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="lg:w-1/2 flex flex-col">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-4xl font-bold mb-2">{attraction.title}</h1>
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-yellow-500 text-2xl" aria-hidden>
                    {stars}
                  </div>
                  <span className="text-lg text-gray-600">
                    ({formatedRating})
                  </span>
                  <span className="text-sm text-black bg-gray-200 px-3 py-1 rounded-full">
                    {attraction.category}
                  </span>
                </div>
              </div>
              <button
                onClick={toggleFavorite}
                className="text-3xl transition-colors"
                title={isFavoriteState ? "Remove from favorites" : "Add to favorites"}
              >
                {isFavoriteState ? (
                  <FaHeart className="text-orange-400" />
                ) : (
                  <FaRegHeart className="text-gray-600" />
                )}
              </button>
            </div>

            {/* Info Icons */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center space-x-2">
                <div className="text-orange-400 text-xl">
                  <LuPiggyBank />
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">Budget Level:</span>{" "}
                  {attraction.level}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="text-orange-400 text-xl">
                  <TbMapRoute />
                </div>
                <div className="text-gray-700">
                  <span className="font-semibold">Distance:</span>{" "}
                  {attraction.distance} from Cairo
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-3">About</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {attraction.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto">
              <button className="btn bg-orange-400 text-white hover:bg-orange-500 flex-1">
                Plan Visit
              </button>
              <button className="btn bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 flex-1">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Trending Attractions Section */}
      <div className="my-12">
        <TrendingAttractions attractions={otherAttractions} />
      </div>

      {/* Hidden Gems Section */}
      <div className="my-12">
        <HiddenGems attractions={otherAttractions} />
      </div>

      <Footer />
    </div>
  );
};

export default AttractionDetails;
