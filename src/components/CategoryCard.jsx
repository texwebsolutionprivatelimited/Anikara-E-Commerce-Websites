import React from "react";
import { motion } from "framer-motion";
import ImageKitImage from "./ImageKitImage";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io");
};

// Subtle Sparkle SVGs
const Sparkles = () => {
  return (
    <>
      <svg
        className="absolute top-3 right-3 w-3.5 h-3.5 text-neutral-400/50 animate-sparkle-float pointer-events-none z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
      </svg>
      <svg
        className="absolute bottom-10 left-3 w-3 h-3 text-neutral-300/50 animate-sparkle-float pointer-events-none z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: "1.5s" }}
        aria-hidden="true"
      >
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
      </svg>
    </>
  );
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 85,
      damping: 14
    }
  }
};

export default function CategoryCard({ category, navigate }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigate("products", { category: category.dbCategory });
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      role="button"
      tabIndex={0}
      aria-label={`Browse ${category.displayName} collection`}
      onKeyDown={handleKeyDown}
      onClick={() => navigate("products", { category: category.dbCategory })}
      className="group cursor-pointer flex w-full flex-col items-center relative transition-all duration-300 ease-out hover:-translate-y-2 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 rounded-[28px] sm:rounded-[36px]"
    >
      {/* 
        Fixed Image Container:
        - Reduced top curve height by ~25px (rounded-t-[85px] sm:rounded-t-[110px])
        - Premium subtle box shadow: shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        - Softened border radius: rounded-b-[28px] sm:rounded-b-[36px]
        - Smooth shadow transition on hover: hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)]
      */}
      <div className="relative w-full aspect-[3/4] rounded-t-[85px] sm:rounded-t-[110px] rounded-b-[28px] sm:rounded-b-[36px] bg-[#F5F5F7] shadow-[0_10px_30px_rgba(0,0,0,0.08)] group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] flex items-center justify-center p-3.5 sm:p-5 overflow-hidden transition-all duration-300 ease-out">
        
        {/* Twinkling Sparkles */}
        <Sparkles />

        {/* Product Image inside Container */}
        <div className="relative w-full h-full flex items-center justify-center pt-1 pb-4">
          {isImageKitUrl(category.image) ? (
            <ImageKitImage
              src={category.image}
              alt={category.displayName}
              className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <img
              src={category.image}
              alt={category.displayName}
              className="w-full h-full object-contain drop-shadow-xs transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>

        {/* Overlapping Crisp White Category Label Pill */}
        <div className="absolute bottom-2.5 sm:bottom-3 inset-x-2 sm:inset-x-3 z-20 flex justify-center">
          <div className="w-[90%] py-1.5 sm:py-2 px-3 sm:px-4 rounded-full bg-white border border-neutral-200/80 shadow-sm transition-all duration-300 flex items-center justify-center group-hover:border-neutral-400 group-hover:shadow-md">
            <span className="text-[10.5px] sm:text-[11.5px] font-semibold tracking-wider text-neutral-900 uppercase font-sans truncate text-center leading-none">
              {category.displayName}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

