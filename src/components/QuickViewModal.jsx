import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { X, Star, ShoppingBag, Heart, ShieldCheck, Truck, RefreshCw, Check, ArrowRight } from "lucide-react";
import ImageKitImage from "./ImageKitImage";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.startsWith("/") || !url.startsWith("http");
};

export default function QuickViewModal({ product, isOpen, onClose, navigate }) {
  const { addToCart, toggleWishlist, wishlist, addToast } = useApp();

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) && product.images.length > 0
    ? product.images
    : [product.image, product.altImage || product.hoverImage || product.secondImage].filter(Boolean);

  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "M");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0]?.name || "Original");
  const [isAdded, setIsAdded] = useState(false);

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const rating = Number(product.rating) || 4.8;
  const reviewCount = Number(product.ratingCount) || (Array.isArray(product.reviews) ? product.reviews.length : 0) || 36;
  const discountPercent = product.oldPrice > product.price
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    addToCart(product, 1, selectedSize);
    setIsAdded(true);
    addToast(`Added "${product.name}" (${selectedSize}) to cart!`, "success");
    setTimeout(() => setIsAdded(false), 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-fade-in font-sans">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-neutral-200/80 flex flex-col md:flex-row max-h-[90vh] md:max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md border border-neutral-200 hover:bg-black hover:text-white text-neutral-700 flex items-center justify-center transition-all duration-300 shadow-md cursor-pointer focus:outline-none"
        >
          <X size={18} />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="w-full md:w-1/2 bg-neutral-50 p-4 sm:p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-neutral-100">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-white border border-neutral-200/60 shadow-sm">
            {isImageKitUrl(images[activeImgIndex]) ? (
              <ImageKitImage
                src={images[activeImgIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-all duration-500"
              />
            ) : (
              <img
                src={images[activeImgIndex]}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-all duration-500"
              />
            )}
            
            {/* Discount Tag */}
            {discountPercent > 0 && (
              <span className="absolute top-3 left-3 px-3 py-1 text-xs font-extrabold text-white bg-gradient-to-r from-[#FF4D6D] to-[#FF1E46] rounded-full shadow-md">
                {discountPercent}% OFF
              </span>
            )}
          </div>

          {/* Thumbnail strip */}
          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIndex(idx)}
                  className={`w-14 h-16 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    activeImgIndex === idx ? "border-[#FF4D6D] shadow-md scale-105" : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img src={img} alt={`thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Details & Purchase Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[500px] md:max-h-none">
          <div className="space-y-4">
            
            {/* Category & Badge */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#FF4D6D] bg-[#FF4D6D]/10 px-2.5 py-1 rounded-full border border-[#FF4D6D]/20">
                {product.category || "Fashion"}
              </span>
              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 px-2.5 py-1 rounded-full border border-amber-500/20 text-xs font-bold">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{rating}</span>
                <span className="text-neutral-400 font-normal">({reviewCount} reviews)</span>
              </div>
            </div>

            {/* Product Title */}
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-display leading-snug">
              {product.name}
            </h2>

            {/* Price & Savings */}
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-neutral-900">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              {product.oldPrice > product.price && (
                <span className="text-base text-neutral-400 line-through">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/60">
                  Save {discountPercent}%
                </span>
              )}
            </div>

            {/* Color Swatch Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700">
                  Color: <span className="text-[#FF4D6D] font-bold">{selectedColor}</span>
                </label>
                <div className="flex gap-2">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedColor(c.name)}
                      style={{ backgroundColor: c.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all cursor-pointer ${
                        selectedColor === c.name ? "border-[#FF4D6D] ring-2 ring-[#FF4D6D]/30 scale-110" : "border-white shadow-sm hover:scale-105"
                      }`}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-700">
                Select Size: <span className="text-[#FF4D6D]">{selectedSize}</span>
              </label>
              <div className="flex gap-2">
                {(product.sizes || ["S", "M", "L", "XL"]).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`w-10 h-10 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      selectedSize === sz
                        ? "bg-[#111111] text-white border-black shadow-md scale-105"
                        : "bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-black"
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Description Snippet */}
            <p className="text-xs text-neutral-500 font-light leading-relaxed pt-2 line-clamp-2">
              {product.description || "Crafted from premium fabrics for unmatched comfort, elegant styling, and lasting luxury durability."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="pt-6 space-y-3 border-t border-neutral-100 mt-4">
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                className={`flex-1 h-12 rounded-xl text-xs font-extrabold uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
                  isAdded
                    ? "bg-emerald-600 text-white shadow-emerald-600/30"
                    : "bg-gradient-to-r from-[#111111] via-[#222222] to-[#111111] hover:from-[#FF4D6D] hover:to-[#FF1E46] text-white hover:scale-[1.02]"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check size={16} className="animate-bounce" />
                    <span>Added to Cart!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add to Cart</span>
                  </>
                )}
              </button>

              <button
                onClick={() => toggleWishlist(product)}
                className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isWishlisted ? "bg-rose-50 border-rose-200 text-[#FF4D6D]" : "border-neutral-200 hover:border-rose-300 text-neutral-600"
                }`}
              >
                <Heart size={18} className={isWishlisted ? "fill-[#FF4D6D]" : ""} />
              </button>
            </div>

            <button
              onClick={() => {
                onClose();
                navigate("product-details", { productId: product.id });
              }}
              className="w-full text-center text-xs font-bold text-neutral-500 hover:text-black transition-colors flex items-center justify-center gap-1 py-1"
            >
              <span>View Full Product Details</span>
              <ArrowRight size={13} />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
