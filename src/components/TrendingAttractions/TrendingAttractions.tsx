import CardContainer from "../Reusable Components/CardContainer";

// const test = [
//   {
//     photo: "https://example.com/photo1.jpg",
//     title: "Attraction 1",
//     description: "Description for Attraction 1",
//     rating: 4.0,
//   },
// ];

const TrendingAttractions = () => {
  return (
    <div className="items-center justify-center px-16">
      <h1 className="text-xl w-full text-left font-bold">
        Trending Attractions
      </h1>

      <CardContainer className="mt-6 mb-10" />
    </div>
  );
};

export default TrendingAttractions;
