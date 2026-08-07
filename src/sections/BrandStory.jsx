import React, { useState, useEffect, useRef } from "react";
import { Sparkles, ShieldCheck, Heart, Leaf, Scissors, RotateCcw, Users, Star, Package, Award } from "lucide-react";

const BRAND_FEATURES = [
  {
    id: "fabric",
    icon: Sparkles,
    title: "Premium Fabrics",
    desc: "100% Handpicked luxe cotton, silk & natural breathable weaves crafted for all-day comfort.",
    badge: "Luxe Quality"
  },
  {
    id: "india",
    icon: Heart,
    title: "Designed in India",
    desc: "Rooted in rich Indian textile heritage, reimagined with chic modern minimalist aesthetics.",
    badge: "Make in India"
  },
  {
    id: "eco",
    icon: Leaf,
    title: "Eco Friendly",
    desc: "Sustainable ethical manufacturing with organic dyes & 100% plastic-free recyclable packaging.",
    badge: "100% Sustainable"
  },
  {
    id: "craft",
    icon: Scissors,
    title: "Handcrafted",
    desc: "Artisanal precision, reinforced stitching & handcrafted embellishments in every garment.",
    badge: "Master Artisans"
  },
  {
    id: "returns",
    icon: RotateCcw,
    title: "Easy Returns",
    desc: "15-Day hassle-free, no-questions-asked doorstep pickup and instant refunds.",
    badge: "Peace of Mind"
  }
];

// Custom Animated Counter Triggered on Scroll
function CounterNumber({ endVal, suffix = "", decimal = false }) {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasStarted) {
          setHasStarted(true);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    let start = 0;
    const duration = 1800;
    const steps = 50;
    const increment = endVal / steps;
    const stepTime = duration / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= endVal) {
        setCount(endVal);
        clearInterval(timer);
      } else {
        setCount(decimal ? Math.round(start * 10) / 10 : Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [hasStarted, endVal, decimal]);

  return (
    <span ref={ref} className="font-black text-2xl sm:text-3xl lg:text-4xl text-white font-display">
      {decimal ? count.toFixed(1) : count.toLocaleString("en-IN")}{suffix}
    </span>
  );
}

export default function BrandStory({ navigate }) {
  return (
    <section className="relative overflow-hidden bg-[#0a0a0a] text-white pt-14 pb-16 font-sans border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      {/* Soft Ambient Background Glows */}
      <div className="absolute top-0 left-1/3 w-[400px] h-[400px] bg-[#FF4D6D]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[350px] h-[350px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-[1720px] mx-auto px-4 sm:px-8 lg:px-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-ping" />
            Our Brand Promise
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white font-display">
            Why Anikara?
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-light mt-2 leading-relaxed">
            Crafted with passion, designed for elegance — where luxury meets everyday comfort.
          </p>
        </div>

        {/* Brand Features: Horizontal snap-swipe carousel on mobile, responsive grid on tablet/desktop */}
        <div className="relative">
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide sm:grid sm:grid-cols-2 lg:grid-cols-5 sm:pb-0 px-1">
            {BRAND_FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="w-[82vw] shrink-0 snap-center sm:w-auto sm:shrink group relative rounded-2xl bg-gradient-to-b from-white/[0.05] to-white/[0.01] border border-white/10 p-5 sm:p-6 backdrop-blur-md hover:bg-white/[0.09] hover:border-[#FF4D6D]/60 hover:-translate-y-2 hover:shadow-[0_12px_35px_rgba(255,77,109,0.25)] transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Thin Animated Accent Top Bar */}
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#FF4D6D] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-t-2xl" />

                  <div className="space-y-4">
                    {/* Icon & Badge */}
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-[#FF4D6D]/15 border border-[#FF4D6D]/30 text-[#FF4D6D] flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 group-hover:bg-[#FF4D6D] group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon size={20} />
                      </div>
                      <span className="text-[9px] font-bold tracking-wider uppercase text-neutral-300 bg-white/10 border border-white/15 px-2.5 py-0.5 rounded-full group-hover:border-[#FF4D6D]/50 group-hover:text-[#FF4D6D] transition-colors">
                        {item.badge}
                      </span>
                    </div>

                    {/* Title & Desc */}
                    <div>
                      <h3 className="text-base font-bold text-white font-display tracking-wide group-hover:text-[#FF4D6D] transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-400 font-light leading-relaxed mt-1.5">
                        {item.desc}
                      </p>
                    </div>
                  </div>

                  {/* Micro Bottom Line Accent */}
                  <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-[#FF4D6D]/30 to-transparent mt-5 group-hover:via-[#FF4D6D] transition-all duration-500" />
                </div>
              );
            })}
          </div>
        </div>

        {/* LUXURY STATISTIC STRIP (Enlarged counter numbers for mobile) */}
        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-white/10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8 text-center bg-white/[0.02] border border-white/10 rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-lg">
            
            {/* Stat 1: 20K+ Happy Customers */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="flex items-center gap-1.5">
                <Users size={22} className="text-[#FF4D6D] mb-1 shrink-0" />
                <CounterNumber endVal={20} suffix="K+" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium mt-1 tracking-wider uppercase">
                Happy Customers
              </p>
            </div>

            {/* Stat 2: 4.9★ Customer Rating */}
            <div className="flex flex-col items-center justify-center border-l border-white/10 py-1">
              <div className="flex items-center gap-1.5">
                <Star size={22} className="fill-amber-400 text-amber-400 mb-1 shrink-0" />
                <CounterNumber endVal={4.9} suffix="★" decimal={true} />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium mt-1 tracking-wider uppercase">
                Customer Rating
              </p>
            </div>

            {/* Stat 3: 50K+ Orders */}
            <div className="flex flex-col items-center justify-center border-t sm:border-t-0 sm:border-l border-white/10 pt-3 sm:pt-0 py-1">
              <div className="flex items-center gap-1.5">
                <Package size={22} className="text-purple-400 mb-1 shrink-0" />
                <CounterNumber endVal={50} suffix="K+" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium mt-1 tracking-wider uppercase">
                Orders Delivered
              </p>
            </div>

            {/* Stat 4: 100% Premium Fabrics */}
            <div className="flex flex-col items-center justify-center border-t sm:border-t-0 border-l border-white/10 pt-3 sm:pt-0 py-1">
              <div className="flex items-center gap-1.5">
                <Award size={22} className="text-emerald-400 mb-1 shrink-0" />
                <CounterNumber endVal={100} suffix="%" />
              </div>
              <p className="text-[10px] sm:text-xs text-neutral-400 font-medium mt-1 tracking-wider uppercase">
                Premium Fabrics
              </p>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
