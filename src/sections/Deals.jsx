import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Clock, ArrowRight } from "lucide-react";

export default function Deals({ navigate }) {
  const { products } = useApp();

  // Filter discounted items
  const dealProducts = products.filter((p) => {
    const section = p.displaySection && p.displaySection !== "all" ? p.displaySection : "deals";
    return section === "deals";
  });

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
    <section className="bg-neutral-50 pt-6 pb-6 md:pt-8 md:pb-8 border-y border-neutral-100">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
        <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-8 gap-4">
          
          {/* Header and Countdown */}
          <div className="space-y-2.5 flex flex-col items-center">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#FF4D6D] uppercase font-display">
              Flash Promotion
            </span>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#111111] font-display">
              Deals of the Day
            </h2>
            
            {/* Countdown UI */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-1 font-display">
              <Clock size={16} className="text-[#E54B68]" />
              <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500 mr-2">ENDS IN:</span>
              <div className="flex gap-1.5 items-center">
                <div className="bg-[#111111] text-white font-bold text-xs w-9 h-9 flex items-center justify-center rounded-md shadow-xs">
                  {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="text-neutral-955 font-bold">:</span>
                <div className="bg-[#111111] text-white font-bold text-xs w-9 h-9 flex items-center justify-center rounded-md shadow-xs">
                  {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="text-neutral-955 font-bold">:</span>
                <div className="bg-[#E54B68] text-white font-bold text-xs w-9 h-9 flex items-center justify-center rounded-md shadow-xs">
                  {String(timeLeft.seconds).padStart(2, "0")}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Static Grid for Deals */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
          {dealProducts.slice(0, 12).map((product) => (
            <ProductCard key={product.id} product={product} navigate={navigate} />
          ))}
        </div>

        {/* View All Deals Button */}
        <div className="text-center mt-8 md:mt-10">
          <button
            onClick={() => navigate("products", { badge: "Sale" })}
            className="px-8 py-3.5 border border-[#111111] hover:bg-black hover:text-white hover:border-black text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none rounded-sm shadow-sm hover:shadow-md"
          >
            View All Deals
          </button>
        </div>
      </div>
    </section>
  );
}
