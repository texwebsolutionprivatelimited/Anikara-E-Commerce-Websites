import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";

export default function Trending({ navigate }) {
  const { products } = useApp();

  // Filter high rated products
  const trendingProducts = products.filter((p) => p.rating >= 4.7);

  // Visible count state for "Load More"
  const [visibleCount, setVisibleCount] = useState(4);

  return (
    <section className="w-full border-t border-neutral-100 pt-4 pb-4 md:pt-6 md:pb-6">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="text-center mb-6 md:mb-8">
          <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
            High Demand
          </span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] mt-1 font-display">
            Trending Highlights
          </h2>
        </div>

        {/* Static Grid for Trending */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
          {trendingProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < trendingProducts.length && (
          <div className="text-center mt-4 md:mt-6">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 4, trendingProducts.length))}
              className="px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Load More Trending
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
