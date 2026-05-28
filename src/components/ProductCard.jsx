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
      className="group relative flex flex-col w-full bg-white overflow-hidden font-sans border border-neutral-100 rounded-md hover:scale-[1.02] hover:shadow-xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Gallery with hover switch */}
      <div
        className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden cursor-pointer rounded-t-md border-b border-neutral-200/60 transition-all duration-300 group-hover:border-[#FF4D6D]/45"
        onClick={() => navigate("product-details", { productId: product.id })}
      >
        {/* Main Image */}
        {isImageKitUrl(product.image) ? (
          <IKImage
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${isHovered && product.altImage ? "opacity-0" : "opacity-100"
              }`}
            loading="lazy"
          />
        ) : (
          <img
            src={product.image}
            alt={product.name}
            className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${isHovered && product.altImage ? "opacity-0" : "opacity-100"
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
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${isHovered ? "opacity-100" : "opacity-0"
                }`}
              loading="lazy"
            />
          ) : (
            <img
              src={product.altImage}
              alt={`${product.name} alternate view`}
              className={`absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-in-out group-hover:scale-105 ${isHovered ? "opacity-100" : "opacity-0"
                }`}
              loading="lazy"
            />
          )
        )}

        {/* Action Buttons Top Right Overlay */}
        <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 flex flex-col gap-1.5">
          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-neutral-600 hover:text-[#FF4D6D] hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
            aria-label="Add to Wishlist"
          >
            <Heart
              size={15}
              className={`transition-colors duration-300 ${isWishlisted ? "fill-[#FF4D6D] text-[#FF4D6D]" : ""
                }`}
            />
          </button>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="p-1.5 sm:p-2 rounded-full bg-white/90 backdrop-blur-xs shadow-xs text-neutral-600 hover:text-[#FF4D6D] hover:scale-110 active:scale-95 transition-all focus:outline-none cursor-pointer"
            aria-label="Share Product"
          >
            <Share2 size={15} />
          </button>
        </div>

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className="absolute left-2 top-2 sm:left-3 sm:top-3 z-20 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-bold tracking-wider text-white bg-[#FF4D6D] uppercase rounded-md shadow-xs">
            {discountPercent}% OFF
          </span>
        )}

        {/* Custom Custom Badge (e.g. New / Best Seller) */}
        {product.badge && product.badge !== "Sale" && (
          <span className="absolute left-3 bottom-3 z-20 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#111111] bg-white border border-neutral-100 uppercase rounded-sm">
            {product.badge}
          </span>
        )}

        {/* Quick Add Button Slide-up overlay */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out hidden md:block">
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
            className="w-full py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[11px] font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none rounded-sm"
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
            if (!user) {
              addToast("Please log in to add items to your cart.", "warning");
              navigate("login");
              return;
            }
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

