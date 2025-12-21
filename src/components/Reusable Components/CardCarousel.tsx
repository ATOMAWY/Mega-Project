import { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";
import SimpleCard from "./SimpleCard.tsx";

type Props = {
  items: any[];
  className: string;
};

const CardCarousel = ({ items, className }: Props) => {
  const scrollerRef = useRef(null);

  const scrollByWidth = (direction: any) => {
    const el = scrollerRef.current as any;
    if (!el) return;
    const amount = el.clientWidth * 0.8; // scroll by 80% of visible width
    el.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <div className={`relative ${className} `}>
      <button
        aria-label="Scroll left"
        onClick={() => scrollByWidth("left")}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow-md "
      >
        <FaArrowLeft />
      </button>

      <div
        ref={scrollerRef}
        className="flex gap-4 overflow-x-auto scroll-smooth lg:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-0 py-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items && items.length > 0 ? (
          items.map((attraction: any, idx: number) => (
            <div key={idx} className="flex-shrink-0">
              <SimpleCard
                photo={attraction.photo || ""}
                title={attraction.title || ""}
                description={attraction.description || ""}
                rating={attraction.rating || 0}
                className=""
                level={attraction.level || ""}
                distance={attraction.distance || ""}
                isFavorite={attraction.isFavorite || false}
                category={attraction.category || ""}
                id={attraction.id !== undefined ? attraction.id : idx}
                placeId={attraction.placeId}
              />
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center py-8">
            No attractions available
          </div>
        )}
      </div>

      <button
        aria-label="Scroll right"
        onClick={() => scrollByWidth("right")}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-10 p-2 bg-white/90 rounded-full shadow-md"
      >
        <FaArrowRight />
      </button>
    </div>
  );
};

export default CardCarousel;
