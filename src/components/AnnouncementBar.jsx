import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, Zap, Package } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function AnnouncementBar() {
  const { settings, coupons = [] } = useApp();
  const [index, setIndex] = useState(0);

  const featuredCoupon = coupons.find((c) => c.active);
  const announcements = [
    { icon: Sparkles, text: `FREE SHIPPING ON ALL ORDERS ABOVE ₹${(settings?.shippingThreshold || 1500).toLocaleString("en-IN")}` },
    { icon: Zap, text: featuredCoupon ? `LIMITED TIME SALE: USE CODE '${featuredCoupon.code}'` : "LIMITED TIME SALE IS LIVE NOW" },
    { icon: Package, text: "EASY RETURNS & 15-DAY HASSLE-FREE EXCHANGES" },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  const currentAnnouncement = announcements[index] || announcements[0];
  const Icon = currentAnnouncement.icon;
  const text = currentAnnouncement.text;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111] text-white text-[8px] min-[360px]:text-[9px] sm:text-[10.5px] md:text-xs tracking-[0.10em] sm:tracking-[0.12em] font-medium h-[32px] md:h-[36px] flex items-center justify-center overflow-hidden border-b border-white/10 font-display">
      <div className="relative w-full max-w-4xl px-3 sm:px-4 flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="flex items-center gap-2 text-center uppercase select-none text-white/90 whitespace-nowrap"
          >
            <Icon size={12} strokeWidth={2.5} className="shrink-0 text-[#FF4D6D]" />
            {text}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

