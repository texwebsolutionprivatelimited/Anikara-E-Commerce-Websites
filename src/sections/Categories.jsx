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

// Exact Handwritten categories specification with transparent WebP cutout images (no human body)
const HANDWRITTEN_GRID_CATEGORIES = [
  { id: "night-suit", dbCategory: "Night Suit", displayName: "NIGHT SUIT", fallback: "/categories/cutouts/night-suit.webp" },
  { id: "co-ords", dbCategory: "CO-ORDS", displayName: "CO-ORDS", fallback: "/categories/cutouts/co-ords.webp" },
  { id: "suit", dbCategory: "Suit", displayName: "SUIT", fallback: "/categories/cutouts/suit.webp" },
  { id: "t-shirt", dbCategory: "T-Shirt", displayName: "T-SHIRTS", fallback: "/categories/cutouts/t-shirt.webp" },
  { id: "dress", dbCategory: "Dress", displayName: "DRESSES", fallback: "/categories/cutouts/dress.webp" },
  { id: "tops-blouse", dbCategory: "Tops Blouse", displayName: "TOPS & BLOUSES", fallback: "/categories/cutouts/tops-blouse.webp" },
  { id: "bottom-wear", dbCategory: "Bottom wear", displayName: "BOTTOM WEAR", fallback: "/categories/cutouts/bottom-wear.webp" },
  { id: "lingerie", dbCategory: "Lingerie", displayName: "LINGERIE", fallback: "/categories/cutouts/lingerie.webp" },
  { id: "denim", dbCategory: "Denim", displayName: "DENIM", fallback: "/categories/cutouts/denim.webp" },
  { id: "sports-wear", dbCategory: "Sports wear", displayName: "SPORTS WEAR", fallback: "/categories/cutouts/sports-wear.webp" },
  { id: "footwear", dbCategory: "Footwear", displayName: "FOOTWEAR", fallback: "/categories/cutouts/footwear.webp" },
  { id: "bags", dbCategory: "Bags", displayName: "BAGS", fallback: "/categories/cutouts/bags.webp" }
];

export default function Categories({ navigate }) {
  const { categoryImages = {}, products, productsLoading } = useApp();

  // Resolve matching DB names and dynamic item counts for handwritten categories (using isolated product cutouts without human bodies)
  const categoriesToRender = HANDWRITTEN_GRID_CATEGORIES.map((item) => {
    const imageToUse = item.fallback;

    const count = products.filter(
      (p) => p.category.toLowerCase().includes(item.dbCategory.toLowerCase()) ||
             item.dbCategory.toLowerCase().includes(p.category.toLowerCase())
    ).length;

    return {
      displayName: item.displayName,
      dbCategory: item.dbCategory,
      image: imageToUse,
      itemsCount: `${count} ${count === 1 ? "Item" : "Items"}`
    };
  });

  const cosmeticsImage = categoryImages["Cosmetic"] || categoryImages["Cosmetics"] || "https://ik.imagekit.io/feu3swboqb/categories/cosmetics.jpg";
  const accessoriesImage = categoryImages["Accessories"] || "https://ik.imagekit.io/feu3swboqb/categories/accessories.jpg";

  if (productsLoading) {
    return (
      <section className="relative w-full overflow-hidden bg-white pt-6 pb-12 font-sans">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 text-center">
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-[#111111] font-display">
            Hot Categories
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 max-w-6xl mx-auto mt-8 w-full">
            {Array.from({ length: 8 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center pb-5 relative animate-pulse">
                <div className="w-full aspect-[3/4] rounded-t-full rounded-b-[28px] bg-neutral-200" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-white pt-6 pb-12">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 relative z-10">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3.5xl font-black tracking-tight text-[#111111] font-display">
            Hot Categories
          </h2>
        </div>

        {/* Categories Grid (Fully responsive: 2 cols mobile, 3 cols tablet, 4 cols laptop/desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 max-w-6xl mx-auto w-full px-2"
        >
          {categoriesToRender.map((cat) => (
            <CategoryCard key={cat.displayName} category={cat} navigate={navigate} />
          ))}
        </motion.div>

        {/* Featured Collection Banners for Cosmetic & Accessories (from Handwritten note) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-5xl mx-auto mt-12 px-2 sm:px-4">
          {/* Cosmetic Banner */}
          <button 
            onClick={() => navigate("products", { category: "Cosmetic" })}
            className="group relative h-[70px] sm:h-[84px] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${cosmeticsImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-2 rounded-xl border border-white/10 group-hover:border-white/30 transition-colors duration-500 pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-inner shrink-0">
                  <Sparkles size={18} className="sm:size-[20px]" />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-base md:text-lg text-white tracking-[0.05em] uppercase font-display leading-none">
                    Cosmetic
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-neutral-300 font-bold mt-1 tracking-[0.08em] uppercase leading-none font-sans">
                    Beauty &amp; Skincare
                  </p>
                </div>
              </div>
              
              <div className="flex w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white text-white hover:text-black items-center justify-center border border-white/20 group-hover:translate-x-1.5 transition-all duration-300 shadow-sm shrink-0">
                <ArrowRight size={14} className="sm:size-[16px]" />
              </div>
            </div>
          </button>

          {/* Accessories Banner */}
          <button 
            onClick={() => navigate("products", { category: "Accessories" })}
            className="group relative h-[70px] sm:h-[84px] rounded-2xl overflow-hidden border border-neutral-200 shadow-sm hover:shadow-md transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
              style={{ backgroundImage: `url(${accessoriesImage})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
            <div className="absolute inset-2 rounded-xl border border-white/10 group-hover:border-white/30 transition-colors duration-500 pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-between px-4 sm:px-6 relative z-10">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300 shadow-inner shrink-0">
                  <ShoppingBag size={18} className="sm:size-[20px]" />
                </div>
                <div>
                  <h3 className="font-black text-xs sm:text-base md:text-lg text-white tracking-[0.05em] uppercase font-display leading-none">
                    Accessories
                  </h3>
                  <p className="text-[9px] sm:text-[10px] text-neutral-300 font-bold mt-1 tracking-[0.08em] uppercase leading-none font-sans">
                    Jewelry &amp; Essentials
                  </p>
                </div>
              </div>
              
              <div className="flex w-7 h-7 sm:w-9 sm:h-9 rounded-full bg-white/15 hover:bg-white text-white hover:text-black items-center justify-center border border-white/20 group-hover:translate-x-1.5 transition-all duration-300 shadow-sm shrink-0">
                <ArrowRight size={14} className="sm:size-[16px]" />
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}

