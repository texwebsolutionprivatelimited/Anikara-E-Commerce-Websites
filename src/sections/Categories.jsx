import React from "react";
import { motion } from "framer-motion";
import { Sparkles, ShoppingBag, ArrowRight } from "lucide-react";
import CategoryCard from "../components/CategoryCard";
import { useApp } from "../context/AppContext";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

export default function Categories({ navigate }) {
  const { categories = [], products } = useApp();

  // 12 categories in the exact order requested (optimized WebP format and small file sizes)
  const orderedCategories = [
    { key: "Night Suit", image: "https://ik.imagekit.io/feu3swboqb/categories/night_suit.webp" },
    { key: "Co-ords", image: "https://ik.imagekit.io/feu3swboqb/categories/coords.webp" },
    { key: "Suit", image: "https://ik.imagekit.io/feu3swboqb/categories/suit.webp" },
    { key: "T-shirt", image: "https://ik.imagekit.io/feu3swboqb/categories/t_shirt.webp" },
    { key: "Dress", image: "https://ik.imagekit.io/feu3swboqb/categories/dress.webp" },
    { key: "Top & Blouse", image: "https://ik.imagekit.io/feu3swboqb/categories/top_and_blouse.webp" },
    { key: "Bottom Wear", image: "https://ik.imagekit.io/feu3swboqb/categories/bottom_wear.webp" },
    { key: "Lingerie", image: "https://ik.imagekit.io/feu3swboqb/categories/lingerie.webp" },
    { key: "Denim", image: "https://ik.imagekit.io/feu3swboqb/categories/denim.webp" },
    { key: "Sports Wear", image: "https://ik.imagekit.io/feu3swboqb/categories/sports_wear.webp" },
    { key: "Footwear", image: "https://ik.imagekit.io/feu3swboqb/categories/footwear.webp" },
    { key: "Bags", image: "https://ik.imagekit.io/feu3swboqb/categories/bags.webp" }
  ];

  // Resolve matching DB names and dynamic item counts
  const categoriesWithCounts = orderedCategories.map((item) => {
    const matchName = categories.find((c) => c.toLowerCase() === item.key.toLowerCase()) || item.key;
    const count = products.filter(
      (p) => p.category.toLowerCase() === matchName.toLowerCase()
    ).length;

    return {
      displayName: item.key.toUpperCase(),
      dbCategory: matchName,
      image: item.image,
      itemsCount: `${count} ${count === 1 ? "Item" : "Items"}`
    };
  });

  // Resolve Cosmetics and Accessories category names from DB for dynamic links
  const cosmeticsCategory = categories.find((c) => c.toLowerCase() === "cosmetics") || "Cosmetics";
  const accessoriesCategory = categories.find((c) => c.toLowerCase() === "accessories") || "Accessories";

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-white to-[#FFF9FA] pt-6 pb-12 border-t border-neutral-100/60">
      {/* Soft Luxury Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-pink-200/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] bg-rose-200/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <span className="text-[10px] font-bold tracking-[0.35em] text-[#FF4D6D] uppercase font-display block mb-1.5">
            Curated Departments
          </span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-[#111111] font-display">
            Hot Categories
          </h2>
          <div className="w-12 h-[2px] bg-[#FF4D6D] mx-auto mt-3.5 rounded-full opacity-80" />
        </div>

        {/* Categories Grid (4 columns on mobile, exactly 6 columns on tablet/desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 auto-rows-fr gap-x-1.5 sm:gap-x-4 gap-y-5 sm:gap-y-8 max-w-7xl mx-auto w-full px-0.5 categories-grid-mobile"
        >
          {categoriesWithCounts.map((cat) => (
            <CategoryCard key={cat.displayName} category={cat} navigate={navigate} />
          ))}
        </motion.div>

        {/* Unique, Luxury Call-to-Action Blocks for Cosmetics and Accessories (in one row on all screen sizes) */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-5xl mx-auto mt-10 sm:mt-12 px-2 sm:px-4">
          {/* Cosmetics Button */}
          <button 
            onClick={() => navigate("products", { category: cosmeticsCategory })}
            className="group relative h-[62px] sm:h-[80px] rounded-2xl overflow-hidden border border-neutral-200/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(255,77,109,0.22)] transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: "url('https://ik.imagekit.io/feu3swboqb/categories/cosmetics_banner.webp')" }}
            />
            {/* Dark & Pink Tint Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#20040E]/95 via-[#20040E]/70 to-[#20040E]/20" />
            
            {/* Glassmorphic border lines inside the card */}
            <div className="absolute inset-1.5 sm:inset-2.5 rounded-xl border border-white/10 group-hover:border-[#FF4D6D]/40 transition-colors duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-6 relative z-10">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Icon Container with glowing pink ring */}
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF758F] group-hover:text-white group-hover:bg-[#FF4D6D] group-hover:border-[#FF4D6D] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] shrink-0">
                  <Sparkles size={16} className="sm:size-[20px] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[10.5px] sm:text-base md:text-lg text-white tracking-[0.05em] uppercase font-display leading-none">
                    Cosmetics
                  </h3>
                  <p className="text-[8px] sm:text-[10px] text-[#FF758F] font-bold mt-1 sm:mt-1.5 tracking-[0.08em] uppercase leading-none font-sans">
                    Beauty &amp; Care
                  </p>
                </div>
              </div>
              
              {/* Luxury Arrow Circle - hidden on tiny mobile viewports to prevent crowding */}
              <div className="hidden min-[380px]:flex w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black items-center justify-center border border-white/15 group-hover:bg-gradient-to-r group-hover:from-[#FF4D6D] group-hover:to-[#FF758F] group-hover:border-[#FF4D6D] group-hover:translate-x-2 transition-all duration-300 shadow-sm shrink-0">
                <ArrowRight size={13} className="sm:size-[16px]" />
              </div>
            </div>
          </button>

          {/* Accessories Button */}
          <button 
            onClick={() => navigate("products", { category: accessoriesCategory })}
            className="group relative h-[62px] sm:h-[80px] rounded-2xl overflow-hidden border border-neutral-200/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(255,77,109,0.22)] transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: "url('https://ik.imagekit.io/feu3swboqb/categories/accessories_banner.webp')" }}
            />
            {/* Dark & Pink Tint Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#20040E]/95 via-[#20040E]/70 to-[#20040E]/20" />
            
            {/* Glassmorphic border lines inside the card */}
            <div className="absolute inset-1.5 sm:inset-2.5 rounded-xl border border-white/10 group-hover:border-[#FF4D6D]/40 transition-colors duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-between px-3 sm:px-6 relative z-10">
              <div className="flex items-center gap-2 sm:gap-4">
                {/* Icon Container with glowing pink ring */}
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF758F] group-hover:text-white group-hover:bg-[#FF4D6D] group-hover:border-[#FF4D6D] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] shrink-0">
                  <ShoppingBag size={16} className="sm:size-[20px] animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[10.5px] sm:text-base md:text-lg text-white tracking-[0.05em] uppercase font-display leading-none">
                    Accessories
                  </h3>
                  <p className="text-[8px] sm:text-[10px] text-[#FF758F] font-bold mt-1 sm:mt-1.5 tracking-[0.08em] uppercase leading-none font-sans">
                    Style &amp; Accent
                  </p>
                </div>
              </div>
              
              {/* Luxury Arrow Circle - hidden on tiny mobile viewports to prevent crowding */}
              <div className="hidden min-[380px]:flex w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black items-center justify-center border border-white/15 group-hover:bg-gradient-to-r group-hover:from-[#FF4D6D] group-hover:to-[#FF758F] group-hover:border-[#FF4D6D] group-hover:translate-x-2 transition-all duration-300 shadow-sm shrink-0">
                <ArrowRight size={13} className="sm:size-[16px]" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
