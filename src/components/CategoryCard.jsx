import React from "react";
import { motion } from "framer-motion";
import ImageKitImage from "./ImageKitImage";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io");
};

// Soft Pink Twinkling Sparkle SVGs (from reference image)
const Sparkles = () => {
  return (
    <>
      {/* Top Right Sparkle */}
      <svg
        className="absolute top-2.5 right-2.5 w-3.5 h-3.5 text-[#FF9EAF]/75 animate-sparkle-float pointer-events-none z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
      </svg>
      {/* Bottom Left Sparkle */}
      <svg
        className="absolute bottom-9 left-2.5 w-3 h-3 text-[#FF9EAF]/60 animate-sparkle-float pointer-events-none z-10"
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
      className="group cursor-pointer flex w-full flex-col items-center relative transition-all duration-300 ease-out hover:-translate-y-2 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 pb-1"
    >
      {/* 
        Compact Arch Dome Box (decreased from all directions: top, bottom, left, right):
        - Controlled width: w-[78%] sm:w-[82%] md:w-[84%] max-w-[210px]
        - Shorter top/bottom height: aspect-[1/1.05]
        - Semi-circular top arch: rounded-t-full rounded-b-[18px] sm:rounded-b-[24px]
        - Pastel pink background fill: bg-gradient-to-b from-[#FFF2F5] via-[#FFE5EE] to-[#FFDCE5]
      */}
      <div className="relative w-[78%] sm:w-[82%] md:w-[84%] max-w-[210px] aspect-[1/1.05] rounded-t-full rounded-b-[18px] sm:rounded-b-[24px] bg-gradient-to-b from-[#FFF2F5] via-[#FFE5EE] to-[#FFDCE5] shadow-[0_6px_20px_rgba(255,182,193,0.25)] group-hover:shadow-[0_12px_28px_rgba(255,77,109,0.35)] flex items-center justify-center p-2 sm:p-3 overflow-hidden transition-all duration-300 ease-out">
        
        {/* Twinkling Sparkles */}
        <Sparkles />

        {/* Transparent Floating Product Cutout Image */}
        <div className="relative w-full h-full flex items-center justify-center pt-0.5 pb-2">
          {isImageKitUrl(category.image) ? (
            <ImageKitImage
              src={category.image}
              alt={category.displayName}
              className="w-full h-full object-contain object-center drop-shadow-xs transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <img
              src={category.image}
              alt={category.displayName}
              className="w-full h-full object-contain object-center drop-shadow-xs transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
        </div>

        {/* Category Button Pill Capsule */}
        <div className="absolute -bottom-1 sm:-bottom-1.5 inset-x-0.5 sm:inset-x-1 z-20 flex justify-center">
          <div className="w-[94%] py-1 sm:py-1.5 px-1.5 rounded-full bg-gradient-to-r from-[#FFE5EE] via-[#FFCAD7] to-[#FFE5EE] border-2 border-white shadow-[0_3px_10px_rgba(255,154,175,0.35)] group-hover:shadow-[0_5px_14px_rgba(255,77,109,0.45)] group-hover:from-[#FFCBD7] group-hover:via-[#FFB3C6] group-hover:to-[#FFCBD7] transition-all duration-300 flex items-center justify-center">
            <span className="text-[9.5px] sm:text-[11px] font-black tracking-wider text-neutral-900 uppercase font-sans truncate px-1 text-center leading-none">
              {category.displayName}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

