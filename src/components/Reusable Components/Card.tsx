export const Card = ({
  photo = "",
  title = "",
  description = "",
  rating = 0,
  className = "",
}) => {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  const formatedRating = (Math.round(rating * 10) / 10).toFixed(1);
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? "★" : "☆"
  ).join("");

  return (
    <div
      className={`max-w-sm rounded overflow-hidden shadow-md bg-white ${
        className ?? ""
      }`}
    >
      {photo ? (
        <img
          src={photo}
          alt={title ?? "Card image"}
          className="w-full h-48 object-cover"
        />
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center text-gray-500">
          No image
        </div>
      )}

      <div className="px-6 py-4">
        {title && <div className="font-bold text-xl mb-2">{title}</div>}
        {description && (
          <p className="text-gray-700 text-base">{description}</p>
        )}
      </div>

      <div className="px-6 pb-4 flex items-center space-x-2">
        <div className="text-yellow-500 text-lg" aria-hidden>
          {stars}
        </div>
        <div className="text-sm text-gray-600">({formatedRating ?? 0})</div>
      </div>

      <div className="px-6 pb-4">
        <a className="btn bg-white align-middle justify-center w-full">
          View Details
        </a>
      </div>
    </div>
  );
};

export default Card;
