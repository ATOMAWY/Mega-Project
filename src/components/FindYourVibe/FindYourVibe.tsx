import { CiSearch } from "react-icons/ci";

const FindYourVibe = () => {
  return (
    <div className="flex items-center justify-center px-16 flex-col mb-20">
      <h1 className="text-xl w-full text-left font-bold">Find Your Vibe</h1>

      <div className="relative w-3/4 lg:w-1/2">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <CiSearch />
        </span>
        <input
          type="search"
          aria-label="Search attractions"
          placeholder="Search attractions by mood (e.g., historical, serene, adventurous)"
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-white shadow-sm placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-200"
        />
      </div>
    </div>
  );
};

export default FindYourVibe;
