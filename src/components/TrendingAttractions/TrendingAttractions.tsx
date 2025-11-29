import CardCarousel from "../Reusable Components/CardCarousel";

type Props = {
  attractions: Array<object>;
};

const TrendingAttractions = ({ attractions = [] }: Props) => {
  return (
    <div className="items-center justify-center px-16">
      <h1 className="text-xl w-full text-left font-bold">
        Trending Attractions
      </h1>

      <CardCarousel items={attractions} className="mt-6 mb-10" />
    </div>
  );
};

export default TrendingAttractions;
