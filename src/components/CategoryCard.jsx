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
        className="absolute top-1 right-1 sm:top-2.5 sm:right-2.5 w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-[#FF9EAF]/75 animate-sparkle-float pointer-events-none z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
      </svg>
      {/* Bottom Left Sparkle */}
      <svg
        className="absolute bottom-4 left-1 sm:bottom-9 sm:left-2.5 w-2 h-2 sm:w-3 sm:h-3 text-[#FF9EAF]/60 animate-sparkle-float pointer-events-none z-10"
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
      className="group cursor-pointer flex w-full flex-col items-center relative transition-all duration-300 ease-out hover:-translate-y-1.5 sm:hover:-translate-y-2 outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-2 pb-2.5 min-[360px]:pb-3 sm:pb-5"
    >
      {/* 
        Arch Dome Box Container:
        - Pastel pink background gradient fill
        - Controlled max-width: max-w-[280px]
        - Proportional aspect ratio: aspect-[1/1.05]
      */}
      <div className="relative w-full sm:w-[86%] max-w-[280px] aspect-[1/1.05] rounded-t-full rounded-b-[12px] min-[360px]:rounded-b-[16px] sm:rounded-b-[26px] bg-gradient-to-b from-[#FFF2F5] via-[#FFE8F0] to-[#FFDCE5] shadow-[0_3px_10px_rgba(255,182,193,0.2)] sm:shadow-[0_6px_20px_rgba(255,182,193,0.25)] group-hover:shadow-[0_10px_28px_rgba(255,77,109,0.3)] flex items-center justify-center transition-all duration-300 ease-out">
        
        {/* Inner Dome clipping for sparkles & transparent image cutout */}
        <div className="absolute inset-0 rounded-t-full rounded-b-[12px] min-[360px]:rounded-b-[16px] sm:rounded-b-[26px] overflow-hidden p-1 min-[360px]:p-1.5 sm:p-3.5 flex items-center justify-center">
          {/* Twinkling Sparkles */}
          <Sparkles />

          {/* Transparent Floating Product Cutout Image */}
          <div className="relative w-full h-full flex items-center justify-center pt-0.5 pb-1.5 sm:pt-1 sm:pb-3">
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
        </div>

        {/* Crisp White Glass Floating Pill Button Capsule */}
        <div className="absolute -bottom-2 min-[360px]:-bottom-2.5 sm:-bottom-3.5 inset-x-0 z-20 flex justify-center w-full px-0.5 sm:px-1">
          <div className="w-auto max-w-[98%] sm:max-w-[92%] py-0.5 min-[360px]:py-1 sm:py-2 px-1 min-[360px]:px-1.5 sm:px-4 rounded-full bg-white/95 backdrop-blur-md border border-neutral-200/90 shadow-[0_2px_8px_rgba(0,0,0,0.06)] group-hover:border-[#FF4D6D]/40 group-hover:shadow-[0_8px_24px_rgba(255,77,109,0.25)] group-hover:scale-105 transition-all duration-300 flex items-center justify-center shrink-0 min-w-0">
            <span className="text-[6.5px] min-[340px]:text-[7.5px] min-[375px]:text-[8.5px] min-[410px]:text-[9.5px] sm:text-xs font-bold tracking-tight min-[360px]:tracking-normal sm:tracking-widest text-[#111111] uppercase font-sans truncate px-0.5 text-center leading-none group-hover:text-[#FF4D6D] transition-colors duration-300">
              {category.displayName}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

