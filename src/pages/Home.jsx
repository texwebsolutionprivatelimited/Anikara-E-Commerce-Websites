import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import HeroSection from "../sections/HeroSection";
import Categories from "../sections/Categories";
import Deals from "../sections/Deals";
import Trending from "../sections/Trending";
import ProductCard from "../components/ProductCard";
import { Truck, RefreshCw, ShieldCheck, Star, ArrowRight, Loader2 } from "lucide-react";

export default function Home({ navigate }) {
  const { products } = useApp();
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6);
      setIsLoading(false);
    }, 600);
  };

  const newArrivalsSource = products.filter((p) => p.displaySection === "new_arrivals").slice(0, 18);
  const newArrivals = newArrivalsSource.slice(0, visibleCount);
  const hasMore = visibleCount < newArrivalsSource.length;

  return (
    <div className="flex flex-col w-full font-sans">

      {/* 1. HERO SLIDER */}
      <HeroSection navigate={navigate} />

      {/* 2. CATEGORIES (HOT CATEGORIES) */}
      <Categories navigate={navigate} />

      {/* 3. LUXURY TRUST SECTION (4 Cards: Glass, soft gradient, larger animated icon, 6-8px hover lift) */}
      <section className="bg-[#FAF9F6] border-y border-neutral-200/50 py-7 sm:py-9 font-sans">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* Card 1: Free Shipping */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-white via-[#FFF9FA] to-[#FFF0F3] border border-[#FF4D6D]/15 p-5 sm:p-6 backdrop-blur-md shadow-[0_4px_20px_rgba(255,77,109,0.04)] hover:shadow-[0_20px_40px_rgba(255,77,109,0.15)] hover:border-[#FF4D6D]/40 hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-default">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF1E46] text-white flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(255,77,109,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Truck size={26} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#111111] tracking-wide font-display group-hover:text-[#FF4D6D] transition-colors">Free Shipping</h4>
                <p className="text-xs text-neutral-500 font-light mt-0.5 leading-relaxed">On all orders above ₹1,500</p>
              </div>
            </div>

            {/* Card 2: Secure Payment */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-white via-[#FFF9FA] to-[#FFF0F3] border border-[#FF4D6D]/15 p-5 sm:p-6 backdrop-blur-md shadow-[0_4px_20px_rgba(255,77,109,0.04)] hover:shadow-[0_20px_40px_rgba(255,77,109,0.15)] hover:border-[#FF4D6D]/40 hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-default">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF1E46] text-white flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(255,77,109,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <ShieldCheck size={26} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#111111] tracking-wide font-display group-hover:text-[#FF4D6D] transition-colors">Secure Payment</h4>
                <p className="text-xs text-neutral-500 font-light mt-0.5 leading-relaxed">100% encrypted & protected</p>
              </div>
            </div>

            {/* Card 3: Premium Quality */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-white via-[#FFF9FA] to-[#FFF0F3] border border-[#FF4D6D]/15 p-5 sm:p-6 backdrop-blur-md shadow-[0_4px_20px_rgba(255,77,109,0.04)] hover:shadow-[0_20px_40px_rgba(255,77,109,0.15)] hover:border-[#FF4D6D]/40 hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-default">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF1E46] text-white flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(255,77,109,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <Star size={26} className="stroke-[2.2] fill-white/20" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#111111] tracking-wide font-display group-hover:text-[#FF4D6D] transition-colors">Premium Quality</h4>
                <p className="text-xs text-neutral-500 font-light mt-0.5 leading-relaxed">Handcrafted luxury fabrics</p>
              </div>
            </div>

            {/* Card 4: Easy Returns */}
            <div className="group relative rounded-2xl bg-gradient-to-br from-white via-[#FFF9FA] to-[#FFF0F3] border border-[#FF4D6D]/15 p-5 sm:p-6 backdrop-blur-md shadow-[0_4px_20px_rgba(255,77,109,0.04)] hover:shadow-[0_20px_40px_rgba(255,77,109,0.15)] hover:border-[#FF4D6D]/40 hover:-translate-y-2 transition-all duration-300 flex items-center gap-4 cursor-default">
              <div className="w-13 h-13 sm:w-15 sm:h-15 rounded-2xl bg-gradient-to-br from-[#FF4D6D] to-[#FF1E46] text-white flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(255,77,109,0.3)] group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <RefreshCw size={26} className="stroke-[2.2]" />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-extrabold text-[#111111] tracking-wide font-display group-hover:text-[#FF4D6D] transition-colors">Easy Returns</h4>
                <p className="text-xs text-neutral-500 font-light mt-0.5 leading-relaxed">15-day doorstep exchange</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DEALS OF THE DAY */}
      <Deals navigate={navigate} />

      {/* 5. TRENDING HIGHLIGHTS */}
      <Trending navigate={navigate} />

      {/* 6. NEW ARRIVALS GRID (Compact spacing & 48px header hierarchy) */}
      <section className="w-full border-t border-neutral-100 py-6 sm:py-8 md:py-10 font-sans">
        <div className="max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center mb-5 sm:mb-7">
            <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
              Fresh Arrivals
            </span>
            <h2 className="text-2xl min-[375px]:text-3xl md:text-4xl lg:text-[48px] font-black tracking-tight leading-tight text-[#111111] mt-1 font-display">
              New Arrivals
            </h2>
          </div>

          {/* Desktop/Laptop Banner */}
          <div 
            onClick={() => navigate("products")}
            className="hidden lg:block w-full mb-6 cursor-pointer overflow-hidden rounded-xl shadow-sm hover:opacity-95 transition-all duration-300"
          >
            <img 
              src="/11.png" 
              alt="New Arrivals Banner" 
              className="w-full h-auto object-contain rounded-xl block"
            />
          </div>

          {/* Mobile/Tablet Banner */}
          <div 
            onClick={() => navigate("products")}
            className="block lg:hidden w-full mb-4 cursor-pointer overflow-hidden rounded-lg shadow-sm hover:opacity-95 transition-all duration-300"
          >
            <img 
              src="/33.jpeg" 
              alt="New Arrivals Mobile Banner" 
              className="w-full h-auto object-contain rounded-lg block"
            />
          </div>

          {/* Dynamic Grid (6 items per row on desktop) */}
          <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-x-2.5 min-[375px]:gap-x-3.5 sm:gap-x-4 lg:gap-x-5 gap-y-4 sm:gap-y-6">
            {newArrivals.map((product) => (
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

    </div>
  );
}
