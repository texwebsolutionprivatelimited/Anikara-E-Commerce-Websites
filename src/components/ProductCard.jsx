import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingBag, Star } from "lucide-react";

export default function ProductCard({ product, navigate }) {
  const { toggleWishlist, wishlist, addToCart } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  return (
    <div
      className="group relative flex flex-col w-full bg-white overflow-hidden font-sans border border-neutral-100 rounded-sm hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Gallery with hover switch */}
      <div
        className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden cursor-pointer"
        onClick={() => navigate("product-details", { productId: product.id })}
      >
        {/* Main Image */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${
            isHovered && product.altImage ? "opacity-0" : "opacity-100"
          }`}
          loading="lazy"
        />
        {/* Hover Image */}
        {product.altImage && (
          <img
            src={product.altImage}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${
              isHovered ? "opacity-100" : "opacity-0"
            }`}
            loading="lazy"
          />
        )}

        {/* Wishlist Button on Image */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-neutral-600 hover:text-[#FF4D6D] hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
          aria-label="Add to Wishlist"
        >
          <Heart
            size={15}
            className={`transition-colors duration-300 ${
              isWishlisted ? "fill-[#FF4D6D] text-[#FF4D6D]" : ""
            }`}
          />
        </button>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 z-20 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold tracking-wider text-white bg-[#FF4D6D] uppercase">
            {discountPercent}% OFF
          </span>
        )}

        {/* Custom Custom Badge (e.g. New / Best Seller) */}
        {product.badge && product.badge !== "Sale" && (
          <span className="absolute left-3 bottom-3 z-20 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#111111] bg-white border border-neutral-100 uppercase">
            {product.badge}
          </span>
        )}

        {/* Quick Add Button Slide-up overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              addToCart(product, 1, "M");
            }}
            className="w-full py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
          >
            <ShoppingBag size={14} />
            Quick Add (Size M)
          </button>
        </div>
      </div>

      {/* Info Block */}
      <div className="p-3 sm:p-4 pb-5 sm:pb-5 flex flex-col flex-grow">
        {/* Category */}
        <p className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase mb-1">
          {product.category}
        </p>

        {/* Title */}
        <button
          onClick={() => navigate("product-details", { productId: product.id })}
          className="text-left hover:text-[#FF4D6D] transition-colors mb-1 cursor-pointer focus:outline-none"
        >
          <h3 className="text-xs sm:text-[13px] font-medium text-neutral-900 tracking-tight leading-tight line-clamp-2 sm:line-clamp-1">
            {product.name}
          </h3>
        </button>

        {/* Ratings block */}
        <div className="flex items-center gap-1 mb-2">
          <div className="flex items-center text-amber-400">
            <Star size={11} className="fill-amber-400 text-amber-400" />
          </div>
          <span className="text-[11px] font-semibold text-neutral-800">
            {product.rating}
          </span>
          <span className="text-[10px] text-neutral-400 font-light">
            ({product.ratingCount})
          </span>
        </div>

        {/* Prices */}
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mt-auto">
          <span className="text-xs sm:text-sm font-bold text-neutral-900">
            ₹{product.price.toLocaleString("en-IN")}
          </span>
          {product.oldPrice > product.price && (
            <span className="text-[11px] sm:text-xs text-neutral-400 line-through font-light">
              ₹{product.oldPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Mobile Quick Add (Visible only on mobile/tablet) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            addToCart(product, 1, "M");
          }}
          className="mt-3 w-full py-2 bg-neutral-50 hover:bg-[#111111] border border-neutral-200 hover:border-[#111111] text-[#111111] hover:text-white text-[10px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1.5 md:hidden cursor-pointer focus:outline-none"
        >
          <ShoppingBag size={12} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
