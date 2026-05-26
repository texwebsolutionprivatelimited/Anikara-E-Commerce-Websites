import React from "react";
import { ArrowRight } from "lucide-react";

export default function CategoryCard({ category, navigate }) {
  return (
    <div
      className="group cursor-pointer flex flex-col w-full"
      onClick={() => navigate("products", { category: category.name })}
    >
      {/* Image Container with Portrait Aspect Ratio & Zoom Effect */}
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-neutral-100 rounded-md sm:rounded-lg">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
          loading="lazy"
        />
        {/* Soft overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
      </div>

      {/* Info & Button Section Below Image */}
      <div className="flex items-start justify-between gap-2 pt-3 pb-1">
        <div className="space-y-0.5 min-w-0">
          <h3 className="text-[12px] sm:text-[15px] font-bold tracking-wide text-[#111111] uppercase font-display leading-tight break-words">
            {category.name}
          </h3>
          <span className="text-[10px] sm:text-xs text-neutral-500 font-light block">
            {category.itemsCount}
          </span>
        </div>
        
        {/* Action Button */}
        <div className="inline-flex items-center gap-1 text-[#111111] group-hover:text-[#FF4D6D] transition-colors duration-300">
          <span className="hidden sm:inline text-[9px] font-bold tracking-widest uppercase">Explore</span>
          <span className="inline-flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full border border-neutral-200 group-hover:border-[#FF4D6D] group-hover:bg-[#FF4D6D] group-hover:text-white transition-all duration-300">
            <ArrowRight size={12} className="transform group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
}
