import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Loader2, ArrowRight } from "lucide-react";

export default function Trending({ navigate }) {
  const { products } = useApp();
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const trendingProducts = products.filter((p) => p.displaySection === "trending").slice(0, 18);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoading(false);
    }, 600);
  };

  const hasMore = visibleCount < trendingProducts.length;

  return (
    <section className="w-full py-5 sm:py-7 md:py-9 font-sans">
      <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8">
        <div className="text-center mb-5 sm:mb-7">
          <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
            High Demand
          </span>
          <h2 className="text-2xl min-[375px]:text-3xl md:text-4xl lg:text-[48px] font-black tracking-tight leading-tight text-[#111111] mt-1 font-display">
            Trending Highlights
          </h2>
        </div>

        {/* Desktop/Laptop Banner */}
        <div 
          onClick={() => navigate("products")}
          className="hidden lg:block w-full mb-6 cursor-pointer overflow-hidden rounded-xl shadow-sm hover:opacity-95 transition-all duration-300"
        >
          <img 
            src="/8.png" 
            alt="Trending Highlights Banner" 
            className="w-full h-auto object-contain rounded-xl block"
          />
        </div>

        {/* Mobile/Tablet Banner */}
        <div 
          onClick={() => navigate("products")}
          className="block lg:hidden w-full mb-4 cursor-pointer overflow-hidden rounded-lg shadow-sm hover:opacity-95 transition-all duration-300"
        >
          <img 
            src="/3.jpeg" 
            alt="Trending Mobile Banner" 
            className="w-full h-auto object-contain rounded-lg block"
          />
        </div>

        {/* Dynamic Grid for Trending (6 items per row on desktop) */}
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-2.5 min-[375px]:gap-x-3.5 sm:gap-x-4 lg:gap-x-5 gap-y-4 sm:gap-y-6">
          {trendingProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>

        {/* Gradient Ripple Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-6 sm:mt-8">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] hover:from-[#FF4D6D] hover:to-[#FF1E46] text-white text-[13px] md:text-[15px] font-bold tracking-widest uppercase transition-all duration-500 rounded-full shadow-lg hover:shadow-[0_8px_30px_rgba(255,77,109,0.45)] hover:scale-105 cursor-pointer focus:outline-none font-sans"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              {isLoading ? (
                <span className="relative z-10 flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Loading...
                </span>
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  Load More <ArrowRight size={16} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </span>
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("products")}
              className="relative group overflow-hidden inline-flex items-center justify-center gap-2.5 px-8 sm:px-10 py-3.5 sm:py-4 bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] hover:from-[#FF4D6D] hover:to-[#FF1E46] text-white text-[13px] md:text-[15px] font-bold tracking-widest uppercase transition-all duration-500 rounded-full shadow-lg hover:shadow-[0_8px_30px_rgba(255,77,109,0.45)] hover:scale-105 cursor-pointer focus:outline-none font-sans"
            >
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none" />
              <span className="relative z-10">View Full Catalog</span>
              <ArrowRight size={16} className="relative z-10 group-hover:translate-x-1.5 transition-transform duration-300" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
