import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import FilterRecommendations from "./../components/Filter Recommendations/FilterRecommendations";
import RecommendedCards from "./../components/Recommended Cards/RecommendedCards";
import { attractions } from "../data/attractions";

const Recommendations = () => {
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
            defaultValue={"1"}
          >
            <option value="1">Rating: High to Low</option>
            <option value="2">Rating: Low to High</option>
            <option value="3">Budget: High to Low</option>
            <option value="4">Budget: Low to High</option>
            <option value="5">Distance: Nearest to Furthest</option>
          </select>
        </div>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-20 my-4 flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:w-auto">
          <FilterRecommendations />
        </div>
        <div className="w-full lg:flex-1 min-w-0">
          <RecommendedCards attractions={attractions} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;
