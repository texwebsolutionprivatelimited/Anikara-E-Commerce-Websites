import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSidebar";
import SkeletonLoader from "../components/SkeletonLoader";
import { SlidersHorizontal, ArrowUpDown, ChevronRight, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Product({ navigate, currentParams = {}, goBack }) {
  const { products } = useApp();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([500, 12000]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [minRating, setMinRating] = useState(0);
  const [minDiscount, setMinDiscount] = useState(0);

  // Sorting and Display
  const [sortBy, setSortBy] = useState("popularity");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Map incoming navigation parameter parameters
  useEffect(() => {
    if (currentParams.category) {
      setSelectedCategory(currentParams.category);
    } else {
      setSelectedCategory("");
    }

    if (currentParams.badge === "Sale") {
      setMinDiscount(10);
    } else {
      setMinDiscount(0);
    }

    // Trigger fake loading spinner
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentParams]);

  const handleSizeToggle = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (colorName) => {
    setSelectedColors((prev) =>
      prev.includes(colorName) ? prev.filter((c) => c !== colorName) : [...prev, colorName]
    );
  };

  const handleClearAll = () => {
    setSelectedCategory("");
    setPriceRange([500, 12000]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinRating(0);
    setMinDiscount(0);
  };

  const searchQuery = currentParams.searchQuery?.toLowerCase() || "";

  const filteredProducts = products.filter((product) => {
    if (searchQuery) {
      const matchName = product.name.toLowerCase().includes(searchQuery);
      const matchCat = product.category.toLowerCase().includes(searchQuery);
      const matchDesc = product.description.toLowerCase().includes(searchQuery);
      if (!matchName && !matchCat && !matchDesc) return false;
    }

    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }

    if (product.price < priceRange[0] || product.price > priceRange[1]) {
      return false;
    }

    if (selectedSizes.length > 0) {
      const hasSize = product.sizes.some((s) => selectedSizes.includes(s));
      if (!hasSize) return false;
    }

    if (selectedColors.length > 0) {
      const hasColor = product.colors?.some((c) => selectedColors.includes(c.name));
      if (!hasColor) return false;
    }

    if (minRating > 0 && product.rating < minRating) {
      return false;
    }

    if (minDiscount > 0) {
      const discountPercent = Math.round(
        ((product.oldPrice - product.price) / product.oldPrice) * 100
      );
      if (discountPercent < minDiscount) return false;
    }

    return true;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "popularity") {
      return b.rating - a.rating;
    }
    if (sortBy === "newest") {
      return b.id.localeCompare(a.id);
    }
    if (sortBy === "price-low") {
      return a.price - b.price;
    }
    if (sortBy === "price-high") {
      return b.price - a.price;
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Back Button */}
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#FF4D6D] uppercase tracking-wider transition-colors mb-4 focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back
      </button>

      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 font-medium tracking-wide uppercase mb-6">
        <button onClick={() => navigate("home")} className="hover:text-black cursor-pointer focus:outline-none">Home</button>
        <ChevronRight size={10} />
        <span className="text-neutral-800 font-semibold">Catalog</span>
        {selectedCategory && (
          <>
            <ChevronRight size={10} />
            <span className="text-[#FF4D6D] font-bold">{selectedCategory}</span>
          </>
        )}
      </div>

      {/* Page Title & Count */}
      <div className="flex flex-col md:flex-row md:items-baseline justify-between mb-8 gap-3 border-b border-neutral-100 pb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold tracking-wider text-[#111111] uppercase font-display">
            {selectedCategory || (currentParams.badge === "Sale" ? "Special Offers & Discounts" : "Shop All Products")}
          </h1>
          {searchQuery && (
            <p className="text-xs text-neutral-500 font-light mt-1">
              Search results for: <span className="font-semibold text-neutral-800">"{searchQuery}"</span>
            </p>
          )}
        </div>
        <p className="text-xs font-semibold text-neutral-500 tracking-wider uppercase">
          {sortedProducts.length} {sortedProducts.length === 1 ? "Item" : "Items"} Found
        </p>
      </div>

      <div className="flex gap-8 min-w-0">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="w-64 shrink-0 hidden lg:block border-r border-neutral-100 pr-6 h-fit sticky top-28">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
            selectedSizes={selectedSizes}
            onSizeToggle={handleSizeToggle}
            selectedColors={selectedColors}
            onColorToggle={handleColorToggle}
            minRating={minRating}
            onRatingChange={setMinRating}
            minDiscount={minDiscount}
            onDiscountChange={setMinDiscount}
            onClearAll={handleClearAll}
          />
        </aside>

        {/* CATALOG GRID */}
        <div className="flex-grow min-w-0">
          
          {/* Controls */}
          <div className="flex flex-col min-[420px]:flex-row min-[420px]:items-center justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-3 mb-8 rounded-sm">
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 text-xs font-bold uppercase tracking-wider text-neutral-800 hover:border-[#111111] focus:outline-none cursor-pointer"
            >
              <SlidersHorizontal size={14} />
              Filter
            </button>

            <span className="hidden lg:inline text-[11px] text-neutral-500 font-semibold tracking-wider uppercase">
              Viewing grid layout
            </span>

            <div className="flex items-center justify-between min-[420px]:justify-start gap-2 font-display w-full min-[420px]:w-auto">
              <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1">
                <ArrowUpDown size={12} />
                Sort By:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-xs font-semibold text-[#111111] bg-white border border-neutral-200 py-1.5 px-2 sm:px-3 focus:outline-none focus:border-[#111111] cursor-pointer min-w-0"
              >
                <option value="popularity">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grids */}
          {isLoading ? (
            <SkeletonLoader count={8} />
          ) : sortedProducts.length > 0 ? (
            <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-2 md:grid-cols-3 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 px-4 bg-neutral-50 border border-neutral-200/50 rounded-sm">
              <SlidersHorizontal className="mx-auto text-neutral-300 mb-4" size={40} />
              <h3 className="text-sm font-bold tracking-wider text-neutral-800 uppercase mb-1">
                No Products Match Filters
              </h3>
              <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto mb-6">
                Try widening your price range, toggling size chips, or searching for other items.
              </p>
              <button
                onClick={handleClearAll}
                className="px-6 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE DRAWER FILTERS */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="fixed inset-0 bg-black z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 w-[min(20rem,100vw)] bg-white z-50 flex flex-col shadow-2xl lg:hidden overflow-y-auto"
            >
              <FilterSidebar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
                selectedSizes={selectedSizes}
                onSizeToggle={handleSizeToggle}
                selectedColors={selectedColors}
                onColorToggle={handleColorToggle}
                minRating={minRating}
                onRatingChange={setMinRating}
                minDiscount={minDiscount}
                onDiscountChange={setMinDiscount}
                onClearAll={handleClearAll}
                isMobileDrawer={true}
                onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
