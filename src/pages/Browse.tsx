import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import RecommendedCards from "./../components/Recommended Cards/RecommendedCards";
import { attractions } from "../data/attractions";
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    setSearchQuery(urlQuery);
  }, [searchParams]);

  const filteredAttractions = attractions.filter(
    (attraction) =>
      attraction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      attraction.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      attraction.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="overflow-x-hidden">
      <NavBar />

      <div className="mx-4 sm:mx-6 lg:mx-20">
        <h1 className="text-3xl font-bold mt-8 mb-4">Browse Attractions</h1>
        <p className="text-lg mb-6 text-gray-500">
          Explore all available attractions in Cairo and Giza.
        </p>
      </div>

      <div className="mx-4 sm:mx-6 lg:mx-20 mb-6">
        <input
          type="text"
          placeholder="Search attractions..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value.trim()) {
              setSearchParams({ search: e.target.value.trim() });
            } else {
              setSearchParams({});
            }
          }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              if (searchQuery.trim()) {
                setSearchParams({ search: searchQuery.trim() });
              } else {
                setSearchParams({});
              }
            }
          }}
          className="input input-bordered w-full max-w-md"
        />
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
        <div className="w-full lg:flex-1 min-w-0">
          <RecommendedCards attractions={filteredAttractions} />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Browse;
