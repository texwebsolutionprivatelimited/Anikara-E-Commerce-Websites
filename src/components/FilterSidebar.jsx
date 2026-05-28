import React from "react";
import { X, Star } from "lucide-react";
import { useApp } from "../context/AppContext";

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

const SIZES = ["S", "M", "L", "XL", "26", "28", "30", "32", "One Size"];

const COLORS = [
  { name: "Emerald Green", hex: "#0F5132" },
  { name: "Champagne Blush", hex: "#E8C5C8" },
  { name: "Midnight Navy", hex: "#1D2A44" },
  { name: "Ivory Cream", hex: "#FDFBF7" },
  { name: "Oatmeal Heather", hex: "#EAE6DF" },
  { name: "Onyx Black", hex: "#111111" },
  { name: "Sage Green", hex: "#A3B19B" },
  { name: "Terracotta Clay", hex: "#C87A53" },
  { name: "Crimson Red", hex: "#9E1C23" },
  { name: "Mustard Gold", hex: "#E4B04A" },
  { name: "Washed Black", hex: "#3A3B3C" }
];

export default function FilterSidebar({
  selectedCategory,
  onCategoryChange,
  priceRange,
  onPriceChange,
  selectedSizes,
  onSizeToggle,
  selectedColors,
  onColorToggle,
  minRating,
  onRatingChange,
  minDiscount,
  onDiscountChange,
  onClearAll,
  isMobileDrawer = false,
  onCloseMobileDrawer = () => {}
}) {
  const { categories = DEFAULT_CATEGORIES } = useApp();
  return (
    <div className={`w-full flex flex-col font-sans ${isMobileDrawer ? "p-6" : ""}`}>
      {/* Mobile Drawer Header */}
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-neutral-100">
          <h2 className="text-sm font-bold tracking-wider uppercase text-neutral-900">Filters</h2>
          <button
            onClick={onCloseMobileDrawer}
            className="text-neutral-500 hover:text-black focus:outline-none cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
      )}

      {/* Categories Filter */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-display">Category</h3>
        <div className="flex flex-col gap-2.5">
          <label className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-black cursor-pointer">
            <input
              type="radio"
              name="category"
              checked={selectedCategory === ""}
              onChange={() => onCategoryChange("")}
              className="accent-[#FF4D6D] h-3.5 w-3.5 border-neutral-300 focus:ring-0"
            />
            <span>All Categories</span>
          </label>
          {categories.map((cat) => (
            <label key={cat} className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-black cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={selectedCategory === cat}
                onChange={() => onCategoryChange(cat)}
                className="accent-[#FF4D6D] h-3.5 w-3.5 border-neutral-300 focus:ring-0"
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Filter */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-display">Max Price</h3>
        <div className="space-y-2">
          <input
            type="range"
            min="500"
            max="12000"
            step="500"
            value={priceRange[1]}
            onChange={(e) => onPriceChange([priceRange[0], parseInt(e.target.value)])}
            className="w-full accent-[#FF4D6D]"
          />
          <div className="flex justify-between text-[11px] text-neutral-500 font-semibold">
            <span>₹{priceRange[0]}</span>
            <span>₹{priceRange[1].toLocaleString("en-IN")}</span>
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-display">Size</h3>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((size) => {
            const isChecked = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => onSizeToggle(size)}
                className={`py-2 text-[10px] font-bold border rounded-xs transition-all cursor-pointer focus:outline-none ${
                  isChecked
                    ? "bg-[#111111] border-[#111111] text-white"
                    : "bg-white border-neutral-200 text-neutral-700 hover:border-[#111111]"
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-display">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((col) => {
            const isChecked = selectedColors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => onColorToggle(col.name)}
                style={{ backgroundColor: col.hex }}
                className={`w-7 h-7 rounded-full border relative transition-transform hover:scale-110 focus:outline-none cursor-pointer ${
                  isChecked ? "border-[#FF4D6D] ring-2 ring-[#FF4D6D]/45 scale-105" : "border-neutral-300"
                }`}
                title={col.name}
              >
                {isChecked && (
                  <span
                    className={`absolute inset-0 m-auto w-1.5 h-1.5 rounded-full ${
                      col.name === "Ivory Cream" || col.name === "Pure White" || col.name === "Champagne Blush" || col.name === "Oatmeal Heather"
                        ? "bg-black"
                        : "bg-white"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="mb-6 pb-6 border-b border-neutral-100">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-display">Min Rating</h3>
        <div className="flex flex-col gap-2">
          {[4, 4.5, 5].map((rating) => (
            <label key={rating} className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-black cursor-pointer">
              <input
                type="radio"
                name="rating"
                checked={minRating === rating}
                onChange={() => onRatingChange(rating)}
                className="accent-[#FF4D6D] h-3.5 w-3.5 border-neutral-300"
              />
              <span className="flex items-center gap-1 font-semibold text-neutral-700">
                {rating} <Star size={12} className="fill-amber-400 text-amber-400 inline" /> & Above
              </span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-black cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => onRatingChange(0)}
              className="accent-[#FF4D6D] h-3.5 w-3.5 border-neutral-300"
            />
            <span>All Ratings</span>
          </label>
        </div>
      </div>

      {/* Discount Filter */}
      <div className="mb-6 pb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3 font-display">Discount Offer</h3>
        <div className="flex flex-col gap-2.5">
          {[10, 20, 30, 50].map((disc) => (
            <label key={disc} className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-black cursor-pointer">
              <input
                type="radio"
                name="discount"
                checked={minDiscount === disc}
                onChange={() => onDiscountChange(disc)}
                className="accent-[#FF4D6D] h-3.5 w-3.5 border-neutral-300"
              />
              <span>{disc}% OFF & Above</span>
            </label>
          ))}
          <label className="flex items-center gap-2.5 text-xs text-neutral-600 hover:text-black cursor-pointer">
            <input
              type="radio"
              name="discount"
              checked={minDiscount === 0}
              onChange={() => onDiscountChange(0)}
              className="accent-[#FF4D6D] h-3.5 w-3.5 border-neutral-300"
            />
            <span>All Discounts</span>
          </label>
        </div>
      </div>

      {/* Clear Button */}
      <button
        onClick={() => {
          onClearAll();
          if (isMobileDrawer) onCloseMobileDrawer();
        }}
        className="w-full py-2.5 bg-neutral-100 hover:bg-[#111111] text-[#111111] hover:text-white text-xs font-bold tracking-wider uppercase transition-colors cursor-pointer focus:outline-none"
      >
        Clear All Filters
      </button>
    </div>
  );
}
