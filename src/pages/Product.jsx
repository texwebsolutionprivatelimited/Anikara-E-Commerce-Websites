import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { ArrowUpDown, ChevronRight, ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const DEFAULT_CATEGORIES = [
  "Night Suit",
  "Lounge Suit",
  "Dress",
  "T-Shirt",
  "Top & Blouse",
  "Bottom Wear",
  "Lingerie",
  "Co-ords",
  "Suit",
  "Denim",
  "Ethnic Wear",
  "Sports Wear",
  "Footwear",
  "Bags",
  "Cosmetics",
  "Accessories"
];

export default function Product({ navigate, currentParams = {}, goBack }) {
  const { products, productsLoading, productsError, categories = DEFAULT_CATEGORIES } = useApp();

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("");

  // Sorting and Display
  const [sortBy, setSortBy] = useState("popularity");
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);

  // Reset pagination when filters change
  useEffect(() => {
    setVisibleCount(8);
  }, [selectedCategory, currentParams.searchQuery, sortBy]);

  // Map incoming navigation parameter parameters
  useEffect(() => {
    if (currentParams.category) {
      setSelectedCategory(currentParams.category);
    } else {
      setSelectedCategory("");
    }
  }, [currentParams]);

  const handleClearAll = () => {
    setSelectedCategory("");
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

    if (currentParams.badge === "Sale" && !(product.oldPrice > product.price)) {
      return false;
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

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setIsLoading(false);
    }, 600);
  };

  const hasMore = visibleCount < sortedProducts.length;
  const displayedProducts = sortedProducts.slice(0, visibleCount);

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-2 pb-6 sm:pt-4 sm:pb-10 font-sans">
      
      {/* Back Button */}
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 text-xs font-bold text-neutral-500 hover:text-[#FF4D6D] uppercase tracking-wider transition-colors mb-2 focus:outline-none cursor-pointer"
      >
        <ArrowLeft size={14} />
        Back
      </button>

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

      {/* Wrapped Category Pills Grid */}
      <div className="flex flex-wrap gap-2.5 mb-6 pb-5 border-b border-neutral-100">
        <button
          onClick={() => setSelectedCategory("")}
          className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 rounded-full shrink-0 focus:outline-none min-h-unset min-w-unset cursor-pointer border ${
            selectedCategory === ""
              ? "bg-[#111111] border-[#111111] text-white shadow-md shadow-black/10"
              : "bg-white border-neutral-200 text-neutral-500 hover:border-[#111111] hover:text-black"
          }`}
        >
          All Items
        </button>
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all duration-300 rounded-full shrink-0 focus:outline-none min-h-unset min-w-unset cursor-pointer border ${
                isSelected
                  ? "bg-[#111111] border-[#111111] text-white shadow-md shadow-black/10"
                  : "bg-white border-neutral-200 text-neutral-500 hover:border-[#111111] hover:text-black"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      <div className="min-w-0">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-neutral-50 border border-neutral-200/60 p-3 mb-8 rounded-sm">
          <span className="text-[11px] text-neutral-500 font-semibold tracking-wider uppercase">
            Sort products list
          </span>
          <div className="flex flex-wrap items-center gap-2 font-display">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1 mr-1">
              <ArrowUpDown size={12} />
              Sort By:
            </span>
            {[
              { id: "popularity", label: "Popularity" },
              { id: "newest", label: "Newest" },
              { id: "price-low", label: "Price: Low to High" },
              { id: "price-high", label: "Price: High to Low" }
            ].map((option) => {
              const isActive = sortBy === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`px-3 py-1.5 text-[10px] font-bold tracking-wider uppercase transition-all duration-300 rounded-sm cursor-pointer border focus:outline-none min-h-unset min-w-unset ${
                    isActive
                      ? "bg-[#111111] border-[#111111] text-white shadow-xs"
                      : "bg-white border-neutral-200 text-neutral-600 hover:border-[#111111] hover:text-black"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Grids */}
        {productsLoading ? (
          <SkeletonLoader count={8} />
        ) : productsError ? (
          <div className="text-center py-20 px-4 bg-red-50 border border-red-200/50 rounded-sm">
            <h3 className="text-sm font-bold tracking-wider text-red-600 uppercase mb-2">
              Failed to Load Products
            </h3>
            <p className="text-xs text-red-500 font-light max-w-xs mx-auto">
              {productsError}. Please try refreshing the page.
            </p>
          </div>
        ) : displayedProducts.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoading}
                  className="min-w-[180px] px-8 py-3.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center gap-2 mx-auto"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Load More
                    </>
                  ) : (
                    "Load More"
                  )}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20 px-4 bg-neutral-50 border border-neutral-200/50 rounded-sm">
            <h3 className="text-sm font-bold tracking-wider text-neutral-800 uppercase mb-1">
              No Products Found
            </h3>
            <p className="text-xs text-neutral-400 font-light max-w-xs mx-auto mb-6">
              We couldn't find any products matching your selection. Try clearing the search or category filter.
            </p>
            <button
              onClick={handleClearAll}
              className="px-6 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
            >
              Clear Category Filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
