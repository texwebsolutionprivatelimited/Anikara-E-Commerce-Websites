import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

const ANNOUNCEMENTS = [
  "✨ FREE SHIPPING ON ALL ORDERS ABOVE ₹1,500",
  "⚡ LIMITED TIME SALE: USE CODE 'ANIKARA20' TO GET 20% OFF",
  "📦 EASY RETURNS & 15-DAY HASSLE-FREE EXCHANGES"
];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#111111] text-white text-[10.5px] md:text-xs tracking-[0.12em] font-medium h-[32px] md:h-[36px] flex items-center justify-center overflow-hidden border-b border-white/10 font-display">
      <div className="relative w-full max-w-4xl px-4 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="text-center truncate uppercase select-none text-white/90"
          >
            {ANNOUNCEMENTS[index]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
