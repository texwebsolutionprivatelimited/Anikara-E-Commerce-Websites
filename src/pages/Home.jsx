import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import HeroSection from "../sections/HeroSection";
import Categories from "../sections/Categories";
import Deals from "../sections/Deals";
import Trending from "../sections/Trending";
import ProductCard from "../components/ProductCard";
import SkeletonLoader from "../components/SkeletonLoader";
import CouponBanner from "../components/CouponBanner";
import { Mail, Truck, RefreshCw, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home({ navigate }) {
  const { products } = useApp();

  const newArrivals = products.slice(0, 8);

  return (
    <div className="flex flex-col w-full font-sans">
      
      {/* 1. HERO SLIDER */}
      <HeroSection navigate={navigate} />

      {/* 2. FREE SHIPPING & VALUE PROPOSITIONS */}
      <section className="bg-neutral-50 border-y border-neutral-100 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-center value-props-mobile-row">
          <div className="flex flex-row md:flex-col lg:flex-row items-center justify-center gap-3 py-2 md:py-0 value-prop-mobile-item">
            <Truck size={20} className="text-[#FF4D6D] shrink-0" />
            <div className="text-left md:text-center lg:text-left">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[10px] text-neutral-500 font-light">On orders above ₹1,500</p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col lg:flex-row items-center justify-center gap-3 py-2 md:py-0 border-t md:border-t-0 md:border-x border-neutral-200 value-prop-mobile-item">
            <RefreshCw size={20} className="text-[#FF4D6D] shrink-0" />
            <div className="text-left md:text-center lg:text-left">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[10px] text-neutral-500 font-light">15-day exchange policy</p>
            </div>
          </div>
          <div className="flex flex-row md:flex-col lg:flex-row items-center justify-center gap-3 py-2 md:py-0 border-t md:border-t-0 border-neutral-200 value-prop-mobile-item">
            <ShieldCheck size={20} className="text-[#FF4D6D] shrink-0" />
            <div className="text-left md:text-center lg:text-left">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">100% Authentic</h4>
              <p className="text-[10px] text-neutral-500 font-light">Curated premium fashion fabrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COUPON OFFER BANNER */}
      <section className="w-full py-2.5 md:py-3.5 bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16">
          <CouponBanner navigate={navigate} />
        </div>
      </section>

      {/* 4. CURATED DEPARTMENTS */}
      <Categories navigate={navigate} />

      {/* 5. DEALS OF THE DAY */}
      <Deals navigate={navigate} />

      {/* 5. TRENDING HILIGHTS */}
      <Trending navigate={navigate} />

      {/* 6. NEW ARRIVALS GRID */}
      <section className="w-full border-t border-neutral-100 pt-4 pb-4 md:pt-6 md:pb-6">
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

          {/* View All Button */}
          <div className="text-center mt-6 md:mt-8">
            <button
              onClick={() => navigate("products")}
              className="px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none"
            >
              View All Products
            </button>
          </div>
        </div>
      </section>



    </div>
  );
}
