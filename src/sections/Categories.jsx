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

const OLD_PNG_URLS = new Set([
  "https://ik.imagekit.io/feu3swboqb/categories/bags.png",
  "https://ik.imagekit.io/feu3swboqb/categories/co-ord-sets.png",
  "https://ik.imagekit.io/feu3swboqb/categories/cosmetics.png",
  "https://ik.imagekit.io/feu3swboqb/categories/lingerie.png",
  "https://ik.imagekit.io/feu3swboqb/categories/lounge-wear.png",
  "https://ik.imagekit.io/feu3swboqb/categories/night-suits.png",
  "https://ik.imagekit.io/feu3swboqb/categories/pajamas.png",
  "https://ik.imagekit.io/feu3swboqb/categories/sarees.png"
]);

// Helper to resolve fallback images for 34 categories to their matched premium editorial ImageKit URLs
const resolveCategoryFallbackImage = (slug) => {
  const direct = [
    "sarees", "kurtis", "salwar-suits", "co-ord-sets", "dresses", 
    "ethnic-wear", "lounge-wear", "night-suits", "pajamas", 
    "lingerie", "bags", "accessories", "jewellery", "cosmetics"
  ];
  if (direct.includes(slug)) {
    return `https://ik.imagekit.io/feu3swboqb/categories/${slug}.jpg`;
  }

  const footwear = ["footwear", "sneakers", "heels", "flats", "sandals", "shoes"];
  if (footwear.includes(slug)) {
    return "https://ik.imagekit.io/feu3swboqb/categories/shoes.jpg";
  }

  const western = ["tops", "t-shirts", "shirts", "jeans", "trousers", "western-wear", "sweatshirts", "hoodies"];
  if (western.includes(slug)) {
    return "https://ik.imagekit.io/feu3swboqb/categories/co-ord-sets.jpg";
  }

  const accs = ["sunglasses", "watches", "hair-accessories", "belts"];
  if (accs.includes(slug)) {
    return "https://ik.imagekit.io/feu3swboqb/categories/accessories.jpg";
  }

  const beauty = ["beauty", "skincare", "perfumes"];
  if (beauty.includes(slug)) {
    return "https://ik.imagekit.io/feu3swboqb/categories/cosmetics.jpg";
  }

  return "https://ik.imagekit.io/feu3swboqb/categories/default_category.webp";
};

