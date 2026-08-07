import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Heart, ShoppingBag, Star, Eye, Check, Sparkles } from "lucide-react";
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

  // Stock Quantity Calculation
  const stockCount = product.stock !== undefined && product.stock !== null ? Number(product.stock) : 25;
  const isOutOfStock = stockCount === 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  // Rating & Review calculation with fallbacks
  const rating = Number(product.rating) > 0 ? Number(product.rating) : 4.8;
  const reviewCount = Number(product.ratingCount) || (Array.isArray(product.reviews) ? product.reviews.length : 0) || Math.floor(Math.abs(Math.sin((product.id || "1").length * 7) * 45) + 12);

  // Derive second hover image (Savana style cross-fade)
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

  // Derive compact badges (Maximum of 2 badges)
  const badges = [];
  if (isOutOfStock) {
    badges.push({ type: "out", text: "OUT OF STOCK" });
  } else if (isLowStock) {
    badges.push({ type: "low", text: `ONLY ${stockCount} LEFT` });
  }
  if (badges.length < 2 && (product.badge === "Bestseller" || product.isBestseller || product.displaySection === "trending")) {
    badges.push({ type: "bestseller", text: "BESTSELLER" });
  }
  if (badges.length < 2 && (product.badge === "New" || product.isNew || product.displaySection === "new_arrivals")) {
    badges.push({ type: "new", text: "NEW" });
  }

  return (
    <>
      <div
        className="group relative flex flex-col w-full bg-white overflow-hidden font-sans border border-neutral-200/70 hover:border-[#FF4D6D]/40 hover:-translate-y-1.5 hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] active:scale-[0.98] transition-all duration-300 ease-out rounded-2xl sm:rounded-3xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* 1. Product Image Container (Consistent Aspect Ratio & Sizing) */}
        <div
          className="relative aspect-[3/4] w-full bg-neutral-50 overflow-hidden cursor-pointer rounded-t-2xl sm:rounded-t-3xl"
          onClick={() => navigate("product-details", { productId: product.id })}
        >
          {/* Main Primary Image */}
          {isImageKitUrl(product.image) ? (
            <ImageKitImage
              src={product.image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                isHovered && secondImage ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />
          ) : (
            <img
              src={product.image}
              alt={product.name}
              className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                isHovered && secondImage ? "opacity-0" : "opacity-100"
              }`}
              loading="lazy"
            />
          )}

          {/* Second Image (Savana Hover Crossfade) */}
          {secondImage && (
            isImageKitUrl(secondImage) ? (
              <ImageKitImage
                src={secondImage}
                alt={`${product.name} alternate view`}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
              />
            ) : (
              <img
                src={secondImage}
                alt={`${product.name} alternate view`}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isHovered ? "opacity-100" : "opacity-0"
                }`}
                loading="lazy"
              />
            )
          )}

          {/* 2. Product Badges Overlay (Top-Left, Max 2 Compact Pill Badges) */}
          <div className="absolute left-2 top-2 z-20 flex flex-col gap-1 items-start pointer-events-none">
            {badges.slice(0, 2).map((badge, idx) => {
              if (badge.type === "out") {
                return (
                  <span key={idx} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black tracking-widest text-white bg-rose-600 uppercase rounded-full shadow-xs">
                    {badge.text}
                  </span>
                );
              }
              if (badge.type === "low") {
                return (
                  <span key={idx} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black tracking-widest text-amber-950 bg-amber-300 uppercase rounded-full shadow-xs animate-pulse">
                    ⚡ {badge.text}
                  </span>
                );
              }
              if (badge.type === "bestseller") {
                return (
                  <span key={idx} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black tracking-widest text-amber-950 bg-amber-300 uppercase rounded-full shadow-xs flex items-center gap-0.5">
                    <Star size={8} className="fill-amber-950 text-amber-950" /> {badge.text}
                  </span>
                );
              }
              if (badge.type === "new") {
                return (
                  <span key={idx} className="px-2 py-0.5 text-[8px] sm:text-[9px] font-black tracking-widest text-white bg-[#FF4D6D] uppercase rounded-full shadow-xs flex items-center gap-0.5">
                    <Sparkles size={8} /> {badge.text}
                  </span>
                );
              }
              return null;
            })}
          </div>

          {/* 3. Wishlist Heart Button (Top-Right, White Circular Shadow Pill with Smooth Animation) */}
          <div className="absolute right-2 top-2 z-20">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleWishlist(product);
              }}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md shadow-sm border border-neutral-100 hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 text-neutral-600 hover:text-[#FF4D6D] active:scale-75 transition-all duration-300 focus:outline-none cursor-pointer flex items-center justify-center shrink-0"
              aria-label="Add to Wishlist"
            >
              <Heart
                size={15}
                className={`transition-all duration-300 ${isWishlisted ? "fill-[#FF4D6D] text-[#FF4D6D] scale-110" : ""}`}
              />
            </button>
          </div>

          {/* 4. Rating Pill Overlay (⭐ 4.8 (55)) */}
          <div className="absolute left-2 bottom-2 z-20 inline-flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded-md shadow-xs text-[10px] sm:text-[11px] font-bold text-neutral-800 border border-neutral-200/50 pointer-events-none">
            <span className="text-amber-500 font-bold flex items-center gap-0.5">
              ⭐ {rating}
            </span>
            <span className="text-neutral-400 font-medium text-[9.5px]">({reviewCount})</span>
          </div>

          {/* Desktop Hover Quick View Overlay Button */}
          <div className="absolute inset-x-3 bottom-3 z-20 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 hidden md:block">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsQuickViewOpen(true);
              }}
              className="w-full py-2 bg-white/95 backdrop-blur-md hover:bg-black hover:text-white text-neutral-900 text-xs font-bold tracking-wider uppercase rounded-xl shadow-md border border-neutral-200/80 transition-all duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Eye size={13} />
              <span>Quick View</span>
            </button>
          </div>
        </div>

        {/* Info & Action Content Block */}
        <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1 space-y-2 bg-white font-sans">
          
          {/* 5. Product Name (Up to 2 lines with line-clamp-2) */}
          <button
            onClick={() => navigate("product-details", { productId: product.id })}
            className="text-left cursor-pointer focus:outline-none group/title inline-block w-full min-h-unset min-w-unset"
          >
            <h3 className="text-xs sm:text-[13.5px] font-semibold text-neutral-900 tracking-tight leading-snug line-clamp-2 group-hover/title:text-[#FF4D6D] transition-colors duration-300">
              {product.name}
            </h3>
          </button>

          {/* 6. Pricing Hierarchy (Selling Price | Original Price | Discount %) */}
          <div className="flex items-baseline gap-1.5 flex-wrap pt-0.5">
            <span className="text-sm sm:text-base font-black text-neutral-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.oldPrice > product.price && (
              <span className="text-xs text-neutral-400 line-through font-normal">
                ₹{product.oldPrice.toLocaleString("en-IN")}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-xs font-bold text-[#FF4D6D]">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* 7. Add to Cart Button (Desktop & Tablet Only - Hidden on Mobile) */}
          <div className="pt-1 hidden sm:block">
            {user && totalInCart > 0 ? (
              <div
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className="w-full h-9 bg-amber-400 border border-amber-400 text-amber-950 font-black rounded-xl flex items-center justify-between px-3 shadow-xs transition-all duration-200"
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
                  className="w-6 h-6 flex items-center justify-center text-base font-black hover:bg-amber-500/50 rounded-full transition-colors active:scale-90 cursor-pointer text-amber-950"
                  title="Decrease Quantity"
                >
                  −
                </button>

                <span className="text-xs font-black tracking-wide text-amber-950">
                  {totalInCart} in cart
                </span>

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const selectedSize = product.sizes?.[0] || "M";
                    addToCart(product, 1, selectedSize);
                  }}
                  className="w-6 h-6 flex items-center justify-center text-base font-black hover:bg-amber-500/50 rounded-full transition-colors active:scale-90 cursor-pointer text-amber-950"
                  title="Increase Quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full h-9 text-[10px] sm:text-xs font-extrabold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-1.5 rounded-xl shadow-xs cursor-pointer focus:outline-none min-h-unset min-w-unset font-sans active:scale-[0.97] ${
                  isOutOfStock
                    ? "bg-neutral-200 text-neutral-400 cursor-not-allowed shadow-none"
                    : isAdded
                    ? "bg-emerald-600 text-white shadow-emerald-600/30 scale-[1.02]"
                    : "bg-[#111111] hover:bg-[#FF4D6D] text-white hover:shadow-[0_4px_14px_rgba(255,77,109,0.35)]"
                }`}
              >
                {isOutOfStock ? (
                  <span>Out of Stock</span>
                ) : isAdded ? (
                  <>
                    <Check size={14} className="animate-bounce" />
                    <span>Added!</span>
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
