import React from "react";
import CardContainer from "../Reusable Components/CardContainer";

type Props = {};

const HiddenGems = (props: Props) => {
  return (
    <div className="items-center justify-center px-16">
      <h1 className="text-xl w-full text-left font-bold">
        Hidden Gems & Local Favorites
      </h1>

      <CardContainer className="mt-6 mb-10" />
    </div>
  );
};
export default HiddenGems;
