import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Clock, ArrowRight } from "lucide-react";

export default function Deals({ navigate }) {
  const { products } = useApp();

  // Filter discounted items
  const dealProducts = products.filter((p) => p.oldPrice > p.price);

  // Visible count state for "Load More"
  const [visibleCount, setVisibleCount] = useState(4);

  // Countdown cycle (24-hour cycle)
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 22, seconds: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="bg-neutral-50 pt-4 pb-4 md:pt-6 md:pb-6 border-y border-neutral-100">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-6">
          
          {/* Header and Countdown */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
              Flash Promotion
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] font-display">
              Deals of the Day
            </h2>
            
            {/* Countdown UI */}
            <div className="flex flex-wrap items-center gap-2 pt-1 font-display">
              <Clock size={16} className="text-[#FF4D6D]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mr-2">ENDS IN:</span>
              <div className="flex gap-1.5">
                <div className="bg-[#111111] text-white font-bold text-xs px-2 py-1 min-w-[28px] text-center rounded-xs">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="text-neutral-900 font-bold">:</span>
                <div className="bg-[#111111] text-white font-bold text-xs px-2 py-1 min-w-[28px] text-center rounded-xs">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="text-neutral-900 font-bold">:</span>
                <div className="bg-[#FF4D6D] text-white font-bold text-xs px-2 py-1 min-w-[28px] text-center rounded-xs">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>

          {/* View Deals Link */}
          <div>
            <button
              onClick={() => navigate("products", { badge: "Sale" })}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#FF4D6D] uppercase tracking-widest transition-colors font-display cursor-pointer focus:outline-none"
            >
              View All Deals
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Static Grid for Deals */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
          {dealProducts.slice(0, visibleCount).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < dealProducts.length && (
          <div className="text-center mt-4 md:mt-6">
            <button
              onClick={() => setVisibleCount((prev) => Math.min(prev + 4, dealProducts.length))}
              className="px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none"
            >
              Load More Deals
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
