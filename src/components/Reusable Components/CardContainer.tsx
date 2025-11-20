import React, { useRef } from "react";
import { FaArrowRight } from "react-icons/fa";
import { FaArrowLeft } from "react-icons/fa";

import Card from "./Card";

const CardContainer = ({ items = [], className = "" }: any) => {
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
        className="flex gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-0 py-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {items.length === 0
          ? // ay klam l7ad ma yeb2a fi database
            Array.from({ length: 100 }).map((_, i) => (
              <div key={i} className="flex-shrink-0" style={{ width: 280 }}>
                <Card
                  title={`Sample ${i + 1}`}
                  description="Sample description"
                  rating={Math.floor(Math.random() * 5) + 1}
                />
              </div>
            ))
          : items.map((it: any, idx: number) => (
              <div key={idx} className="flex-shrink-0" style={{ width: 280 }}>
                <Card
                  photo={it.photo}
                  title={it.title}
                  description={it.description}
                  rating={it.rating}
                />
              </div>
            ))}
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

export default CardContainer;
