import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingBag, Star, Share2 } from "lucide-react";
import { Image as IKImage } from "@imagekit/react";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.startsWith("/") || !url.startsWith("http");
};

export default function ProductCard({ product, navigate }) {
  const { toggleWishlist, wishlist, addToCart, addToast, user } = useApp();
  const [isHovered, setIsHovered] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const reviewCount = Number(product.ratingCount) || (Array.isArray(product.reviews) ? product.reviews.length : 0);
  const hasRating = reviewCount > 0 && Number(product.rating) > 0;

  // Calculate discount percentage
  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const shareText = `Check out ${product.name} on Anikara: ₹${product.price.toLocaleString("en-IN")}`;
    const shareUrl = `${window.location.origin}/?page=product-details&productId=${product.id}`;
    
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: shareText,
        url: shareUrl
      }).catch(err => {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(shareUrl)
            .then(() => addToast("Product link copied to clipboard!", "success"))
            .catch(() => addToast("Failed to copy link", "error"));
        }
      });
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => addToast("Product link copied to clipboard!", "success"))
        .catch(() => addToast("Failed to copy link", "error"));
    }
  };

  return (
    <div
      className="group relative flex flex-col w-full bg-white overflow-hidden font-sans border-2 border-neutral-100 hover:border-[#FF4D6D] hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(255,77,109,0.06)] transition-all duration-500 ease-out rounded-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Gallery with hover switch */}
      <div
        className="relative aspect-[4/5] w-full bg-neutral-50 overflow-hidden cursor-pointer rounded-t-xl border-b border-neutral-200/40 transition-all duration-300 group-hover:border-[#FF4D6D]/20"
        onClick={() => navigate("product-details", { productId: product.id })}
      >
        {/* Main Image */}
        {isImageKitUrl(product.image) ? (
          <IKImage
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-xl transition-all duration-[1000ms] ease-out group-hover:scale-[1.04] ${
              isHovered && product.altImage ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-xl transition-all duration-[1000ms] ease-out group-hover:scale-[1.04] ${
              isHovered && product.altImage ? "opacity-0" : "opacity-100"
            }`}
            loading="lazy"
          />
        )}
        {/* Hover Image */}
        {product.altImage && (
          isImageKitUrl(product.altImage) ? (
            <IKImage
              src={product.altImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-xl transition-all duration-[1000ms] ease-out group-hover:scale-[1.04] ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          ) : (
            <img
              src={product.altImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-xl transition-all duration-[1000ms] ease-out group-hover:scale-[1.04] ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
              loading="lazy"
            />
          )
        )}

        {/* Action Buttons Top Right Overlay (Sliding hover effect only on desktop, always visible on mobile) */}
        <div className="absolute right-2 top-2 sm:right-3.5 sm:top-3.5 z-20 flex flex-col gap-1.5 transition-all duration-300 ease-out opacity-100 md:opacity-0 md:translate-x-2 md:group-hover:translate-x-0 md:group-hover:opacity-100">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-neutral-100 hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-neutral-600 hover:text-[#FF4D6D] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Add to Wishlist"
          >
            <Heart
              size={14}
              className={`transition-colors duration-300 ${isWishlisted ? "fill-[#FF4D6D] text-[#FF4D6D]" : ""}`}
            />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="w-8 h-8 rounded-full bg-white/90 backdrop-blur-md border border-neutral-100 hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-neutral-600 hover:text-[#FF4D6D] hover:scale-110 active:scale-95 transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center"
            aria-label="Share Product"
          >
            <Share2 size={14} />
          </button>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-2.5 top-2.5 sm:left-3.5 sm:top-3.5 z-20 px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold tracking-wider text-white bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] uppercase rounded-full shadow-[0_4px_12px_rgba(255,77,109,0.25)] border border-white/20">
            {discountPercent}% OFF
          </span>
        )}

        {/* Custom Custom Badge (e.g. New / Best Seller) */}
        {product.badge && product.badge !== "Sale" && (
          <span className="absolute left-3 bottom-3 z-20 px-2.5 py-0.5 text-[8px] sm:text-[9px] font-extrabold tracking-widest text-neutral-900 bg-white/90 backdrop-blur-md border border-neutral-200/50 uppercase rounded-full shadow-xs">
            {product.badge}
          </span>
        )}

        {/* Quick Size Select Panel on Hover (Luxury aesthetic) */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-4 translate-y-full group-hover:translate-y-0 transition-all duration-300 ease-out hidden md:block bg-gradient-to-r from-[#2A0815] via-[#20040E] to-[#1A030D] border-t-2 border-[#FF4D6D] shadow-[0_-8px_24px_rgba(255,77,109,0.2)]">
          <div className="flex items-center justify-center gap-2.5 mb-3">
            <span className="h-[1px] w-5 bg-[#FF4D6D]/20"></span>
            <p className="text-[9px] font-extrabold tracking-[0.25em] text-[#FF758F] uppercase flex items-center gap-1.5 font-display">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#FF4D6D]"></span>
              </span>
              Quick Add Size
            </p>
            <span className="h-[1px] w-5 bg-[#FF4D6D]/20"></span>
          </div>
          <div className="flex justify-center gap-2.5">
            {product.sizes?.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!user) {
                    addToast("Please log in to add items to your cart.", "warning");
                    navigate("login");
                    return;
                  }
                  addToCart(product, 1, size);
                }}
                className="w-9 h-9 rounded-lg border border-[#5A1934]/60 bg-[#3D0F21] text-[#FFB3C1] hover:border-[#FF4D6D] hover:bg-gradient-to-r hover:from-[#FF4D6D] hover:to-[#FF758F] hover:text-white hover:scale-110 hover:-translate-y-0.5 hover:shadow-[0_6px_18px_rgba(255,77,109,0.45)] text-[11px] font-extrabold transition-all duration-300 cursor-pointer flex items-center justify-center focus:outline-none active:scale-95"
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Info Block */}
      <div className="px-3 sm:px-5 pt-2.5 sm:pt-3 pb-3 sm:pb-3.5 flex flex-col bg-white relative">
        {/* Category & Rating Row */}
        <div className="flex items-center justify-between mb-1.5 sm:mb-2 gap-1.5">
          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full bg-neutral-100 text-[8px] sm:text-[9px] font-black text-neutral-600 tracking-wide sm:tracking-widest uppercase border border-neutral-200/60 truncate max-w-[70%]">
            <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-[#FF4D6D] shrink-0 animate-pulse-slow"></span>
            {product.category}
          </span>
          
          {hasRating && (
            <div className="flex items-center gap-0.5 text-amber-500 bg-amber-500/5 px-1.5 sm:px-2 py-0.5 rounded-full border border-amber-500/10 shrink-0">
              <Star size={8} className="fill-amber-400 text-amber-400 shrink-0 animate-pulse-slow" />
              <span className="text-[8px] sm:text-[9px] font-bold text-amber-700 leading-none">{product.rating}</span>
            </div>
          )}
        </div>

        {/* Title */}
        <button
          onClick={() => navigate("product-details", { productId: product.id })}
          className="text-left mb-1 cursor-pointer focus:outline-none group/title inline-block self-start w-full min-h-unset min-w-unset"
        >
          <h3 className="text-xs sm:text-[14.5px] md:text-[15.5px] font-bold text-neutral-800 tracking-tight leading-snug line-clamp-1 group-hover/title:text-[#FF4D6D] transition-colors duration-300">
            {product.name}
          </h3>
        </button>

        {/* Price & Savings & Color Swatches Row (Highly Unique Layout!) */}
        <div className="flex items-center justify-between pt-1.5 mt-0.5 border-t border-neutral-100/40 gap-2">
          <div className="flex flex-col min-w-0">
            <span className="text-[7.5px] sm:text-[8px] font-bold text-neutral-400 uppercase tracking-widest mb-0.5">Price</span>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className="text-xs sm:text-[14px] font-extrabold text-neutral-900 leading-none shrink-0">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-[9.5px] sm:text-[11px] text-neutral-400 line-through font-light leading-none shrink-0">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            {/* Color Swatch Dots (Unique micro-interaction) */}
            {product.colors && product.colors.length > 1 ? (
              <div className="flex -space-x-1 hover:space-x-0.5 transition-all duration-300">
                {product.colors.slice(0, 3).map((col, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: col.hex }}
                    className="w-2 sm:w-2.5 h-2 sm:h-2.5 rounded-full border border-white shadow-[0_1px_3px_rgba(0,0,0,0.15)] transition-all cursor-crosshair hover:scale-125"
                    title={col.name}
                  />
                ))}
                {product.colors.length > 3 && (
                  <span className="text-[7.5px] sm:text-[8px] font-bold text-neutral-400 pl-0.5">
                    +{product.colors.length - 3}
                  </span>
                )}
              </div>
            ) : (
              <span className="text-[7.5px] sm:text-[8px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/50 px-1.5 sm:px-2 py-0.5 rounded-full shadow-xs tracking-wider uppercase">
                In Stock
              </span>
            )}
          </div>
        </div>

        {/* Mobile Quick Add Button (Visible only on mobile/tablet) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!user) {
              addToast("Please log in to add items to your cart.", "warning");
              navigate("login");
              return;
            }
            addToCart(product, 1, "M");
          }}
          className="mt-2.5 w-full py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[8px] sm:text-[9px] font-black tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-1 md:hidden cursor-pointer focus:outline-none rounded-md shadow-xs active:scale-[0.98]"
        >
          <ShoppingBag size={10} />
          Add to Bag
        </button>
      </div>
    </div>
  );
}
