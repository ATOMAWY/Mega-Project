import React from "react";
import { LuPiggyBank } from "react-icons/lu";
import { TbMapRoute } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";

type Props = {
  photo: string;
  title: string;
  description: string;
  rating: number;
  className: string;
  level: string;
  distance: string;
  isFavorite: boolean;
  category: string;
};

const AdvancedCard = ({
  photo,
  title,
  description,
  rating,
  className,
  level,
  distance,
  isFavorite,
  category,
}: Props) => {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  const formatedRating = (Math.round(rating * 10) / 10).toFixed(1);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? "★" : "☆"
  ).join("");
  return (
    <div
      className={`w-72 rounded overflow-hidden shadow-md bg-white flex flex-col h-full ${
        className ?? ""
      }`}
    >
      {photo ? (
        <img
          src={photo}
          alt={title ?? "Card image"}
          className="w-full h-48 object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
          No image
        </div>
      )}

      <div className="px-6 py-4 flex-grow">
        <div className="flex">
          {title && <div className="font-bold text-xl mb-2">{title}</div>}
          <div className="ml-auto">
            <p className="text-sm text-black bg-gray-200 align-middle p-2 justify-center w-fit px-2 rounded-full">
              {category}
            </p>
          </div>
        </div>

        <div className=" pb-4 flex items-center space-x-2">
          <div className="text-yellow-500 text-2xl" aria-hidden>
            {stars}
          </div>
        </div>

        {description && (
          <p className="text-gray-500 text-base line-clamp-2">{description}</p>
        )}
      </div>

      <div className="flex text-md flex-shrink-0">
        <div className="flex items-center space-x-2 px-6 pb-4">
          <div className="text-orange-400">
            <LuPiggyBank />
          </div>
          <div>{level}</div>
        </div>
        <div className="flex items-center space-x-2 px-6 pb-4">
          <div className="text-orange-400">
            <TbMapRoute />
          </div>
          <div>{distance} from Cairo</div>
        </div>
      </div>

      <div className="flex px-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-start gap-4 flex-1">
          <FaRegWindowClose className="text-gray-600 text-2xl align-middle justify-center items-center cursor-pointer" />
          <label className="swap swap-flip text-2xl">
            {/* this hidden checkbox controls the state */}
            <input type="checkbox" defaultChecked={isFavorite} />

            <div className="swap-on text-orange-400">
              <FaHeart />
            </div>
            <div className="swap-off text-gray-600">
              <FaRegHeart />
            </div>
          </label>
        </div>

        <a className="btn bg-orange-400 align-middle justify-center text-white">
          View Details
        </a>
      </div>
    </div>
  );
};

export default AdvancedCard;
