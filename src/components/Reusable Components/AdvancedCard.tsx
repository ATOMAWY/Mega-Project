import { LuPiggyBank } from "react-icons/lu";
import { TbMapRoute } from "react-icons/tb";
import { FaHeart } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaRegWindowClose } from "react-icons/fa";
import { MdCategory, MdEdit, MdCheck, MdClose } from "react-icons/md";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/auth/slice";
import {
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetUserFavoritesQuery,
} from "../../features/favorites/favoritesApiSlice";

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
  placeId?: string; // UUID from backend
  showCloseButton?: boolean;
  userCategory?: string;
  isEditingCategory?: boolean;
  newCategory?: string;
  mlScore?: number; // Optional ML recommendation score
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
  placeId,
  showCloseButton = false,
  userCategory,
  isEditingCategory = false,
  newCategory = "",
  mlScore,
  onRemoveFavorite,
  onEditCategory,
  onCategoryChange,
  onCategorySave,
  onCategoryCancel,
}: Props) => {
  const [hasImageError, setHasImageError] = useState(false);
  const user = useSelector(selectCurrentUser);
  
  // Debug logging
  if (!placeId) {
    console.warn(`⚠️ AdvancedCard missing placeId for: ${title}`, { id, placeId, title });
  }

  // API mutations
  const [addFavorite, { isLoading: isAdding }] = useAddFavoriteMutation();
  const [removeFavorite, { isLoading: isRemoving }] = useRemoveFavoriteMutation();

  // Get user's favorites list
  const { data: userFavorites = [] } = useGetUserFavoritesQuery(user?.id || "", {
    skip: !user?.id,
  });

  // Check if this place is in the user's favorites
  const isFavoritedFromAPI = userFavorites.some(fav => fav.placeId === placeId);
  const favoriteState = placeId && user?.id ? isFavoritedFromAPI : initialIsFavorite;
  const isLoadingFavorite = isAdding || isRemoving;

  const roundedRating = Math.max(0, Math.min(5, Math.round(rating ?? 0)));
  const stars = Array.from({ length: 5 }, (_, i) =>
    i < roundedRating ? "★" : "☆"
  ).join("");

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user?.id) {
      alert("Please log in to add favorites");
      return;
    }

    if (!placeId) {
      return;
    }

    try {
      if (favoriteState) {
        // Remove from favorites
        await removeFavorite({ userId: user.id, placeId }).unwrap();
      } else {
        // Add to favorites
        await addFavorite({ userId: user.id, placeId }).unwrap();
      }
    } catch (err: any) {
      // Handle "already exists" error silently (backend quirk)
      const errorMessage = err?.data || err?.message || "";
      if (errorMessage && typeof errorMessage === "string" && errorMessage.includes("Already exists")) {
        return; // Already favorited, that's fine
      }
      console.error("Failed to toggle favorite:", err);
      alert("Failed to update favorites. Please try again.");
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
      className={`w-96 h-[550px] rounded overflow-hidden shadow-md bg-white flex flex-col ${
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
          <div className="ml-auto flex gap-2 items-center">
            {mlScore !== undefined && (
              <div className="text-xs text-white bg-gradient-to-r from-orange-500 to-orange-400 px-3 py-1 rounded-full font-semibold shadow-sm flex items-center gap-1" title="AI Match Score">
                <span className="text-yellow-200">✨</span>
                {Math.round(mlScore * 100)}%
              </div>
            )}
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
            className="text-2xl transition-colors disabled:opacity-50"
            title={favoriteState ? "Remove from favorites" : "Add to favorites"}
            disabled={isLoadingFavorite}
          >
            {isLoadingFavorite ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : favoriteState ? (
              <FaHeart className="text-orange-400" />
            ) : (
              <FaRegHeart className="text-gray-600" />
            )}
          </button>
        </div>

        {placeId ? (
          <Link
            to={`/attraction/${placeId}`}
            className="btn bg-orange-400 align-middle justify-center text-white hover:bg-orange-500"
            onClick={() => {
              console.log('🔗 Navigating to attraction:', { 
                title, 
                placeId, 
                id,
                url: `/attraction/${placeId}` 
              });
            }}
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
