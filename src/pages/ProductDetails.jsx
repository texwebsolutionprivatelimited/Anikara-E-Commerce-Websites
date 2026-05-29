import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Star, Heart, ShoppingBag, CreditCard, ChevronRight, ChevronLeft, Plus, Minus, ArrowLeft, Package, RefreshCcw, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Image as IKImage } from "@imagekit/react";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.startsWith("/") || !url.startsWith("http");
};

export default function ProductDetails({ navigate, currentParams = {}, goBack }) {
  const productId = currentParams.productId;
  const { products, addToCart, toggleWishlist, wishlist, addToast, user, addProductReview } = useApp();

  const product = products.find((p) => p.id === productId);

  // States
  const [activeImage, setActiveImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");

  // Zoom Style Coordinates
  const [zoomStyle, setZoomStyle] = useState({ display: "none" });

  // Reviews Mock addition
  const [reviewsList, setReviewsList] = useState([]);
  const [newReviewName, setNewReviewName] = useState("");
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);

  const [activeReviewSlideIndex, setActiveReviewSlideIndex] = useState(0);

  // Initialize standard details only when product ID changes (avoids resetting selections when background updates trigger on snapshot)
  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes?.[0] || "M");
      setSelectedColor(product.colors?.[0]?.name || "Default");
      setActiveReviewSlideIndex(0);
    }
  }, [productId]);

  // Keep reviewsList in sync with Firebase updates
  useEffect(() => {
    if (product) {
      setReviewsList(product.reviews || []);
    }
  }, [product]);

  // Auto-scroll review slides every 5000ms if there are more than 6 reviews (3 rows of 2 columns)
  useEffect(() => {
    if (reviewsList.length <= 6) return;
    const totalSlides = Math.ceil(reviewsList.length / 6);
    const timer = setInterval(() => {
      setActiveReviewSlideIndex((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(timer);
  }, [reviewsList.length]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <h2 className="text-xl font-bold uppercase tracking-wider text-neutral-800 mb-2">Product Not Found</h2>
        <p className="text-xs text-neutral-400 mb-6 font-light">The item you are looking for does not exist or has been removed.</p>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 px-6 py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
        >
          <ArrowLeft size={14} /> Back
        </button>
      </div>
    );
  }

  const isWishlisted = wishlist.some((item) => item.id === product.id);
  const stockCount = product.stock !== undefined && product.stock !== null ? Number(product.stock) : 4;
  const viewersCount = ((product.name?.charCodeAt(0) || 6) + (product.name?.charCodeAt(product.name.length - 1) || 12)) % 15 + 6;
  const reviewCount = reviewsList.length || Number(product.ratingCount) || 0;
  const hasRating = reviewCount > 0 && Number(product.rating) > 0;
  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

  // Helper to dynamically extract spec values set via admin panel
  const getDetailValue = (keyName, defaultValue) => {
    if (!product.details || !Array.isArray(product.details)) return defaultValue;
    const match = product.details.find(d => {
      const lowerD = d.toLowerCase().trim();
      return lowerD.startsWith(`${keyName.toLowerCase()}:`) || 
             lowerD.startsWith(`${keyName.toLowerCase()} instructions:`) || 
             lowerD.startsWith(`${keyName.toLowerCase()} type:`);
    });
    if (match) {
      const parts = match.split(":");
      return parts.slice(1).join(":").trim();
    }
    return defaultValue;
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;
    setZoomStyle({
      display: "block",
      backgroundImage: `url(${activeImage})`,
      backgroundPosition: `${x}% ${y}%`
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({ display: "none" });
  };

  const handleAddToCart = () => {
    if (!user) {
      addToast("Please log in to add items to your cart.", "warning");
      navigate("login");
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
  };

  const handleBuyNow = () => {
    if (!user) {
      addToast("Please log in to buy items.", "warning");
      navigate("login");
      return;
    }
    addToCart(product, quantity, selectedSize, selectedColor);
    navigate("checkout");
  };

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

  const similarProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (newReviewName.trim() && newReviewComment.trim()) {
      const newReview = {
        user: newReviewName,
        rating: parseInt(newReviewRating),
        date: new Date().toISOString().split("T")[0],
        comment: newReviewComment
      };
      
      // Optimistic Update: Add to local state immediately
      setReviewsList((prev) => [newReview, ...prev]);
      
      const success = await addProductReview(product.id, newReview);
      if (success) {
        setNewReviewName("");
        setNewReviewComment("");
        addToast("Review Posted! Thank you for sharing.", "success");
      } else {
        // Rollback on failure
        setReviewsList(product.reviews || []);
      }
    }
  };

  const testimonial = (reviewsList && reviewsList.length > 0) ? {
    user: reviewsList[0].user,
    comment: reviewsList[0].comment,
    rating: reviewsList[0].rating
  } : null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-6 sm:pb-8 font-sans">
      
      {/* Breadcrumbs Navigation (Flipkart/Amazon style) */}
      <nav className="flex items-center flex-wrap gap-1.5 text-[11px] font-sans text-neutral-600 mb-3.5 bg-neutral-50 px-3.5 py-1.5 rounded-lg border border-neutral-300/80 w-fit leading-normal shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
        <button
          onClick={() => navigate("home")}
          className="hover:text-[#FF4D6D] transition-colors focus:outline-none cursor-pointer font-semibold min-h-unset min-w-unset p-0 py-0.5 leading-normal"
        >
          Home
        </button>
        <ChevronRight size={11} className="text-neutral-400 shrink-0 font-bold" />
        <button
          onClick={() => navigate("products")}
          className="hover:text-[#FF4D6D] transition-colors focus:outline-none cursor-pointer font-semibold min-h-unset min-w-unset p-0 py-0.5 leading-normal"
        >
          Shop
        </button>
        <ChevronRight size={11} className="text-neutral-400 shrink-0 font-bold" />
        <button
          onClick={() => navigate("products", { category: product.category })}
          className="hover:text-[#FF4D6D] transition-colors focus:outline-none cursor-pointer font-semibold min-h-unset min-w-unset p-0 py-0.5 leading-normal"
        >
          {product.category}
        </button>
        <ChevronRight size={11} className="text-neutral-400 shrink-0 font-bold" />
        <span className="text-neutral-900 font-extrabold truncate max-w-[150px] sm:max-w-xs py-0.5 leading-normal">
          {product.name}
        </span>
      </nav>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        
        {/* Left Column (Images + Testimonial Spotlight) */}
        <div className="flex flex-col">
          {/* Images */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Thumbnails (Vertical Column on Desktop, Horizontal Row on Mobile) */}
            <div className="flex md:flex-col gap-3 order-2 md:order-1 overflow-x-auto md:overflow-y-auto md:w-24 shrink-0 scrollbar-hide px-2 py-2 md:max-h-[500px]">
              <button
                onClick={() => setActiveImage(product.image)}
                className={`relative aspect-[4/5] w-16 md:w-full bg-white shrink-0 border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${
                  activeImage === product.image ? "border-[#FF4D6D] scale-105 shadow-[0_4px_12px_rgba(255,77,109,0.15)]" : "border-neutral-200/60 hover:border-[#FF4D6D]/45"
                }`}
              >
                {isImageKitUrl(product.image) ? (
                  <IKImage src={product.image} alt="Main view thumbnail" className="w-full h-full object-contain bg-white rounded-lg" />
                ) : (
                  <img src={product.image} alt="Main view thumbnail" className="w-full h-full object-contain bg-white rounded-lg" />
                )}
              </button>
              {product.altImage && (
                <button
                  onClick={() => setActiveImage(product.altImage)}
                  className={`relative aspect-[4/5] w-16 md:w-full bg-white shrink-0 border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${
                    activeImage === product.altImage ? "border-[#FF4D6D] scale-105 shadow-[0_4px_12px_rgba(255,77,109,0.15)]" : "border-neutral-200/60 hover:border-[#FF4D6D]/45"
                  }`}
                >
                  {isImageKitUrl(product.altImage) ? (
                    <IKImage src={product.altImage} alt="Alternate view thumbnail" className="w-full h-full object-contain bg-white rounded-lg" />
                  ) : (
                    <img src={product.altImage} alt="Alternate view thumbnail" className="w-full h-full object-contain bg-white rounded-lg" />
                  )}
                </button>
              )}
              {product.images && product.images.map((imgUrl, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(imgUrl)}
                  className={`relative aspect-[4/5] w-16 md:w-full bg-white shrink-0 border-2 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 focus:outline-none ${
                    activeImage === imgUrl ? "border-[#FF4D6D] scale-105 shadow-[0_4px_12px_rgba(255,77,109,0.15)]" : "border-neutral-200/60 hover:border-[#FF4D6D]/45"
                  }`}
                >
                  {isImageKitUrl(imgUrl) ? (
                    <IKImage src={imgUrl} alt={`Gallery view thumbnail ${index + 1}`} className="w-full h-full object-contain bg-white rounded-lg" />
                  ) : (
                    <img src={imgUrl} alt={`Gallery view thumbnail ${index + 1}`} className="w-full h-full object-contain bg-white rounded-lg" />
                  )}
                </button>
              ))}
            </div>

            {/* Main Large Active Image */}
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative flex-1 aspect-[4/5] bg-white overflow-hidden cursor-crosshair group rounded-xl border-2 border-neutral-100 hover:border-[#FF4D6D] hover:shadow-[0_20px_40px_rgba(255,77,109,0.04)] transition-all duration-500 ease-out order-1 md:order-2"
            >
              {isImageKitUrl(activeImage) ? (
                <IKImage
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain bg-white group-hover:opacity-0 transition-opacity duration-200 rounded-xl"
                />
              ) : (
                <img
                  src={activeImage}
                  alt={product.name}
                  className="w-full h-full object-contain bg-white group-hover:opacity-0 transition-opacity duration-200 rounded-xl"
                />
              )}
              <div
                style={zoomStyle}
                className="absolute inset-0 bg-no-repeat bg-[length:200%_200%] rounded-xl"
              />
              {discountPercent > 0 && (
                <span className="absolute left-4 top-4 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] uppercase z-10 rounded-full shadow-xs border border-white/10">
                  {discountPercent}% OFF
                </span>
              )}
              {/* Action Buttons Top Right Overlay */}
              <div className="absolute right-4 top-4 z-10 flex flex-col gap-2">
                {/* Wishlist Heart Button Overlay */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(product);
                  }}
                  className="bg-white/90 hover:bg-white text-neutral-700 hover:text-[#FF4D6D] p-2.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_15px_rgba(255,77,109,0.18)] transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center"
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart size={16} className={isWishlisted ? "fill-[#FF4D6D] text-[#FF4D6D]" : ""} />
                </button>

                {/* Share Button Overlay */}
                <button
                  onClick={handleShare}
                  className="bg-white/90 hover:bg-white text-neutral-700 hover:text-[#FF4D6D] p-2.5 rounded-full shadow-[0_2px_10px_rgba(0,0,0,0.06)] hover:shadow-[0_4px_15px_rgba(255,77,109,0.18)] transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center"
                  aria-label="Share Product"
                >
                  <Share2 size={16} />
                </button>
              </div>
            </div>
          </div>


        </div>


        {/* Product Information */}
        <div className="space-y-5">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-neutral-100 text-[9px] font-extrabold text-[#FF4D6D] tracking-widest uppercase border border-[#FF4D6D]/15">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-pulse-slow"></span>
                {product.category}
              </span>
              <span className="px-3 py-0.5 rounded-full bg-amber-50 text-[9px] font-extrabold text-amber-700 tracking-widest uppercase border border-amber-200/50 flex items-center gap-1">
                ⭐ Anikara Couture Edition
              </span>
            </div>

            <h1 className="text-xl sm:text-2.5xl font-black tracking-tight text-neutral-900 font-display leading-tight">
              {product.name}
            </h1>

            {/* Live Ticker / Interactive Activity Urgency Ticker - Highly Responsive & Dynamic */}
            {stockCount === 0 ? (
              <div className="flex items-start gap-2.5 bg-neutral-50 border border-neutral-200 rounded-xl p-3 text-[11px] text-neutral-500 font-sans">
                <span className="relative flex h-2 w-2 mt-0.5 shrink-0">
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-neutral-300"></span>
                </span>
                <p className="font-semibold leading-normal font-sans">
                  Status: <span className="font-extrabold text-neutral-700">Out of Stock</span>. Restocking soon!
                </p>
              </div>
            ) : stockCount <= 10 ? (
              <div className="flex items-start gap-2.5 bg-rose-50/50 border border-rose-100/60 rounded-xl p-3 text-[11px] text-rose-800 font-sans shadow-[0_2px_10px_rgba(255,77,109,0.02)]">
                <span className="relative flex h-2 w-2 mt-0.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF4D6D]"></span>
                </span>
                <p className="font-semibold leading-normal font-sans">
                  High Demand: <span className="font-extrabold text-[#FF4D6D]">Only {stockCount} left</span> in stock. <span className="font-normal text-neutral-500">{viewersCount} shoppers viewed this in the last hour.</span>
                </p>
              </div>
            ) : (
              <div className="flex items-start gap-2.5 bg-emerald-50/40 border border-emerald-100/60 rounded-xl p-3 text-[11px] text-emerald-800 font-sans shadow-[0_2px_10px_rgba(16,185,129,0.02)]">
                <span className="relative flex h-2 w-2 mt-0.5 shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#10B981]"></span>
                </span>
                <p className="font-semibold leading-normal font-sans">
                  Available: <span className="font-extrabold text-[#10B981]">{stockCount} items</span> in stock. <span className="font-normal text-neutral-500">{viewersCount} shoppers viewed this in the last hour.</span>
                </p>
              </div>
            )}
            
            {hasRating && (
              <div className="flex items-center gap-2.5 pt-1.5">
                <div className="flex items-center text-amber-400 gap-0.5 bg-amber-50/50 border border-amber-200/30 px-2 py-0.5 rounded-full">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={10.5}
                      className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                    />
                  ))}
                  <span className="text-[10px] font-bold text-amber-800 ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-neutral-400 font-light tracking-wide">
                  • Based on {reviewCount} {reviewCount === 1 ? "verified review" : "verified reviews"}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 py-3 border-y border-neutral-100">
            <span className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.oldPrice > product.price && (
              <>
                <span className="text-sm text-neutral-400 line-through font-light">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-[10px] font-extrabold text-white tracking-widest uppercase bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] px-2.5 py-1 rounded-full shadow-[0_4px_12px_rgba(255,77,109,0.18)] border border-white/10 animate-pulse-slow">
                  Save ₹{(product.oldPrice - product.price).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          <p className="text-[12.5px] text-neutral-600 leading-relaxed font-light font-sans">
            {product.description}
          </p>

          {/* Color selects */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-display">
                Color: <span className="text-neutral-900 font-semibold">{selectedColor}</span>
              </span>
              <div className="flex gap-4 py-1.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex, borderRadius: "50%" }}
                    className={`w-8 h-8 border relative transition-all duration-300 hover:scale-110 focus:outline-none cursor-pointer flex items-center justify-center ${
                      selectedColor === c.name
                        ? "border-[#FF4D6D] ring-2 ring-[#FF4D6D] ring-offset-2 scale-110 shadow-md"
                        : "border-neutral-300 hover:border-neutral-400"
                    }`}
                    aria-label={`Select color ${c.name}`}
                  >
                    {selectedColor === c.name && (
                      <span
                        style={{ borderRadius: "50%" }}
                        className={`w-2.5 h-2.5 transition-transform duration-300 ${
                          c.name.toLowerCase() === "white" || c.hex.toLowerCase() === "#ffffff" || c.hex.toLowerCase() === "#fff"
                            ? "bg-neutral-900"
                            : "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.35)]"
                        }`}
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selects */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 font-display">
                Select Size: <span className="text-[#FF4D6D] font-extrabold">{selectedSize}</span>
              </span>
              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[46px] h-10 px-3.5 text-xs font-extrabold rounded-lg border transition-all duration-300 cursor-pointer focus:outline-none flex items-center justify-center active:scale-95 hover:-translate-y-0.5 ${
                      selectedSize === s
                        ? "bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] border-[#FF4D6D] text-white shadow-[0_6px_16px_rgba(255,77,109,0.3)] scale-105"
                        : "bg-neutral-50 border-neutral-200 text-neutral-700 hover:border-[#FF4D6D] hover:text-[#FF4D6D] hover:shadow-[0_4px_10px_rgba(255,77,109,0.08)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty & Add triggers */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-5 border-t border-neutral-100">
            {/* Group Qty & Add to Bag on mobile, but keep flex items on sm */}
            <div className="flex flex-1 gap-3 min-w-0">
              {/* Qty Selector */}
              <div className="flex items-center justify-between border border-neutral-200 h-12 w-28 sm:w-32 px-2.5 shrink-0 rounded-xl bg-neutral-50/50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-neutral-200 text-neutral-600 transition-colors focus:outline-none min-h-unset min-w-unset shadow-xs border border-neutral-200/40"
                >
                  <Minus size={11} />
                </button>
                <span className="text-xs font-black text-neutral-800 font-sans">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="w-7 h-7 flex items-center justify-center rounded-full bg-white hover:bg-neutral-200 text-neutral-600 transition-colors focus:outline-none min-h-unset min-w-unset shadow-xs border border-neutral-200/40"
                >
                  <Plus size={11} />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-grow sm:flex-1 h-12 bg-white hover:bg-neutral-900 border border-neutral-900 text-neutral-900 hover:text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer focus:outline-none font-display min-h-unset min-w-unset shadow-xs hover:shadow-md"
              >
                <ShoppingBag size={14} />
                Add to Bag
              </button>
            </div>

            {/* Buy It Now */}
            <button
              onClick={handleBuyNow}
              className="w-full sm:flex-1 h-12 bg-gradient-to-r from-[#FF4D6D] to-[#FF758F] hover:from-[#FF1E46] hover:to-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer focus:outline-none font-display min-h-unset min-w-unset shadow-[0_8px_20px_rgba(255,77,109,0.25)] hover:shadow-[0_12px_28px_rgba(255,77,109,0.4)] hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <CreditCard size={14} />
              Buy It Now
            </button>
          </div>

          {/* Luxury Product Highlights Grid */}
          <div className="grid grid-cols-2 gap-3 pt-5 border-t border-neutral-100/80">
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-300/80 bg-neutral-50/40">
              <span className="w-8 h-8 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D]">
                <Package size={14} />
              </span>
              <div>
                <p className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider leading-none mb-0.5">Fabric</p>
                <p className="text-[10.5px] font-bold text-neutral-800">{getDetailValue("Fabric", "Premium Soft Satin")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-300/80 bg-neutral-50/40">
              <span className="w-8 h-8 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D]">
                <Star size={14} className="fill-[#FF4D6D]/10" />
              </span>
              <div>
                <p className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider leading-none mb-0.5">Fit</p>
                <p className="text-[10.5px] font-bold text-neutral-800">{getDetailValue("Fit", "Ultra Lounge Relaxed")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-300/80 bg-neutral-50/40">
              <span className="w-8 h-8 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D]">
                <RefreshCcw size={14} />
              </span>
              <div>
                <p className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider leading-none mb-0.5">Care</p>
                <p className="text-[10.5px] font-bold text-neutral-800">{getDetailValue("Care", "Machine Wash Safe")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl border border-neutral-300/80 bg-neutral-50/40">
              <span className="w-8 h-8 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D]">
                <CreditCard size={14} />
              </span>
              <div>
                <p className="text-[9px] font-extrabold uppercase text-neutral-400 tracking-wider leading-none mb-0.5">Delivery</p>
                <p className="text-[10.5px] font-bold text-neutral-800">{getDetailValue("Delivery", "Free Express Shipping")}</p>
              </div>
            </div>
          </div>
        </div> {/* Close Right Column (space-y-5) */}
      </div> {/* Close Main Details Grid */}

      {/* Full-Width Accordion detail list strip (Flipkart/Amazon style) */}
      <div className="mt-10 pt-8 border-t border-neutral-300 space-y-5">
        {/* Elegant Capsule Tab Selector (Apple/Luxury layout) - Highly Responsive on all phone sizes */}
        <div className="grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-1.5 bg-neutral-100/80 rounded-xl w-full border border-neutral-300/80">
          <button
            onClick={() => setActiveTab("description")}
            className={`px-1.5 sm:px-5 py-1.5 sm:py-2 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-tight sm:tracking-wider rounded-lg transition-all duration-300 focus:outline-none cursor-pointer min-h-unset min-w-unset text-center line-clamp-1 truncate ${
              activeTab === "description"
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Product Details
          </button>
          <button
            onClick={() => setActiveTab("shipping")}
            className={`px-1.5 sm:px-5 py-1.5 sm:py-2 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-tight sm:tracking-wider rounded-lg transition-all duration-300 focus:outline-none cursor-pointer min-h-unset min-w-unset text-center line-clamp-1 truncate ${
              activeTab === "shipping"
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Shipping & Return
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-1.5 sm:px-5 py-1.5 sm:py-2 text-[9px] xs:text-[10px] sm:text-[11px] font-black uppercase tracking-tight sm:tracking-wider rounded-lg transition-all duration-300 focus:outline-none cursor-pointer min-h-unset min-w-unset text-center line-clamp-1 truncate ${
              activeTab === "reviews"
                ? "bg-white text-neutral-900 shadow-sm border border-neutral-200/50"
                : "text-neutral-500 hover:text-neutral-800"
            }`}
          >
            Reviews ({reviewsList.length})
          </button>
        </div>

            <div className="py-2">
              {activeTab === "description" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-sans pt-1">
                  {/* Dynamic split of bullets into luxurious double-sided parameter boxes */}
                  {product.details?.map((detail, idx) => {
                    const hasColon = detail.includes(":");
                    const parts = hasColon ? detail.split(":") : [];
                    const label = hasColon ? parts[0].trim() : "";
                    const value = hasColon ? parts.slice(1).join(":").trim() : "";
                    const hasValue = value.length > 0;

                    if (hasColon && hasValue) {
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3.5 bg-neutral-50/60 border border-neutral-300/80 rounded-xl hover:border-[#FF4D6D]/35 hover:bg-rose-50/5 transition-all duration-300 group shadow-[0_1px_3px_rgba(0,0,0,0.01)]"
                        >
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest group-hover:text-[#FF4D6D] transition-colors duration-300">
                            {label}
                          </span>
                          <span className="text-[11.5px] font-black text-neutral-800 text-right leading-tight">
                            {value}
                          </span>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          key={idx}
                          className="flex items-start gap-2.5 p-3.5 bg-neutral-50/50 border border-neutral-300/80 rounded-xl text-[11px] text-neutral-700 font-medium font-sans hover:border-[#FF4D6D]/35 hover:bg-rose-50/5 transition-all duration-300"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-1.5 animate-pulse"></span>
                          <span>{detail}</span>
                        </div>
                      );
                    }
                  })}
                  <div className="flex items-start gap-2.5 p-3.5 bg-neutral-50/50 border border-neutral-300/80 rounded-xl text-[11px] text-neutral-500 font-normal font-sans hover:border-[#FF4D6D]/35 transition-all duration-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] shrink-0 mt-1.5 animate-pulse"></span>
                    <span>Regular comfort fit crafted with imported premium quality yarns for maximum breathability.</span>
                  </div>
                </div>
              ) : activeTab === "shipping" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-1">
                  <div className="flex gap-3.5 p-4 rounded-xl border border-neutral-200/60 bg-neutral-50/60 hover:border-[#FF4D6D]/20 transition-all duration-300">
                    <span className="w-10 h-10 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D] shrink-0">
                      <Package size={16} />
                    </span>
                    <div>
                      <h4 className="text-[11px] font-black text-neutral-800 uppercase tracking-wider mb-1 font-display">Standard Shipping</h4>
                      <p className="text-[11px] text-neutral-500 font-light leading-relaxed font-sans">Free express delivery across India on all orders above ₹1,500. Takes 3-5 business days to deliver with tracking.</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3.5 p-4 rounded-xl border border-neutral-200/60 bg-neutral-50/60 hover:border-[#FF4D6D]/20 transition-all duration-300">
                    <span className="w-10 h-10 rounded-full bg-[#FF4D6D]/10 flex items-center justify-center text-[#FF4D6D] shrink-0">
                      <RefreshCcw size={16} />
                    </span>
                    <div>
                      <h4 className="text-[11px] font-black text-neutral-800 uppercase tracking-wider mb-1 font-display">Return Policy</h4>
                      <p className="text-[11px] text-neutral-500 font-light leading-relaxed font-sans">Easy 15-day return and exchange on all unworn items with tags intact. Hassle-free pickups directly from your doorstep.</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Customer Reviews Tab (Dynamic interactive panel!) */
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
                  {/* Mock review forms (1 Column) */}
                  <div className="bg-neutral-50/60 p-4 border border-neutral-300/80 rounded-xl space-y-4 flex flex-col h-full">
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 font-display">Write a Review</h3>
                    <form onSubmit={handleReviewSubmit} className="space-y-3.5">
                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-neutral-450 mb-1 font-display tracking-wider">Your Name</label>
                        <input
                          type="text"
                          required
                          value={newReviewName}
                          onChange={(e) => setNewReviewName(e.target.value)}
                          className="w-full bg-white border border-neutral-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#FF4D6D] transition-colors leading-none"
                          placeholder="E.g., Sneha Sharma"
                        />
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-neutral-450 mb-1 font-display tracking-wider">Rating</label>
                        <select
                          value={newReviewRating}
                          onChange={(e) => setNewReviewRating(e.target.value)}
                          className="w-full bg-white border border-neutral-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#FF4D6D] transition-colors font-bold text-neutral-800"
                        >
                          <option value={5}>5 Stars (Excellent)</option>
                          <option value={4}>4 Stars (Very Good)</option>
                          <option value={3}>3 Stars (Average)</option>
                          <option value={2}>2 Stars (Poor)</option>
                          <option value={1}>1 Star (Very Bad)</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[9px] font-extrabold uppercase text-neutral-450 mb-1 font-display tracking-wider">Your Comments</label>
                        <textarea
                          required
                          rows={4}
                          value={newReviewComment}
                          onChange={(e) => setNewReviewComment(e.target.value)}
                          className="w-full bg-white border border-neutral-250 text-xs px-3.5 py-2.5 rounded-lg focus:outline-none focus:border-[#FF4D6D] transition-colors font-light resize-none leading-relaxed"
                          placeholder="Share your thoughts on product quality, fit, and styling..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer focus:outline-none rounded-xl hover:shadow-[0_4px_12px_rgba(255,77,109,0.25)] active:scale-[0.98]"
                      >
                        Post Review
                      </button>
                    </form>
                  </div>

                  {/* Reviews List (Interactive sliding carousel if > 3 rows / 6 reviews) */}
                  <div className="md:col-span-2 bg-neutral-50/60 p-4 border border-neutral-300/80 rounded-xl overflow-hidden flex flex-col justify-between h-full">
                    {reviewsList.length > 0 ? (
                      <>
                        <div className="overflow-hidden w-full">
                          <div
                            className="flex transition-transform duration-500 ease-out w-full"
                            style={{ transform: `translateX(-${activeReviewSlideIndex * 100}%)` }}
                          >
                            {/* Group reviews in chunks of 6 (3 rows of 2 reviews) */}
                            {Array.from({ length: Math.ceil(reviewsList.length / 6) }).map((_, slideIdx) => {
                              const slideReviews = reviewsList.slice(slideIdx * 6, (slideIdx + 1) * 6);
                              return (
                                <div key={slideIdx} className="w-full min-w-full shrink-0 grid grid-cols-1 sm:grid-cols-2 gap-3.5 content-start">
                                  {slideReviews.map((review, idx) => (
                                    <div key={idx} className="p-4 bg-white border border-neutral-250 rounded-xl space-y-2 hover:border-[#FF4D6D]/35 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 h-fit shadow-xs">
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs font-black text-neutral-800">{review.user}</span>
                                        <span className="text-[10px] text-neutral-400 font-light font-sans">{review.date}</span>
                                      </div>
                                      <div className="flex items-center text-amber-500 gap-0.5">
                                        {Array.from({ length: 5 }).map((_, i) => (
                                          <Star
                                            key={i}
                                            size={11}
                                            className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                                          />
                                        ))}
                                      </div>
                                      <p className="text-[12px] text-neutral-600 font-light leading-relaxed font-sans">
                                        {review.comment}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Navigation Dots (Only if there is more than 1 slide) */}
                        {reviewsList.length > 6 && (
                          <div className="flex justify-center gap-1.5 mt-4">
                            {Array.from({ length: Math.ceil(reviewsList.length / 6) }).map((_, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => setActiveReviewSlideIndex(idx)}
                                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none min-h-unset min-w-unset ${
                                  activeReviewSlideIndex === idx ? "w-4 bg-[#FF4D6D]" : "w-1.5 bg-neutral-300"
                                }`}
                                aria-label={`Go to slide ${idx + 1}`}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full text-center py-16 bg-white border border-dashed border-neutral-250 rounded-xl flex flex-col items-center justify-center gap-2 h-full shadow-xs">
                        <p className="text-xs text-neutral-400 font-light font-sans">No customer reviews yet.</p>
                        <p className="text-[10px] text-[#FF4D6D] font-bold uppercase tracking-wider">Be the first to share your experience!</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

      {/* Related similar collection - Compact Editorial Layout */}
      {similarProducts.length > 0 && (
        <section className="mt-6 md:mt-8 border-t border-neutral-300 pt-6 sm:pt-8 font-sans">
          <div className="flex flex-col mb-4 sm:mb-5 space-y-0.5">
            <span className="text-[8px] font-black uppercase tracking-[0.25em] text-[#FF4D6D] leading-none">
              Curated Wardrobe
            </span>
            <h2 className="text-xs sm:text-sm font-black tracking-[0.12em] text-neutral-900 uppercase font-display leading-none mt-1">
              You May Also Like
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 animate-fade-in">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
