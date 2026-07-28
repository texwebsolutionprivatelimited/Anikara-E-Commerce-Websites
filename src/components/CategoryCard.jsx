import React from "react";
import { motion } from "framer-motion";
import ImageKitImage from "./ImageKitImage";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.startsWith("/") || !url.startsWith("http");
};

// Sparkle/Twinkle 4-pointed star SVGs
const Sparkles = () => {
  return (
    <>
      {/* Sparkle 1: Top Right */}
      <svg
        className="absolute -top-1.5 -right-1.5 w-3 h-3 text-pink-400/70 animate-sparkle-float pointer-events-none z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4Z" />
      </svg>
      {/* Sparkle 2: Bottom Left */}
      <svg
        className="absolute bottom-5 -left-1.5 w-2.5 h-2.5 text-pink-400/60 animate-sparkle-float pointer-events-none z-10"
        viewBox="0 0 24 24"
        fill="currentColor"
        style={{ animationDelay: "1.5s" }}
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
  return (
    <motion.div
      variants={itemVariants}
      className="group cursor-pointer flex w-full flex-col items-center relative transition-transform duration-300 ease-out hover:-translate-y-[6px]"
      onClick={() => navigate("products", { category: category.dbCategory })}
    >
      {/* Arched Dome Image Container with Glassmorphism Pink-White Backdrop & Glow Border */}
      <div className="relative w-full aspect-[3/4] rounded-t-full rounded-b-[20px] sm:rounded-b-[36px] bg-gradient-to-b from-[#FFF3F6]/55 via-[#FFFBFD]/30 to-white/70 backdrop-blur-xs border border-[#FFC0D3]/50 shadow-[0_4px_12px_rgba(255,182,193,0.1)] flex items-center justify-center p-0.5 sm:p-1.5 overflow-hidden transition-all duration-300 ease-out group-hover:shadow-[0_10px_22px_rgba(255,77,109,0.18)] group-hover:border-[#FF4D6D]">

        {/* Soft Pink Glow Backdrop */}
        <div className="absolute inset-0 rounded-t-full rounded-b-[18px] sm:rounded-b-[34px] bg-[#FF4D6D]/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

        {/* Inner arch masking the image */}
        <div className="relative w-full h-full rounded-t-full rounded-b-[16px] sm:rounded-b-[30px] overflow-hidden bg-gradient-to-b from-[#FFF0F3] to-white flex items-center justify-center">
          {isImageKitUrl(category.image) ? (
            <ImageKitImage
              src={category.image}
              alt={category.displayName}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <img
              src={category.image}
              alt={category.displayName}
              className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}
          {/* Subtle gradient overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent mix-blend-overlay" />
        </div>

        {/* Twinkling Sparkles/Stars */}
        <Sparkles />
      </div>

      {/* Category Name & Count below the card */}
      <div className="mt-3.5 text-center flex flex-col items-center gap-1 w-full">
        <h3 className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-900 uppercase font-display transition-colors duration-300 group-hover:text-[#FF4D6D] px-2 truncate w-full">
          {category.displayName}
        </h3>
        {parseInt(category.itemsCount) > 0 && (
          <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 tracking-widest uppercase font-sans">
            {category.itemsCount}
          </span>
        )}
      </div>
    </motion.div>
  );
}
