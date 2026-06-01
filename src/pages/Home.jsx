import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import HeroSection from "../sections/HeroSection";
import Categories from "../sections/Categories";
import Deals from "../sections/Deals";
import Trending from "../sections/Trending";
import ProductCard from "../components/ProductCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { Mail, Truck, RefreshCw, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

export default function Home({ navigate }) {
  const { products } = useApp();
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoading(false);
    }, 600);
  };

  const newArrivalsSource = products.filter((p) => p.displaySection === "new_arrivals").slice(0, 16);
  const newArrivals = newArrivalsSource.slice(0, visibleCount);
  const hasMore = visibleCount < newArrivalsSource.length;

  return (
    <div className="flex flex-col w-full font-sans">

      {/* 1. HERO SLIDER */}
      <HeroSection navigate={navigate} />

      {/* 2. FREE SHIPPING & VALUE PROPOSITIONS */}
      <section className="bg-neutral-50 border-y border-neutral-100 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center value-props-mobile-row">
          <div className="flex flex-col items-center justify-center gap-1.5 py-2 md:py-0 value-prop-mobile-item">
            <Truck size={22} className="text-[#FF4D6D] shrink-0 mb-0.5" />
            <div className="text-center">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[10px] text-neutral-500 font-light mt-0.5">On orders above ₹1,500</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 py-2 md:py-0 border-t md:border-t-0 md:border-x border-neutral-200 value-prop-mobile-item">
            <RefreshCw size={22} className="text-[#FF4D6D] shrink-0 mb-0.5" />
            <div className="text-center">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[10px] text-neutral-500 font-light mt-0.5">15-day exchange policy</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center gap-1.5 py-2 md:py-0 border-t md:border-t-0 border-neutral-200 value-prop-mobile-item">
            <ShieldCheck size={22} className="text-[#FF4D6D] shrink-0 mb-0.5" />
            <div className="text-center">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">100% Authentic</h4>
              <p className="text-[10px] text-neutral-500 font-light mt-0.5">Curated premium fashion fabrics</p>
            </div>
          </div>
        </div>
      </section>



      {/* 4. CURATED DEPARTMENTS */}
      <Categories navigate={navigate} />

      {/* 5. DEALS OF THE DAY */}
      <Deals navigate={navigate} />

      {/* 5. TRENDING HILIGHTS */}
      <Trending navigate={navigate} />

      {/* 6. NEW ARRIVALS GRID */}
      <section className="w-full border-t border-neutral-100 pt-6 pb-6 md:pt-8 md:pb-8">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
          <div className="text-center mb-6 md:mb-8">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
              Fresh Arrivals
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] mt-1 font-display">
              New Arrivals
            </h2>
          </div>

          {/* Dynamic Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>

          {/* Action Buttons */}
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




    </div>
  );
}
