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
  const { products, addToast } = useApp();

  // Load More logic states
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 4, products.length));
      setIsLoadingMore(false);
    }, 1200);
  };

  // Newsletter Email submit
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.newsletterEmail.value;
    if (emailInput) {
      addToast("Thank you for subscribing to our Newsletter!", "success");
      e.target.reset();
    }
  };

  const newArrivals = products.slice(0, visibleCount);

  return (
    <div className="flex flex-col w-full font-sans">
      
      {/* 1. HERO SLIDER */}
      <HeroSection navigate={navigate} />

      {/* 2. FREE SHIPPING & VALUE PROPOSITIONS */}
      <section className="bg-neutral-50 border-b border-neutral-100 py-4 md:py-5">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Truck size={20} className="text-[#FF4D6D]" />
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Free Shipping</h4>
              <p className="text-[10px] text-neutral-500 font-light">On orders above ₹1,500</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 border-y sm:border-y-0 sm:border-x border-neutral-200 py-4 sm:py-0">
            <RefreshCw size={20} className="text-[#FF4D6D]" />
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">Easy Returns</h4>
              <p className="text-[10px] text-neutral-500 font-light">15-day exchange policy</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <ShieldCheck size={20} className="text-[#FF4D6D]" />
            <div className="text-center sm:text-left">
              <h4 className="text-xs font-bold text-neutral-800 uppercase tracking-wider">100% Authentic</h4>
              <p className="text-[10px] text-neutral-500 font-light">Curated premium fashion fabrics</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. COUPON OFFER BANNER */}
      <section className="w-full py-5 md:py-7 bg-white border-b border-neutral-100">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
          <CouponBanner navigate={navigate} />
        </div>
      </section>

      {/* 4. DEALS OF THE DAY */}
      <Deals navigate={navigate} />


      {/* 4. CURATED DEPARTMENTS */}
      <Categories navigate={navigate} />

      {/* 5. TRENDING HILIGHTS */}
      <Trending navigate={navigate} />

      {/* 6. NEW ARRIVALS GRID */}
      <section className="w-full border-t border-neutral-100 pt-4 pb-4 md:pt-6 md:pb-6">
        <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
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

          {/* Skeleton Loader on Load More */}
          {isLoadingMore && (
            <div className="mt-6">
              <SkeletonLoader count={4} />
            </div>
          )}

          {/* Load More Button */}
          {visibleCount < products.length && !isLoadingMore && (
            <div className="text-center mt-4 md:mt-6">
              <button
                onClick={handleLoadMore}
                className="px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none"
              >
                Load More Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 7. NEWSLETTER DROPS */}
      <section className="bg-neutral-900 text-white py-8 md:py-10 font-sans">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4 md:space-y-6">
          <div className="inline-flex p-3 rounded-full bg-white/5 border border-white/10 text-[#FF4D6D]">
            <Mail size={24} />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl md:text-2xl font-bold tracking-wider uppercase font-display">
              Join the Anikara Club
            </h2>
            <p className="text-xs md:text-sm text-neutral-400 font-light max-w-md mx-auto leading-relaxed">
              Subscribe to get exclusive early access to drop collections, limited-edition codes, and premium lookbooks.
            </p>
          </div>

          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              name="newsletterEmail"
              required
              placeholder="Your email address"
              className="flex-grow bg-white/5 border border-white/10 text-white text-xs px-5 py-3.5 focus:outline-none focus:border-[#FF4D6D] placeholder:text-neutral-500 font-light"
            />
            <button
              type="submit"
              className="bg-white hover:bg-[#FF4D6D] text-[#111111] hover:text-white text-xs font-bold tracking-widest uppercase px-6 py-3.5 transition-colors duration-300 shrink-0 font-display cursor-pointer focus:outline-none"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
}
