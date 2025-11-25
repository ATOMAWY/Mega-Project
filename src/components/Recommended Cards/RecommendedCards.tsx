import AdvancedCard from "./../Reusable Components/AdvancedCard";

type Props = {
  attractions: any[];
  showCloseButton?: boolean;
  onRemoveFavorite?: (placeId: number) => void;
  onEditCategory?: (placeId: number, currentCategory?: string) => void;
  editingCategory?: number | null;
  newCategory?: string;
  onCategoryChange?: (category: string) => void;
  onCategorySave?: (placeId: number, category: string) => void;
  onCategoryCancel?: () => void;
};

const RecommendedCards = ({
  attractions,
  showCloseButton = false,
  onRemoveFavorite,
  onEditCategory,
  editingCategory,
  newCategory,
  onCategoryChange,
  onCategorySave,
  onCategoryCancel,
}: Props) => {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-5 justify-center">
        {attractions?.map((attraction, idx) => (
          <AdvancedCard
            photo={attraction.photo}
            title={attraction.title}
            description={attraction.description}
            rating={attraction.rating}
            className=""
            level={attraction.level}
            distance={attraction.distance}
            isFavorite={attraction.isFavorite}
            category={attraction.category}
            id={attraction.id}
            showCloseButton={showCloseButton}
            userCategory={attraction.favoriteData?.userCategory}
            isEditingCategory={editingCategory === attraction.id}
            newCategory={newCategory || ""}
            onRemoveFavorite={
              onRemoveFavorite
                ? () => onRemoveFavorite(attraction.id)
                : undefined
            }
            onEditCategory={
              onEditCategory
                ? () =>
                    onEditCategory(
                      attraction.id,
                      attraction.favoriteData?.userCategory
                    )
                : undefined
            }
            onCategoryChange={onCategoryChange}
            onCategorySave={
              onCategorySave
                ? () => onCategorySave(attraction.id, newCategory || "")
                : undefined
            }
            onCategoryCancel={onCategoryCancel}
            key={attraction.id || idx}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendedCards;
