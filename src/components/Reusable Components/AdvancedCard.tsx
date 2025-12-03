import { LuPiggyBank } from "react-icons/lu";
import { TbMapRoute } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";
import { MdCategory, MdEdit, MdCheck, MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toggleFavorite, isFavorite } from "../../services/favoritesService";

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
  showCloseButton?: boolean;
  userCategory?: string;
  isEditingCategory?: boolean;
  newCategory?: string;
  onRemoveFavorite?: () => void;
  onEditCategory?: () => void;
  onCategoryChange?: (category: string) => void;
  onCategorySave?: () => void;
  onCategoryCancel?: () => void;
};

const AdvancedCard = ({
  photo,
  title,
  description,
  rating,
  className,
  level,
  distance,
  isFavorite: initialIsFavorite,
  category,
  id,
  showCloseButton = false,
  userCategory,
  isEditingCategory = false,
  newCategory = "",
  onRemoveFavorite,
  onEditCategory,
  onCategoryChange,
  onCategorySave,
  onCategoryCancel,
}: Props) => {
  const [favoriteState, setFavoriteState] = useState(initialIsFavorite);
  const [hasImageError, setHasImageError] = useState(false);

  // Sync favorite state with localStorage
  useEffect(() => {
    if (id !== undefined) {
      setFavoriteState(isFavorite(id));
    }
  }, [id]);

  // Listen for favorite updates
  useEffect(() => {
    const handleFavoritesUpdated = () => {
      if (id !== undefined) {
        setFavoriteState(isFavorite(id));
      }
    };

    window.addEventListener("favoritesUpdated", handleFavoritesUpdated);
    window.addEventListener("storage", handleFavoritesUpdated);

    return () => {
      window.removeEventListener("favoritesUpdated", handleFavoritesUpdated);
      window.removeEventListener("storage", handleFavoritesUpdated);
    };
  }, [id]);

  const roundedRating = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? "★" : "☆"
  ).join("");

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (id !== undefined) {
      const newState = toggleFavorite(id);
      setFavoriteState(newState);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onRemoveFavorite) {
      onRemoveFavorite();
    }
  };

  const handleCategoryEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEditCategory) {
      onEditCategory();
    }
  };

  const handleCategorySave = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCategorySave) {
      onCategorySave();
    }
  };

  const handleCategoryCancel = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onCategoryCancel) {
      onCategoryCancel();
    }
  };

  return (
    <div
      className={`w-96 h-[510px] rounded overflow-hidden shadow-md bg-white flex flex-col ${
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
        <div className="flex">
          {title && <div className="font-bold text-xl mb-2">{title}</div>}
          <div className="ml-auto">
            <p className="text-sm text-black bg-gray-200 align-middle p-2 justify-center w-fit px-2 rounded-full">
              {category}
            </p>
          </div>
        </div>

        <div className="pb-4 flex items-center space-x-2">
          <div className="text-yellow-500 text-2xl" aria-hidden>
            {stars}
          </div>
        </div>

        {description && (
          <p className="text-gray-500 text-base line-clamp-2">{description}</p>
        )}

        {/* User Category Section */}
        {userCategory && !isEditingCategory && (
          <div className="mt-3 flex items-center gap-2">
            <MdCategory className="text-orange-400" />
            <span className="text-sm text-gray-600">My Category:</span>
            <span className="text-sm font-medium text-orange-600">
              {userCategory}
            </span>
            {onEditCategory && (
              <button
                onClick={handleCategoryEdit}
                className="ml-auto text-orange-400 hover:text-orange-600"
                title="Edit category"
              >
                <MdEdit size={16} />
              </button>
            )}
          </div>
        )}

        {isEditingCategory && (
          <div className="mt-3 flex items-center gap-2">
            <MdCategory className="text-orange-400" />
            <input
              type="text"
              value={newCategory}
              onChange={(e) =>
                onCategoryChange && onCategoryChange(e.target.value)
              }
              placeholder="Enter category"
              className="input input-bordered input-sm flex-1"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => {
                if (e.key === "Enter" && onCategorySave) {
                  handleCategorySave(e as any);
                }
                if (e.key === "Escape" && onCategoryCancel) {
                  handleCategoryCancel(e as any);
                }
              }}
              autoFocus
            />
            {onCategorySave && (
              <button
                onClick={handleCategorySave}
                className="text-green-600 hover:text-green-800"
                title="Save category"
              >
                <MdCheck size={20} />
              </button>
            )}
            {onCategoryCancel && (
              <button
                onClick={handleCategoryCancel}
                className="text-red-600 hover:text-red-800"
                title="Cancel"
              >
                <MdClose size={20} />
              </button>
            )}
          </div>
        )}
      </div>

      <div className="flex text-md flex-shrink-0 justify-between">
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
          <div>{distance}</div>
        </div>
      </div>

      <div className="flex px-6 pb-4 flex-shrink-0">
        <div className="flex items-center justify-start gap-4 flex-1">
          {showCloseButton && onRemoveFavorite && (
            <button
              onClick={handleRemoveClick}
              className="text-gray-600 hover:text-red-600 text-2xl transition-colors"
              title="Remove from favorites"
            >
              <FaRegWindowClose />
            </button>
          )}
          <button
            onClick={handleFavoriteToggle}
            className="text-2xl transition-colors"
            title={favoriteState ? "Remove from favorites" : "Add to favorites"}
          >
            {favoriteState ? (
              <FaHeart className="text-orange-400" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>
        </div>

        {id !== undefined ? (
          <Link
            to={`/attraction/${id}`}
            className="btn bg-orange-400 align-middle justify-center text-white hover:bg-orange-500"
          >
            View Details
          </Link>
        ) : (
          <a className="btn bg-orange-400 align-middle justify-center text-white hover:bg-orange-500">
            View Details
          </a>
        )}
      </div>
    </div>
  );
};

export default AdvancedCard;
