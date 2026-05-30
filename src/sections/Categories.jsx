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

        {/* Categories Grid (exactly 6 columns on tablet/desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-6 lg:grid-cols-6 auto-rows-fr gap-x-2.5 sm:gap-x-4 gap-y-6 sm:gap-y-8 max-w-7xl mx-auto w-full px-1 categories-grid-mobile"
        >
          {categoriesWithCounts.map((cat) => (
            <CategoryCard key={cat.displayName} category={cat} navigate={navigate} />
          ))}
        </motion.div>

        {/* Unique, Luxury Call-to-Action Blocks for Cosmetics and Accessories */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-5xl mx-auto mt-12 px-4">
          {/* Cosmetics Button */}
          <button 
            onClick={() => navigate("products", { category: cosmeticsCategory })}
            className="group relative h-[78px] sm:h-[96px] rounded-2xl overflow-hidden border border-neutral-200/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(255,77,109,0.22)] transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: "url('https://ik.imagekit.io/feu3swboqb/categories/cosmetics_banner.webp')" }}
            />
            {/* Dark & Pink Tint Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#20040E]/95 via-[#20040E]/70 to-[#20040E]/20" />
            
            {/* Glassmorphic border lines inside the card */}
            <div className="absolute inset-2.5 rounded-xl border border-white/10 group-hover:border-[#FF4D6D]/40 transition-colors duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-8 relative z-10">
              <div className="flex items-center gap-4">
                {/* Icon Container with glowing pink ring */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF758F] group-hover:text-white group-hover:bg-[#FF4D6D] group-hover:border-[#FF4D6D] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <Sparkles size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-white tracking-[0.1em] uppercase font-display leading-none">
                    Cosmetics
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[#FF758F] font-bold mt-1.5 tracking-[0.12em] uppercase leading-none font-sans">
                    Beauty &amp; Personal Care
                  </p>
                </div>
              </div>
              
              {/* Luxury Arrow Circle */}
              <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center border border-white/15 group-hover:bg-gradient-to-r group-hover:from-[#FF4D6D] group-hover:to-[#FF758F] group-hover:border-[#FF4D6D] group-hover:translate-x-2 transition-all duration-300 shadow-sm shrink-0">
                <ArrowRight size={16} />
              </div>
            </div>
          </button>

          {/* Accessories Button */}
          <button 
            onClick={() => navigate("products", { category: accessoriesCategory })}
            className="group relative h-[78px] sm:h-[96px] rounded-2xl overflow-hidden border border-neutral-200/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(255,77,109,0.22)] transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: "url('https://ik.imagekit.io/feu3swboqb/categories/accessories_banner.webp')" }}
            />
            {/* Dark & Pink Tint Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#20040E]/95 via-[#20040E]/70 to-[#20040E]/20" />
            
            {/* Glassmorphic border lines inside the card */}
            <div className="absolute inset-2.5 rounded-xl border border-white/10 group-hover:border-[#FF4D6D]/40 transition-colors duration-500 pointer-events-none" />

            {/* Content Container */}
            <div className="absolute inset-0 flex items-center justify-between px-6 sm:px-8 relative z-10">
              <div className="flex items-center gap-4">
                {/* Icon Container with glowing pink ring */}
                <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#FF758F] group-hover:text-white group-hover:bg-[#FF4D6D] group-hover:border-[#FF4D6D] transition-all duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
                  <ShoppingBag size={20} className="animate-pulse" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base md:text-lg text-white tracking-[0.1em] uppercase font-display leading-none">
                    Accessories
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-[#FF758F] font-bold mt-1.5 tracking-[0.12em] uppercase leading-none font-sans">
                    Style &amp; Accents
                  </p>
                </div>
              </div>
              
              {/* Luxury Arrow Circle */}
              <div className="w-9 h-9 rounded-full bg-white/10 hover:bg-white text-white hover:text-black flex items-center justify-center border border-white/15 group-hover:bg-gradient-to-r group-hover:from-[#FF4D6D] group-hover:to-[#FF758F] group-hover:border-[#FF4D6D] group-hover:translate-x-2 transition-all duration-300 shadow-sm shrink-0">
                <ArrowRight size={16} />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