export default function Categories({ navigate }) {
  const { categories = [], categoryImages = {}, products, productsLoading } = useApp();

  const hasCosmetics = categories.some((c) => c.toLowerCase() === "cosmetics");
  const hasAccessories = categories.some((c) => c.toLowerCase() === "accessories");
  const showBanners = hasCosmetics || hasAccessories;

  // Filter out Cosmetics and Accessories as they have custom CTA sections at the bottom
  const filteredCategories = categories.filter(
    (catName) => catName.toLowerCase() !== "cosmetics" && catName.toLowerCase() !== "accessories"
  );

  // Ensure "Shoes" and "Jewellery" are always present in the main categories grid
  if (!filteredCategories.some(c => c.toLowerCase() === "shoes")) {
    filteredCategories.push("Shoes");
  }
  if (!filteredCategories.some(c => c.toLowerCase() === "jewellery")) {
    filteredCategories.push("Jewellery");
  }

  // Resolve matching DB names and dynamic item counts from Firestore categories
  const categoriesWithCounts = filteredCategories.map((catName) => {
    const count = products.filter(
      (p) => p.category.toLowerCase() === catName.toLowerCase()
    ).length;

    const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const fallbackUrl = resolveCategoryFallbackImage(slug);
    
    const dbImage = categoryImages[catName];
    const isOldPng = dbImage && OLD_PNG_URLS.has(dbImage);
    const imageToUse = (dbImage && !isOldPng) ? dbImage : fallbackUrl;

    return {
      displayName: catName.toUpperCase(),
      dbCategory: catName,
      image: imageToUse,
      itemsCount: `${count} ${count === 1 ? "Item" : "Items"}`
    };
  });

  // Resolve Cosmetics and Accessories category names from DB for dynamic links
  const cosmeticsCategory = categories.find((c) => c.toLowerCase() === "cosmetics") || "Cosmetics";
  const accessoriesCategory = categories.find((c) => c.toLowerCase() === "accessories") || "Accessories";

  const cosmeticsDbImage = categoryImages[cosmeticsCategory];
  const isCosmeticsOldPng = cosmeticsDbImage && OLD_PNG_URLS.has(cosmeticsDbImage);
  const cosmeticsImage = (cosmeticsDbImage && !isCosmeticsOldPng)
    ? cosmeticsDbImage
    : "https://ik.imagekit.io/feu3swboqb/categories/cosmetics.jpg";

  const accessoriesDbImage = categoryImages[accessoriesCategory];
  const isAccessoriesOldPng = accessoriesDbImage && OLD_PNG_URLS.has(accessoriesDbImage);
  const accessoriesImage = (accessoriesDbImage && !isAccessoriesOldPng)
    ? accessoriesDbImage
    : "https://ik.imagekit.io/feu3swboqb/categories/accessories.jpg";


  if (productsLoading || categories.length === 0) {
    return (
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#FFF5F8] via-white to-[#FFF9FA] pt-6 pb-12 border-t border-neutral-100/60 font-sans">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-10 lg:px-16 text-center">
          <span className="text-[10px] font-bold tracking-[0.35em] text-[#FF4D6D] uppercase font-display block mb-1.5 animate-pulse">
            Curated Departments
          </span>
          <h2 className="text-2xl md:text-3.5xl font-extrabold tracking-tight text-[#111111] font-display">
            Hot Categories
          </h2>
          <div className="w-12 h-[2px] bg-[#FF4D6D] mx-auto mt-3.5 rounded-full opacity-80" />
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3 max-w-7xl mx-auto mt-10 w-full px-0.5">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center pb-5 sm:pb-6 relative animate-pulse">
                {/* Arch-like skeleton */}
                <div className="w-full aspect-[3/4] rounded-t-full rounded-b-[20px] sm:rounded-b-[36px] bg-neutral-200 border border-neutral-300/40" />
                <div className="h-4 bg-neutral-200 w-2/3 rounded-full mt-4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

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

        {/* Categories Grid (2 cols mobile, 3 cols tablet, 5 cols laptop, 6 cols desktop) */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 auto-rows-fr gap-2.5 sm:gap-3 max-w-7xl mx-auto w-full px-0.5"
        >
          {categoriesWithCounts.map((cat) => (
            <CategoryCard key={cat.displayName} category={cat} navigate={navigate} />
          ))}
        </motion.div>

        {/* Unique, Luxury Call-to-Action Blocks for Cosmetics and Accessories (only visible if they exist) */}
        {showBanners && (
          <>
            <div className="mt-14 sm:mt-16 text-center">
              <span className="text-[10px] font-bold tracking-[0.35em] text-[#FF4D6D] uppercase font-display block mb-1.5">
                Exclusives
              </span>
              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-[#111111] font-display">
                Featured Collections
              </h3>
              <div className="w-8 h-[1.5px] bg-[#FF4D6D] mx-auto mt-2.5 rounded-full opacity-60" />
            </div>

            <div className={`grid gap-3 sm:gap-5 max-w-5xl mx-auto mt-8 px-2 sm:px-4 ${
              hasCosmetics && hasAccessories ? "grid-cols-2" : "grid-cols-1"
            }`}>
              {/* Cosmetics Button */}
              {hasCosmetics && (
                <button 
                  onClick={() => navigate("products", { category: cosmeticsCategory })}
                  className="group relative h-[62px] sm:h-[80px] rounded-2xl overflow-hidden border border-neutral-200/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(255,77,109,0.22)] transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${cosmeticsImage})` }}
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
              )}

              {/* Accessories Button */}
              {hasAccessories && (
                <button 
                  onClick={() => navigate("products", { category: accessoriesCategory })}
                  className="group relative h-[62px] sm:h-[80px] rounded-2xl overflow-hidden border border-neutral-200/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:shadow-[0_15px_35px_rgba(255,77,109,0.22)] transition-all duration-500 ease-out text-left cursor-pointer focus:outline-none min-h-unset min-w-unset w-full"
                >
                  {/* Background Image */}
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${accessoriesImage})` }}
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
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
