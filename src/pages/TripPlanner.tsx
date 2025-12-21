import { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import {
  useGenerateTripPlansMutation,
  type MLTripPlace,
} from "../features/tripPlanner/tripPlannerApiSlice";
import type { RootState } from "../app/api/store";
import { fetchAttractions, type Attraction } from "../data/attractions";
import {
  FaRobot,
  FaMapMarkedAlt,
  FaStar,
  FaUsers,
  FaRoute,
  FaShoppingBag,
  FaLandmark,
  FaTheaterMasks,
  FaHotel,
  FaUtensils,
  FaMapPin,
  FaChevronDown,
  FaSync,
  FaSearch,
  FaCheckCircle,
  FaFire,
  FaChartLine,
} from "react-icons/fa";
import { IoMdCafe } from "react-icons/io";


const TripPlanner = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  const [generateTripPlans, { isLoading: isGenerating, error: generateError }] =
    useGenerateTripPlansMutation();

  const [plans, setPlans] = useState<{ [key: string]: MLTripPlace[] } | null>(null);
  const [selectedPlanKey, setSelectedPlanKey] = useState<string | null>(null);
  const [totalPlans, setTotalPlans] = useState(0);
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [allAttractions, setAllAttractions] = useState<Attraction[]>([]);

  const handleGeneratePlans = async () => {
    if (!user?.id) {
      alert("Please log in to generate trip plans");
      navigate("/login");
      return;
    }

    try {
      console.log("📡 Calling /api/ml-recommendations/plans/generate...");
      const response = await generateTripPlans({ userId: user.id }).unwrap();
      console.log("✅ Trip plans generated:", response);

      setPlans(response.plans);
      setTotalPlans(response.totalPlans);

      // Auto-select the first plan
      const firstPlanKey = Object.keys(response.plans)[0];
      if (firstPlanKey) {
        setSelectedPlanKey(firstPlanKey);
      }
    } catch (err: any) {
      console.error("❌ Failed to generate trip plans:", err);
      alert(`Failed to generate trip plans: ${err.data?.message || err.message || "Unknown error"}`);
    }
  };

  // Load all attractions for matching
  useEffect(() => {
    fetchAttractions().then(setAllAttractions);
  }, []);

  // Auto-generate plans on mount if user is authenticated
  useEffect(() => {
    if (user?.id) {
      console.log("🚀 Generating AI trip plans for user:", user.id);
      handleGeneratePlans();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const selectedPlan = selectedPlanKey && plans ? plans[selectedPlanKey] : null;

  // Organize places by category
  const organizedByCategory = useMemo(() => {
    if (!selectedPlan) return {};

    const grouped: { [category: string]: MLTripPlace[] } = {};
    selectedPlan.forEach((place) => {
      const category = place.Category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(place);
    });

    return grouped;
  }, [selectedPlan]);

  const categories = Object.keys(organizedByCategory);

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Shopping":
        return <FaShoppingBag className="text-orange-500" />;
      case "Museum":
        return <FaLandmark className="text-amber-600" />;
      case "Attraction":
        return <FaTheaterMasks className="text-orange-500" />;
      case "Hotel":
        return <FaHotel className="text-orange-500" />;
      case "Restaurant":
        return <FaUtensils className="text-orange-500" />;
      default:
        return <IoMdCafe className="text-orange-500" />;
    }
  };

  const handleImageError = (placeId: number) => {
    setImageErrors((prev) => new Set(prev).add(placeId));
  };

  // Find attraction by matching ML place name with attraction title
  const findAttractionByName = (placeName: string): Attraction | undefined => {
    return allAttractions.find(
      (attr) => attr.title?.toLowerCase().trim() === placeName.toLowerCase().trim()
    );
  };

  const handleViewDetails = (place: MLTripPlace) => {
    // Try to find the matching attraction
    const matchedAttraction = findAttractionByName(place.Name);
    
    if (matchedAttraction?.placeId) {
      console.log("✅ Found matching attraction, navigating to:", matchedAttraction.placeId);
      navigate(`/attraction/${matchedAttraction.placeId}`);
    } else {
      console.warn("⚠️ Could not find matching attraction for:", place.Name);
      alert(`Details for "${place.Name}" are not available yet. The place may need to be added to the database with a UUID.`);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-1 mx-4 sm:mx-6 lg:mx-20 py-8 space-y-8">
        {/* Hero Section */}
        <div className="text-center space-y-4 py-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-400 rounded-xl shadow-lg mb-3">
            <FaRobot className="text-white text-3xl" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            AI-Powered Trip Planner
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">
            Your personalized Cairo adventure awaits. Our AI has analyzed your preferences
            and curated the perfect itinerary just for you.
          </p>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-5">
              <div className="loading loading-spinner loading-lg text-orange-400"></div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-gray-800">
                  Crafting Your Perfect Journey...
                </p>
                <p className="text-gray-500 text-sm">
                  Our AI is analyzing thousands of places to find the best matches
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {generateError && (
          <div className="max-w-2xl mx-auto">
            <div className="alert alert-error shadow-md">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="stroke-current flex-shrink-0 h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>Failed to generate trip plans. Please try again.</span>
              </div>
              <div className="flex-none">
                <button onClick={handleGeneratePlans} className="btn btn-sm btn-ghost">
                  Retry
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Plans Loaded */}
        {!isGenerating && plans && (
          <>
            {/* Plan Selection Header */}
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-400 rounded-lg flex items-center justify-center">
                    <FaMapMarkedAlt className="text-white text-lg" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      Choose Your Adventure
                    </h2>
                    <p className="text-gray-500 text-sm">
                      {totalPlans} personalized itineraries ready for you
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleGeneratePlans}
                  className="btn btn-sm btn-outline border-orange-400 text-orange-500 hover:bg-orange-50 hover:border-orange-500 gap-2"
                >
                  <FaSync className="text-xs" />
                  Regenerate
                </button>
              </div>

              {/* Plan Tabs */}
              <div className="flex flex-wrap gap-3">
                {Object.keys(plans).map((planKey) => {
                  const isActive = planKey === selectedPlanKey;
                  const planPlaces = plans[planKey];
                  const placesCount = planPlaces.length;
                  const avgScore = (
                    planPlaces.reduce((sum, p) => sum + p.Final_Score, 0) / placesCount
                  ).toFixed(2);

                  return (
                    <button
                      key={planKey}
                      className={`relative transition-all ${
                        isActive
                          ? "bg-orange-400 text-white shadow-lg"
                          : "bg-white border-2 border-gray-200 text-gray-700 hover:border-orange-300 hover:shadow-sm"
                      } rounded-lg px-5 py-3 font-medium`}
                      onClick={() => setSelectedPlanKey(planKey)}
                    >
                      <div className="flex items-center gap-2">
                        <FaRoute className={isActive ? "text-white" : "text-orange-400"} />
                        <div className="text-left">
                          <div className="font-bold">{planKey}</div>
                          <div
                            className={`text-xs ${
                              isActive ? "text-orange-100" : "text-gray-500"
                            }`}
                          >
                            {placesCount} places • {(parseFloat(avgScore) * 100).toFixed(0)}% match
                          </div>
                        </div>
                      </div>
                      {isActive && (
                        <div className="absolute -top-1 -right-1">
                          <FaCheckCircle className="text-white bg-orange-400 rounded-full" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Plan Content */}
            {selectedPlan && (
              <div className="space-y-6">
                {/* Plan Stats Banner */}
                <div className="bg-orange-400 rounded-lg shadow-md p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <FaChartLine className="text-2xl" />
                    <h3 className="text-2xl font-bold">{selectedPlanKey}</h3>
                  </div>
                  <p className="text-orange-50 mb-4">
                    This itinerary includes {selectedPlan.length} handpicked destinations,
                    intelligently organized by our AI based on location clusters and your unique
                    preferences.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <div className="bg-white/20 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                      <FaStar className="text-white" />
                      <span className="font-semibold">
                        {(selectedPlan[0]?.Final_Score * 100).toFixed(0)}% AI Match
                      </span>
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                      <FaMapPin />
                      <span className="font-semibold">{categories.length} Categories</span>
                    </div>
                    <div className="bg-white/20 rounded-lg px-3 py-2 flex items-center gap-2 text-sm">
                      <FaRoute />
                      <span className="font-semibold">Optimized Route</span>
                    </div>
                  </div>
                </div>

                {/* Places by Category */}
                <div className="space-y-4">
                  {categories.map((category) => {
                    const places = organizedByCategory[category];

                    return (
                      <details
                        key={category}
                        open
                        className="group bg-white border border-gray-200 rounded-lg shadow-sm"
                      >
                        <summary className="flex cursor-pointer items-center justify-between px-5 py-4 hover:bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                              {getCategoryIcon(category)}
                            </div>
                            <div>
                              <span className="font-bold text-gray-900">{category}</span>
                              <p className="text-sm text-gray-500">
                                {places.length} {places.length === 1 ? "place" : "places"}
                              </p>
                            </div>
                          </div>
                          <FaChevronDown className="text-gray-400 group-open:rotate-180 transition-transform" />
                        </summary>

                        <div className="border-t border-gray-100 p-5">
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                            {places.map((place, index) => {
                              const hasError = imageErrors.has(place.PlaceId);

                              return (
                                <article
                                  key={`${place.PlaceId}-${index}`}
                                  className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                                >
                                  {/* Image */}
                                  <div className="relative h-48 overflow-hidden bg-gray-200">
                                    {!hasError ? (
                                      <img
                                        src={place["Photo URL"]}
                                        alt={place.Name}
                                        className="w-full h-full object-cover"
                                        onError={() => handleImageError(place.PlaceId)}
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-500">
                                        No image
                                      </div>
                                    )}
                                    {/* Match Score Badge */}
                                    <div className="absolute top-3 right-3 bg-orange-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md flex items-center gap-1">
                                      <FaStar className="text-white" />
                                      {(place.Final_Score * 100).toFixed(0)}%
                                    </div>
                                  </div>

                                  {/* Content */}
                                  <div className="p-4 space-y-3">
                                    <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                                      {place.Name}
                                    </h3>

                                    {/* Stats Grid */}
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                      <div className="flex items-center gap-2">
                                        <FaStar className="text-orange-400" />
                                        <span className="font-semibold text-gray-900">
                                          {place.Rating}/5
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaUsers className="text-orange-400" />
                                        <span className="font-semibold text-gray-900">
                                          {(place["Review Count"] / 1000).toFixed(1)}k reviews
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaFire className="text-orange-400" />
                                        <span className="font-semibold text-gray-900">
                                          {(place.Norm_Popularity * 100).toFixed(0)}% popular
                                        </span>
                                      </div>

                                      <div className="flex items-center gap-2">
                                        <FaMapPin className="text-orange-400" />
                                        <span className="text-gray-600 text-xs">
                                          {place.Latitude.toFixed(4)}, {place.Longitude.toFixed(4)}
                                        </span>
                                      </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2 pt-2">
                                      <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${place.Latitude},${place.Longitude}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1 btn btn-sm btn-outline border-blue-300 text-blue-600 hover:bg-blue-50 gap-1"
                                      >
                                        <FaMapMarkedAlt />
                                        View Map
                                      </a>
                                      <button
                                        onClick={() => handleViewDetails(place)}
                                        className="flex-1 btn btn-sm btn-outline border-orange-400 text-orange-500 hover:bg-orange-50 gap-1"
                                      >
                                        <FaSearch />
                                        Details
                                      </button>
                                    </div>
                                  </div>
                                </article>
                              );
                            })}
                          </div>
                        </div>
                      </details>
                    );
                  })}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center pt-6 pb-4">
                  <button
                    className="btn btn-lg btn-outline border-orange-400 text-orange-500 hover:bg-orange-50 gap-2"
                    onClick={() => navigate("/recommendations")}
                  >
                    <FaSearch />
                    Browse All Places
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Empty State - No user logged in */}
        {!user && !isGenerating && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center space-y-5 max-w-md">
              <div className="w-20 h-20 bg-orange-400 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                <FaRobot className="text-white text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Authentication Required</h2>
              <p className="text-gray-600">
                Sign in to unlock AI-powered trip planning tailored to your unique travel
                preferences.
              </p>
              <button
                onClick={() => navigate("/login")}
                className="btn btn-lg bg-orange-400 border-orange-400 text-white hover:bg-orange-500 shadow-md"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default TripPlanner;
