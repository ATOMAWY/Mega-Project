import { Link } from "react-router-dom";
import { useState } from "react";

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
  id?: number;
  placeId?: string; // UUID from backend - preferred for routing
};

export const SimpleCard = ({
  photo,
  title,
  description,
  rating,
  className,
  id,
  placeId,
}: Props) => {
  const [hasImageError, setHasImageError] = useState(false);
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
      {photo && !hasImageError ? (
        <img
          src={photo}
          alt={title ?? "Card image"}
          className="w-full h-48 object-cover flex-shrink-0"
          onError={() => {
            // If the image fails to load, fall back to the placeholder block below
            setHasImageError(true);
          }}
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500 flex-shrink-0">
          No image
        </div>
      )}

      <div className="px-6 py-4 flex-grow">
        {title && <div className="font-bold text-xl mb-2">{title}</div>}
        {description && (
          <p className="text-gray-700 text-base line-clamp-2">{description}</p>
        )}
      </div>

      <div className="px-6 pb-4 flex items-center space-x-2 flex-shrink-0">
        <div className="text-yellow-500 text-lg" aria-hidden>
          {stars}
        </div>
        <div className="text-sm text-gray-600">({formatedRating ?? 0})</div>
      </div>

      <div className="px-6 pb-4 flex-shrink-0">
        {(placeId || id) ? (
          <Link
            to={`/attraction/${placeId || id}`}
            className="btn bg-white align-middle justify-center w-full"
          >
            View Details
          </Link>
        ) : (
          <button
            className="btn bg-white align-middle justify-center w-full opacity-50 cursor-not-allowed"
            disabled
          >
            View Details
          </button>
        )}
      </div>
    </div>
  );
};

export default SimpleCard;
