import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Loader2 } from "lucide-react";

export default function Trending({ navigate }) {
  const { products } = useApp();
  const [visibleCount, setVisibleCount] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  // Filter high rated products
  const trendingProducts = products.filter((p) => p.rating >= 4.7).slice(0, 16);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoading(false);
    }, 600);
  };

  const hasMore = visibleCount < trendingProducts.length;

  return (
    <section className="w-full border-t border-neutral-100 pt-6 pb-6 md:pt-8 md:pb-8">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
        <div className="text-center mb-6 md:mb-8">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
            High Demand
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] mt-1 font-display">
            Trending Highlights
          </h2>
        </div>

        {/* Dynamic Grid for Trending */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
          {trendingProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>

        {/* Dynamic Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8 md:mt-10">
          {hasMore ? (
            <button
              onClick={handleLoadMore}
              disabled={isLoading}
              className="min-w-[180px] px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Load More
                </>
              ) : (
                "Load More"
              )}
            </button>
          ) : (
            <button
              onClick={() => navigate("products")}
              className="min-w-[180px] px-8 py-3.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none"
            >
              View Full Catalog
            </button>
          )}
        </div>
      </div>
    </section>
  );
}

