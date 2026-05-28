import React from "react";
import { motion } from "framer-motion";

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
      whileHover={{
        y: -6,
        scale: 1.03,
        transition: { duration: 0.35, ease: "easeOut" }
      }}
      className="group cursor-pointer flex h-full w-full min-w-0 flex-col items-center pb-5 sm:pb-6 relative"
      onClick={() => navigate("products", { category: category.dbCategory })}
    >
      {/* Arched/Dome Image Container with Glassmorphism Pink-White Backdrop & Glow Border */}
      <div className="relative w-full min-w-0 h-[118px] min-[420px]:h-[138px] sm:h-[210px] md:h-[188px] lg:h-[250px] rounded-t-full rounded-b-[20px] sm:rounded-b-[36px] bg-gradient-to-b from-[#FFF3F6]/55 via-[#FFFBFD]/30 to-white/70 backdrop-blur-xs border border-[#FFC0D3] shadow-[0_5px_15px_rgba(255,182,193,0.12)] flex items-center justify-center p-1 sm:p-2.5 overflow-visible transition-all duration-300 ease-out group-hover:shadow-[0_10px_22px_rgba(255,77,109,0.22)] group-hover:border-[#FF4D6D]">
        
        {/* Soft Pink Glow Backdrop */}
        <div className="absolute inset-0 rounded-t-full rounded-b-[18px] sm:rounded-b-[34px] bg-[#FF4D6D]/4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md" />

        {/* Inner arch masking the image */}
        <div className="relative w-full h-full rounded-t-full rounded-b-[16px] sm:rounded-b-[30px] overflow-hidden bg-gradient-to-b from-[#FFF0F3] to-white flex items-center justify-center">
          <img
            src={category.image}
            alt={category.displayName}
            className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-106"
            loading="lazy"
          />
          {/* Subtle gradient overlay for blending */}
          <div className="absolute inset-0 bg-gradient-to-t from-pink-500/5 to-transparent mix-blend-overlay" />
        </div>

        {/* Twinkling Sparkles/Stars */}
        <Sparkles />

        {/* Overlapping Pill-Shaped Glassmorphic Badge at the bottom of the arch */}
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-20 bg-white/85 backdrop-blur-md border border-[#FFA3C4]/60 px-1 py-1 sm:px-3.5 sm:py-1.5 rounded-full shadow-[0_4px_8px_rgba(255,182,193,0.18)] group-hover:shadow-[0_6px_12px_rgba(255,182,193,0.35)] group-hover:border-[#FF4D6D] group-hover:bg-white transition-all duration-300 w-[96%] min-w-0 h-8 sm:h-10 text-center flex flex-col items-center justify-center gap-0.5 overflow-hidden">
          <h3 className="w-full px-1 truncate text-[6px] min-[360px]:text-[7px] sm:text-[9.5px] font-semibold tracking-[0.04em] text-neutral-800 uppercase font-display leading-none">
            {category.displayName}
          </h3>
          <span className="w-full px-1 truncate text-[5px] min-[360px]:text-[6px] sm:text-[7.5px] font-bold text-[#FF4D6D]/75 tracking-widest uppercase leading-none">
            {category.itemsCount}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
