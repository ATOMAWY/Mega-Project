import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import RecommendedCards from "./../components/Recommended Cards/RecommendedCards";
import { attractions } from "../data/attractions";
import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

const ITEMS_PER_PAGE = 12;

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("search") || "";
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const urlQuery = searchParams.get("search") || "";
    setSearchQuery(urlQuery);
    setCurrentPage(1); // Reset to first page when search changes
  }, [searchParams]);

  const filteredAttractions = useMemo(
    () =>
      attractions.filter(
        (attraction) =>
          attraction.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          attraction.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          attraction.category.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  const totalPages = Math.ceil(filteredAttractions.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedAttractions = filteredAttractions.slice(startIndex, endIndex);

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

      <div className="mx-4 sm:mx-6 lg:mx-20 my-4 flex flex-col lg:flex-row gap-5">
        <div className="w-full lg:flex-1 min-w-0">
          <RecommendedCards attractions={paginatedAttractions} />
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

export default Browse;
