import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingBag, Star, Share2, Eye, Check, Sparkles } from "lucide-react";
import ImageKitImage from "./ImageKitImage";
import QuickViewModal from "./QuickViewModal";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.startsWith("/") || !url.startsWith("http");
};

export default function ProductCard({ product, navigate }) {
  const { toggleWishlist, wishlist, addToCart, cart, updateCartQuantity, addToast, user } = useApp();
  const [isHovered, setIsHovered] = useState(false);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);

  // Cart item calculation for interactive stepper pill
  const cartItemsForProduct = user ? cart.filter((item) => String(item.id) === String(product.id)) : [];
  const totalInCart = cartItemsForProduct.reduce((sum, item) => sum + item.quantity, 0);

  // Rating & Review calculation with high-end default fallbacks
  const rating = Number(product.rating) > 0 ? Number(product.rating) : 4.8;
  const reviewCount = Number(product.ratingCount) || (Array.isArray(product.reviews) ? product.reviews.length : 0) || Math.floor(Math.abs(Math.sin((product.id || "1").length * 7) * 45) + 12);

  // Derive second image like Savana
  const secondImage =
    product.hoverImage ||
    product.altImage ||
    product.secondImage ||
    (Array.isArray(product.images) && product.images.length > 1 ? product.images[1] : null) ||
    (Array.isArray(product.gallery) && product.gallery.length > 1 ? product.gallery[1] : null);

  // Calculate discount percentage
  const discountPercent = product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  // Fallback colors array if none provided
  const availableColors = product.colors && product.colors.length > 0
    ? product.colors
    : [
        { name: "Obsidian", hex: "#111111" },
        { name: "Rose", hex: "#FF4D6D" },
        { name: "Ivory", hex: "#F5EBE6" }
      ];

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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast("Please log in to add items to your cart.", "warning");
      navigate("login");
      return;
    }
    const selectedSize = product.sizes?.[0] || "M";
    addToCart(product, 1, selectedSize);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <>
      <div
        className="group relative flex flex-col w-full bg-white overflow-hidden font-sans border border-neutral-200/70 hover:border-[#FF4D6D] hover:-translate-y-1.5 hover:shadow-[0_20px_45px_rgba(255,77,109,0.14)] transition-all duration-500 ease-out rounded-2xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Image Container with Savana-style hover switch */}
        <div
          className="relative aspect-[4/5] w-full bg-neutral-50 overflow-hidden cursor-pointer rounded-t-2xl border-b border-neutral-200/40 transition-all duration-300 group-hover:border-[#FF4D6D]/20"
          onClick={() => navigate("product-details", { productId: product.id })}
        >
          {/* Main Primary Image */}
          {isImageKitUrl(product.image) ? (
            <ImageKitImage
              src={product.image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-2xl transition-all duration-700 ease-out group-hover:scale-105 ${
                isHovered && secondImage ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-2xl transition-all duration-700 ease-out group-hover:scale-105 ${
                isHovered && secondImage ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />
          )}

          {/* Second Hover Image (Savana style cross-fade) */}
          {secondImage && (
            isImageKitUrl(secondImage) ? (
              <ImageKitImage
                src={secondImage}
                alt={`${product.name} second view`}
                className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-2xl transition-all duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
              />
            ) : (
              <img
                src={secondImage}
                alt={`${product.name} second view`}
                className={`absolute inset-0 h-full w-full object-cover object-top rounded-t-2xl transition-all duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
              />
            )
          )}

          {/* Badges Overlay (Top-Left): Bestseller / New / Discount */}
          <div className="absolute left-2 top-2 sm:left-3 sm:top-3 z-20 flex flex-col gap-1 items-start pointer-events-none">
            {/* Bestseller Badge */}
            {(product.badge === "Bestseller" || product.isBestseller || product.displaySection === "trending") && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9.5px] font-black tracking-widest text-amber-950 bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 uppercase rounded-full shadow-md border border-amber-200/60 flex items-center gap-1">
                <Star size={9} className="fill-amber-950 text-amber-950" /> BESTSELLER
              </span>
            )}

            {/* New Arrival Badge */}
            {(product.badge === "New" || product.isNew || product.displaySection === "new_arrivals") && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9.5px] font-black tracking-widest text-white bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] uppercase rounded-full shadow-md border border-white/20 flex items-center gap-1">
                <Sparkles size={9} /> NEW
              </span>
            )}

            {/* Sale Discount Badge */}
            {discountPercent > 0 && (
              <span className="px-2 py-0.5 sm:px-2.5 sm:py-1 text-[8px] sm:text-[9.5px] font-black tracking-wider text-white bg-[#111111] uppercase rounded-full shadow-sm border border-neutral-700">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Top-Right Action Buttons (Wishlist & Share - 44px Touch Targets) */}
          <div className="absolute right-2 top-2 sm:right-3 sm:top-3 z-20 flex flex-col gap-1.5 transition-all duration-300 ease-out opacity-100 md:opacity-0 md:translate-x-2 md:group-hover:translate-x-0 md:group-hover:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-neutral-100 hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 shadow-sm text-neutral-600 hover:text-[#FF4D6D] active:scale-90 transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Add to Wishlist"
            >
              <Heart
                size={16}
                className={`transition-colors duration-300 ${isWishlisted ? "fill-[#FF4D6D] text-[#FF4D6D]" : ""}`}
              />
            </button>

            <button
              onClick={handleShare}
              className="w-11 h-11 rounded-full bg-white/95 backdrop-blur-md border border-neutral-100 hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 shadow-sm text-neutral-600 hover:text-[#FF4D6D] active:scale-90 transition-all duration-200 focus:outline-none cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Share Product"
            >
              <Share2 size={16} />
            </button>
          </div>

          {/* Floating Quick View Overlay Button (Appears on Hover) */}
          <div className="absolute inset-x-3 bottom-3 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hidden md:block">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="w-full py-2.5 bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-neutral-900 text-xs font-black tracking-widest uppercase rounded-xl shadow-lg border border-neutral-200/80 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer focus:outline-none"
            >
              <Eye size={14} />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Info Block */}
        <div className="p-3 sm:p-4 flex flex-col bg-white relative justify-between flex-1 space-y-2">
          
          {/* Category & Ratings/Reviews Row */}
          <div className="flex items-center justify-between gap-1">
            <span className="inline-flex items-center gap-1 text-[8px] sm:text-[9.5px] font-black text-neutral-500 tracking-widest uppercase truncate max-w-[60%]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0" />
              {product.category || "Apparel"}
            </span>

            {/* Rating & Review Count */}
            <div className="flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/60 shrink-0 text-[8.5px] sm:text-[10px] font-extrabold">
              <Star size={10} className="fill-amber-400 text-amber-400" />
              <span>{rating}</span>
              <span className="text-neutral-400 font-normal">({reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <button
            onClick={() => navigate("product-details", { productId: product.id })}
            className="text-left cursor-pointer focus:outline-none group/title inline-block w-full min-h-unset min-w-unset"
          >
            <h3 className="text-xs sm:text-[14.5px] font-bold text-neutral-900 tracking-tight leading-snug line-clamp-1 group-hover/title:text-[#FF4D6D] transition-colors duration-300">
              {product.name}
            </h3>
          </button>

          {/* Price & Interactive Color Swatches Row */}
          <div className="flex items-center justify-between pt-1 border-t border-neutral-100 gap-1.5">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm sm:text-base font-black text-neutral-900 leading-none">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-xs text-neutral-400 line-through font-light leading-none">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
            </div>

            {/* Interactive Color Swatch Dots */}
            <div className="flex items-center -space-x-1 hover:space-x-1 transition-all duration-300">
              {availableColors.slice(0, 3).map((col, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: col.hex }}
                  className="w-2.5 sm:w-3 h-2.5 sm:h-3 rounded-full border-2 border-white shadow-xs transition-transform cursor-pointer hover:scale-125"
                  title={col.name}
                />
              ))}
              {availableColors.length > 3 && (
                <span className="text-[8px] font-bold text-neutral-400 pl-1">
                  +{availableColors.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Stepper (- X in cart +) or Add to Cart Button */}
          {user && totalInCart > 0 ? (
            <div
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="mt-2.5 w-full h-9 sm:h-10 bg-amber-400 border-2 border-amber-400 text-amber-950 font-extrabold rounded-full flex items-center justify-between px-3.5 shadow-sm transition-all duration-300 font-sans"
            >
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (cartItemsForProduct.length > 0) {
                    const itemToDec = cartItemsForProduct[0];
                    updateCartQuantity(itemToDec.cartItemId, itemToDec.quantity - 1);
                  }
                }}
                className="w-7 h-7 flex items-center justify-center text-lg font-black hover:bg-amber-500/50 rounded-full transition-colors active:scale-95 cursor-pointer focus:outline-none text-amber-950"
                title="Decrease Quantity"
              >
                −
              </button>

              <span className="text-xs sm:text-[13px] font-black tracking-wide text-amber-950">
                {totalInCart} in cart
              </span>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const selectedSize = product.sizes?.[0] || "M";
                  addToCart(product, 1, selectedSize);
                }}
                className="w-7 h-7 flex items-center justify-center text-lg font-black hover:bg-amber-500/50 rounded-full transition-colors active:scale-95 cursor-pointer focus:outline-none text-amber-950"
                title="Increase Quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              className={`w-full h-9 sm:h-10 text-[9.5px] sm:text-[11px] font-extrabold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-sm cursor-pointer focus:outline-none min-h-unset min-w-unset font-sans ${
                isAdded
                  ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]"
                  : "bg-[#111111] hover:bg-[#FF4D6D] text-white hover:shadow-[0_4px_16px_rgba(255,77,109,0.35)] hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {isAdded ? (
                <>
                  <Check size={14} className="animate-bounce" />
                  <span>Added to Cart!</span>
                </>
              ) : (
                <>
                  <ShoppingBag size={14} className="stroke-[2.2]" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          )}

        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        navigate={navigate}
      />
    </>
  );
}
