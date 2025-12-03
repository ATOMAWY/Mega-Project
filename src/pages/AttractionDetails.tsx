import { useParams, useNavigate } from "react-router-dom";
import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import TrendingAttractions from "../components/TrendingAttractions/TrendingAttractions";
import HiddenGems from "../components/HiddenGems/HiddenGems";
import { fetchAttractions, type Attraction } from "../data/attractions";
import { LuPiggyBank } from "react-icons/lu";
import { TbMapRoute } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { HiClock, HiPhone, HiGlobeAlt } from "react-icons/hi2";
import { MdAccessibility, MdLocalParking, MdLocationOn } from "react-icons/md";
import { IoTimeOutline } from "react-icons/io5";
import { useState, useEffect } from "react";
import {
  isFavorite,
  toggleFavorite as toggleFavoriteService,
} from "../services/favoritesService";

const AttractionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isFavoriteState, setIsFavoriteState] = useState(false);
  const [hasImageError, setHasImageError] = useState(false);
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(true);

  // Find the attraction by id
  const attractionId = id ? parseInt(id) : null;

  useEffect(() => {
    fetchAttractions().then((data) => {
      setAttractions(data);
      setLoading(false);
    });
  }, []);

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

  // Find the attraction by id (after all hooks)
  const attraction =
    attractions.find((attr) => attr.id === attractionId) || null;

  // Show loading state
  if (loading) {
    return (
      <div className="overflow-x-hidden">
        <NavBar />
        <div className="mx-4 sm:mx-6 lg:mx-20 mt-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="spinner-orange"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

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

  const roundedRating = Math.max(
    0,
    Math.min(5, Math.round(attraction.rating ?? 0))
  );
  const formatedRating = (Math.round(attraction.rating * 10) / 10).toFixed(1);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? "★" : "☆"
  ).join("");

  return (
    <div className="overflow-x-hidden bg-slate-50 min-h-screen">
      <NavBar />

      <div className="mx-4 sm:mx-6 lg:mx-20 ">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mt-8 mb-6 text-gray-600 hover:text-orange-400 flex items-center gap-2 transition-colors group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">
            ←
          </span>{" "}
          Back
        </button>

        {/* Main Content */}
        <div className="flex flex-col gap-8 sm:gap-10 md:gap-12 mb-12 sm:mb-14 md:mb-16 items-center justify-center w-full">
          {/* Image Section */}
          <div className=" lg:w-4/5 xl:w-3/5 w-full">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl bg-gray-200 min-h-[250px] sm:min-h-[300px] md:min-h-[400px] lg:min-h-[500px] group">
              {attraction.photo && !hasImageError ? (
                <>
                  <img
                    src={attraction.photo}
                    alt={attraction.title}
                    className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    onError={() => {
                      setHasImageError(true);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 md:p-7 lg:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3 sm:gap-4 md:gap-5 text-white">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs uppercase tracking-wider text-white/80 mb-1 sm:mb-2 font-medium">
                        Featured Attraction
                      </p>
                      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight line-clamp-2 drop-shadow-lg">
                        {attraction.title}
                      </h1>
                    </div>
                    <div className="bg-white/10 backdrop-blur-md rounded-xl sm:rounded-2xl px-3 sm:px-4 md:px-5 lg:px-5 py-2 sm:py-3 flex items-center gap-2 sm:gap-3 border border-white/20 shadow-lg flex-shrink-0">
                      <span className="text-xl sm:text-2xl text-yellow-400">
                        ★
                      </span>
                      <div className="text-xs sm:text-sm leading-tight">
                        <div className="font-bold text-base sm:text-lg">
                          {formatedRating}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-64 sm:h-80 md:h-96 lg:h-[500px] flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-3xl sm:text-4xl mb-2">📷</div>
                    <div className="text-xs sm:text-sm">No image available</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details Section */}
          <div className="lg:w-4/5 xl:w-3/5 w-full flex flex-col">
            {/* Header Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-7 lg:p-8 mb-6 sm:mb-7 md:mb-8 border border-slate-100">
              <div className="flex items-start justify-between gap-3 sm:gap-4 md:gap-5">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2 sm:mb-3 md:mb-4">
                    <span className="text-xs uppercase tracking-wider text-orange-500 font-semibold px-2 sm:px-3 py-1 rounded-full bg-orange-50 border border-orange-100 whitespace-nowrap">
                      {attraction.category}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs px-2 sm:px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium whitespace-nowrap">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Popular
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4 text-slate-900 leading-tight break-words">
                    {attraction.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-0">
                    <div className="flex items-center gap-2 bg-slate-50 rounded-lg sm:rounded-xl px-3 sm:px-4 md:px-5 py-1.5 sm:py-2">
                      <div
                        className="text-yellow-500 text-lg sm:text-xl md:text-2xl"
                        aria-hidden
                      >
                        {stars}
                      </div>
                      <span className="text-base sm:text-lg md:text-xl text-slate-900 font-bold">
                        {formatedRating}
                      </span>
                      <span className="text-xs sm:text-sm md:text-base text-slate-500">
                        / 5.0
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={toggleFavorite}
                  className="text-3xl sm:text-4xl md:text-5xl transition-all hover:scale-110 active:scale-95 flex-shrink-0 mt-1"
                  title={
                    isFavoriteState
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  {isFavoriteState ? (
                    <FaHeart className="text-orange-400 drop-shadow-sm" />
                  ) : (
                    <FaRegHeart className="text-slate-400 hover:text-orange-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 mb-6 sm:mb-7 md:mb-8">
              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow px-4 sm:px-5 md:px-6 py-3 sm:py-4 border border-slate-100 group">
                <div className="text-orange-400 text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <LuPiggyBank />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Budget
                  </div>
                  <div className="font-bold text-slate-900 text-base sm:text-lg md:text-xl truncate">
                    {attraction.level}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 md:gap-5 rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow px-4 sm:px-5 md:px-6 py-3 sm:py-4 border border-slate-100 group">
                <div className="text-orange-400 text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform flex-shrink-0">
                  <MdLocationOn />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                    Area
                  </div>
                  <div className="font-bold text-slate-900 text-base sm:text-lg md:text-xl truncate">
                    {attraction.district || attraction.distance}
                  </div>
                </div>
              </div>

              {attraction.bestTimeToVisit && (
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5 rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow px-4 sm:px-5 md:px-6 py-3 sm:py-4 border border-slate-100 group">
                  <div className="text-orange-400 text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform flex-shrink-0">
                    <HiClock />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Best Time
                    </div>
                    <div className="font-bold text-slate-900 text-base sm:text-lg md:text-xl line-clamp-1">
                      {attraction.bestTimeToVisit}
                    </div>
                  </div>
                </div>
              )}

              {attraction.avgVisitDurationMinutes && (
                <div className="flex items-center gap-3 sm:gap-4 md:gap-5 rounded-lg sm:rounded-xl bg-white shadow-md hover:shadow-lg transition-shadow px-4 sm:px-5 md:px-6 py-3 sm:py-4 border border-slate-100 group">
                  <div className="text-orange-400 text-2xl sm:text-3xl md:text-4xl group-hover:scale-110 transition-transform flex-shrink-0">
                    <IoTimeOutline />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                      Duration
                    </div>
                    <div className="font-bold text-slate-900 text-base sm:text-lg md:text-xl">
                      ~{attraction.avgVisitDurationMinutes}m
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Description & Info Sections */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 mb-6 sm:mb-7 md:mb-8">
              {/* About Section */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 md:p-7 lg:p-8 border border-slate-100">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-3 sm:mb-4 md:mb-5 text-slate-900 flex items-center gap-2">
                  <span className="w-1 h-5 sm:h-6 md:h-7 bg-orange-400 rounded-full flex-shrink-0" />
                  About
                </h2>
                <p className="text-base sm:text-lg md:text-xl text-slate-700 leading-relaxed">
                  {attraction.fullDescription || attraction.description}
                </p>
              </div>

              {/* Visitor Info Section */}
              {(attraction.accessibilityInfo ||
                attraction.parkingInfo ||
                attraction.indoorOutdoor ||
                attraction.bestTimeOfDay) && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 md:p-7 lg:p-8 border border-slate-100">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-5 text-slate-900 flex items-center gap-2">
                    <span className="w-1 h-4 sm:h-5 md:h-6 bg-orange-400 rounded-full flex-shrink-0" />
                    Visitor Information
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                    {attraction.indoorOutdoor && (
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg bg-slate-50">
                        <TbMapRoute className="text-orange-400 text-lg sm:text-xl md:text-2xl mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Type
                          </div>
                          <div className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg">
                            {attraction.indoorOutdoor}
                          </div>
                        </div>
                      </div>
                    )}
                    {attraction.bestTimeOfDay && (
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg bg-slate-50">
                        <HiClock className="text-orange-400 text-lg sm:text-xl md:text-2xl mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Best Time
                          </div>
                          <div className="font-semibold text-slate-900 text-sm sm:text-base md:text-lg">
                            {attraction.bestTimeOfDay}
                          </div>
                        </div>
                      </div>
                    )}
                    {attraction.accessibilityInfo && (
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg bg-slate-50">
                        <MdAccessibility className="text-orange-400 text-lg sm:text-xl md:text-2xl mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Accessibility
                          </div>
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm md:text-base">
                            {attraction.accessibilityInfo}
                          </div>
                        </div>
                      </div>
                    )}
                    {attraction.parkingInfo && (
                      <div className="flex items-start gap-2 sm:gap-3 md:gap-4 p-2.5 sm:p-3 md:p-4 rounded-lg bg-slate-50">
                        <MdLocalParking className="text-orange-400 text-lg sm:text-xl md:text-2xl mt-0.5 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs text-slate-500 uppercase tracking-wide mb-1">
                            Parking
                          </div>
                          <div className="font-semibold text-slate-900 text-xs sm:text-sm md:text-base">
                            {attraction.parkingInfo}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {(attraction.website || attraction.phoneNumber) && (
                <div className="bg-white rounded-xl sm:rounded-2xl shadow-md p-4 sm:p-6 md:p-7 lg:p-8 border border-slate-100">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-5 text-slate-900 flex items-center gap-2">
                    <span className="w-1 h-4 sm:h-5 md:h-6 bg-orange-400 rounded-full flex-shrink-0" />
                    Contact & Links
                  </h3>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5">
                    {attraction.website && (
                      <a
                        href={attraction.website}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-700 font-semibold text-sm sm:text-base md:text-lg transition-colors border border-orange-200 group"
                      >
                        <HiGlobeAlt className="text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="truncate">Visit Website</span>
                      </a>
                    )}
                    {attraction.phoneNumber && (
                      <a
                        href={`tel:${attraction.phoneNumber}`}
                        className="flex items-center justify-center sm:justify-start gap-2 sm:gap-3 md:gap-4 px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3.5 rounded-lg sm:rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-sm sm:text-base md:text-lg transition-colors border border-slate-200 group"
                      >
                        <HiPhone className="text-lg sm:text-xl md:text-2xl group-hover:scale-110 transition-transform flex-shrink-0" />
                        <span className="truncate">
                          {attraction.phoneNumber}
                        </span>
                      </a>
                    )}
                  </div>
                </div>
              )}
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
