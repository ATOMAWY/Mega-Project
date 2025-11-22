import NavBar from "./../components/NavBar/NavBar";
import Footer from "../components/Footer/Footer";
import FilterRecommendations from "./../components/Filter Recommendations/FilterRecommendations";
import RecommendedCards from "./../components/Recommended Cards/RecommendedCards";

type Props = {
  attractions: any[];
};

const Recommendations = ({ attractions = [] }: Props) => {
  return (
    <div>
      <NavBar />

      <div className="mx-10 lg:mx-20">
        <h1 className="text-3xl font-bold mt-8 mb-4">
          Personalized Recommendations
        </h1>
        <p className="text-lg mb-6 text-gray-500">
          Discover amazing attractions in Cairo and Giza tailored to your
          preferences.
        </p>
      </div>

      <div className="flex justify-end items-end mx-10 lg:mx-20">
        <div className="flex">
          <select
            className="select select-bordered w-full max-w-xs"
            defaultValue={"1"}
          >
            <option value="1">Rating: High to Low</option>
            <option value="2">Option 1</option>
            <option value="3">Option 2</option>
          </select>
        </div>
      </div>

      <div className="mx-10 lg:mx-20 my-4 flex flex-col lg:flex-row gap-5 ">
        <FilterRecommendations />
        <RecommendedCards attractions={attractions} />
      </div>
      <Footer />
    </div>
  );
};

export default Recommendations;
