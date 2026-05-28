import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { Star, Heart, ShoppingBag, CreditCard, ChevronRight, Plus, Minus, ArrowLeft, Package, RefreshCcw, Share2 } from "lucide-react";
import { motion } from "framer-motion";
import { Image as IKImage } from "@imagekit/react";

const isImageKitUrl = (url) => {
  if (!url) return false;
  return url.includes("ik.imagekit.io") || url.startsWith("/") || !url.startsWith("http");
};

export default function ProductDetails({ navigate, currentParams = {}, goBack }) {
  const productId = currentParams.productId;
  const { products, addToCart, toggleWishlist, wishlist, addToast, user } = useApp();

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

  useEffect(() => {
    if (product) {
      setActiveImage(product.image);
      setSelectedSize(product.sizes?.[0] || "M");
      setSelectedColor(product.colors?.[0]?.name || "Default");
      setReviewsList(product.reviews || []);
    }
  }, [product, productId]);

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
  const discountPercent = Math.round(
    ((product.oldPrice - product.price) / product.oldPrice) * 100
  );

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

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (newReviewName.trim() && newReviewComment.trim()) {
      const newReview = {
        user: newReviewName,
        rating: parseInt(newReviewRating),
        date: new Date().toISOString().split("T")[0],
        comment: newReviewComment
      };
      setReviewsList([newReview, ...reviewsList]);
      setNewReviewName("");
      setNewReviewComment("");
      addToast("Review Posted! Thank you for sharing.", "success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-5 pb-6 sm:pt-8 sm:pb-8 font-sans">
      
      {/* Back Button */}
      <button
        onClick={goBack}
        className="inline-flex items-center gap-2 text-[10px] font-bold text-neutral-700 bg-neutral-50 border border-neutral-200 hover:bg-[#FF4D6D] hover:text-white hover:border-[#FF4D6D] px-3.5 py-2 uppercase tracking-wider transition-all duration-300 rounded-sm focus:outline-none cursor-pointer mb-5"
      >
        <ArrowLeft size={12} />
        Back
      </button>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-start">
        
        {/* Images */}
        <div className="flex flex-col gap-4">
          <div
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden cursor-crosshair group rounded-md border border-neutral-200/60 transition-colors duration-300 hover:border-[#FF4D6D]/45"
          >
            {isImageKitUrl(activeImage) ? (
              <IKImage
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:opacity-0 transition-opacity duration-200"
              />
            ) : (
              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover object-center group-hover:opacity-0 transition-opacity duration-200"
              />
            )}
            <div
              style={zoomStyle}
              className="absolute inset-0 bg-no-repeat bg-[length:200%_200%]"
            />
            {discountPercent > 0 && (
              <span className="absolute left-4 top-4 px-2.5 py-1 text-[10px] font-bold tracking-wider text-white bg-[#FF4D6D] uppercase z-10 rounded-md shadow-xs">
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

          {/* Thumbnails */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveImage(product.image)}
              className={`relative aspect-[4/5] w-16 bg-neutral-100 shrink-0 border-2 rounded-xs overflow-hidden cursor-pointer focus:outline-none ${
                activeImage === product.image ? "border-[#FF4D6D]" : "border-transparent"
              }`}
            >
              {isImageKitUrl(product.image) ? (
                <IKImage src={product.image} alt="Main view thumbnail" className="w-full h-full object-cover" />
              ) : (
                <img src={product.image} alt="Main view thumbnail" className="w-full h-full object-cover" />
              )}
            </button>
            {product.altImage && (
              <button
                onClick={() => setActiveImage(product.altImage)}
                className={`relative aspect-[4/5] w-16 bg-neutral-100 shrink-0 border-2 rounded-xs overflow-hidden cursor-pointer focus:outline-none ${
                  activeImage === product.altImage ? "border-[#FF4D6D]" : "border-transparent"
                }`}
              >
                {isImageKitUrl(product.altImage) ? (
                  <IKImage src={product.altImage} alt="Alternate view thumbnail" className="w-full h-full object-cover" />
                ) : (
                  <img src={product.altImage} alt="Alternate view thumbnail" className="w-full h-full object-cover" />
                )}
              </button>
            )}
            {product.images && product.images.map((imgUrl, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(imgUrl)}
                className={`relative aspect-[4/5] w-16 bg-neutral-100 shrink-0 border-2 rounded-xs overflow-hidden cursor-pointer focus:outline-none ${
                  activeImage === imgUrl ? "border-[#FF4D6D]" : "border-transparent"
                }`}
              >
                {isImageKitUrl(imgUrl) ? (
                  <IKImage src={imgUrl} alt={`Gallery view thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                ) : (
                  <img src={imgUrl} alt={`Gallery view thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        </div>


        {/* Product Information */}
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[11px] font-bold tracking-widest text-[#FF4D6D] uppercase">
              {product.category}
            </p>
            <h1 className="text-xl sm:text-2xl font-bold tracking-wide text-neutral-900 font-display">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-400 gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={13}
                    className={i < Math.floor(product.rating) ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                  />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-800">
                {product.rating} / 5.0
              </span>
              <span className="text-xs text-neutral-400 font-light">
                ({reviewsList.length} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-2 py-2 border-y border-neutral-100">
            <span className="text-xl sm:text-2xl font-bold text-neutral-900">
              ₹{product.price.toLocaleString("en-IN")}
            </span>
            {product.oldPrice > product.price && (
              <>
                <span className="text-sm text-neutral-400 line-through font-light">
                  ₹{product.oldPrice.toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold text-[#FF4D6D] tracking-wider uppercase bg-[#FF4D6D]/10 px-2 py-0.5">
                  Save ₹{(product.oldPrice - product.price).toLocaleString("en-IN")}
                </span>
              </>
            )}
          </div>

          <p className="text-xs text-neutral-600 leading-relaxed font-light">
            {product.description}
          </p>

          {/* Color selects */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-display">
                Color: <span className="text-neutral-900 font-semibold">{selectedColor}</span>
              </span>
              <div className="flex gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    style={{ backgroundColor: c.hex }}
                    className={`w-8 h-8 rounded-full border relative transition-transform hover:scale-105 focus:outline-none cursor-pointer ${
                      selectedColor === c.name ? "border-[#FF4D6D] ring-2 ring-[#FF4D6D]/45" : "border-neutral-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Size selects */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 font-display">
                Select Size: <span className="text-neutral-900 font-semibold">{selectedSize}</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`min-w-[44px] h-10 px-3 text-xs font-bold border rounded-xs transition-all cursor-pointer focus:outline-none ${
                      selectedSize === s
                        ? "bg-[#111111] border-[#111111] text-white"
                        : "bg-white border-neutral-200 text-neutral-700 hover:border-[#111111]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Qty & Add triggers */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-neutral-100">
            {/* Group Qty & Add to Bag on mobile, but keep flex items on sm */}
            <div className="flex flex-1 gap-2 sm:gap-4 min-w-0">
              {/* Qty Selector */}
              <div className="flex items-center justify-between border border-neutral-200 h-12 w-28 sm:w-32 px-3 shrink-0 rounded-xs bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-neutral-500 hover:text-black p-1 cursor-pointer focus:outline-none min-h-unset min-w-unset"
                >
                  <Minus size={14} />
                </button>
                <span className="text-xs font-bold text-neutral-800">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="text-neutral-500 hover:text-black p-1 cursor-pointer focus:outline-none min-h-unset min-w-unset"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                className="flex-grow sm:flex-1 h-12 bg-white hover:bg-[#111111] hover:text-white border border-[#111111] text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xs cursor-pointer focus:outline-none font-display min-h-unset min-w-unset"
              >
                <ShoppingBag size={16} />
                Add to Bag
              </button>
            </div>

            {/* Buy It Now */}
            <button
              onClick={handleBuyNow}
              className="w-full sm:flex-1 h-12 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xs cursor-pointer focus:outline-none font-display min-h-unset min-w-unset"
            >
              <CreditCard size={16} />
              Buy It Now
            </button>
          </div>

          {/* Wishlist button moved to image overlay */}

          {/* Accordion detail list */}
          <div className="pt-6 border-t border-neutral-100">
            <div className="flex overflow-x-auto border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-500 font-display">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 pr-4 sm:pr-6 border-b-2 cursor-pointer focus:outline-none shrink-0 ${
                  activeTab === "description" ? "border-[#FF4D6D] text-[#111111]" : "border-transparent"
                }`}
              >
                Product Details
              </button>
              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 px-4 sm:px-6 border-b-2 cursor-pointer focus:outline-none shrink-0 ${
                  activeTab === "shipping" ? "border-[#FF4D6D] text-[#111111]" : "border-transparent"
                }`}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="py-4 text-xs text-neutral-600 leading-relaxed font-light">
              {activeTab === "description" ? (
                <ul className="list-disc pl-4 space-y-1.5 font-sans">
                  {product.details?.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                  <li>Regular fit designed for daily comfortable wear.</li>
                  <li>Imported premium quality yarns.</li>
                </ul>
              ) : (
                <div className="space-y-3 font-sans">
                  <div className="flex items-start gap-2">
                    <Package size={14} className="text-[#FF4D6D] shrink-0 mt-0.5" />
                    <p><span className="font-semibold text-neutral-800">Standard Shipping:</span> Free across India on orders above ₹1,500. Takes 3-5 business days to deliver.</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <RefreshCcw size={14} className="text-[#FF4D6D] shrink-0 mt-0.5" />
                    <p><span className="font-semibold text-neutral-800">Return Policy:</span> Easy 15-day return and exchange on all unworn items with tags intact.</p>
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Customer Reviews block */}
      <section className="mt-16 md:mt-24 border-t border-neutral-100 pt-16">
        <h2 className="text-lg font-bold tracking-wide text-neutral-900 mb-8 uppercase font-display">
          Customer Reviews
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
          
          {/* Mock review forms */}
          <div className="bg-neutral-50 p-6 border border-neutral-200/60 rounded-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800">Write a Review</h3>
            <form onSubmit={handleReviewSubmit} className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">Your Name</label>
                <input
                  type="text"
                  required
                  value={newReviewName}
                  onChange={(e) => setNewReviewName(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-xs px-3 py-2 focus:outline-none focus:border-[#111111]"
                  placeholder="E.g., Sneha Sharma"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">Rating</label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-xs px-3 py-2 focus:outline-none focus:border-[#111111] font-semibold"
                >
                  <option value={5}>5 Stars (Excellent)</option>
                  <option value={4}>4 Stars (Very Good)</option>
                  <option value={3}>3 Stars (Average)</option>
                  <option value={2}>2 Stars (Poor)</option>
                  <option value={1}>1 Star (Very Bad)</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">Your Comments</label>
                <textarea
                  required
                  rows={4}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full bg-white border border-neutral-200 text-xs px-3 py-2 focus:outline-none focus:border-[#111111] font-light resize-none"
                  placeholder="Share your thoughts on product quality, fit, and styling..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
              >
                Post Review
              </button>
            </form>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {reviewsList.length > 0 ? (
              reviewsList.map((review, idx) => (
                <div key={idx} className="border-b border-neutral-100 pb-5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">{review.user}</span>
                    <span className="text-[10px] text-neutral-400 font-light">{review.date}</span>
                  </div>
                  <div className="flex items-center text-amber-400 gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        size={11}
                        className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-neutral-200"}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-neutral-600 font-light leading-relaxed">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12 bg-neutral-50 border border-dashed border-neutral-200 rounded-sm">
                <p className="text-xs text-neutral-500 font-light font-sans">No customer reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>

        </div>
      </section>

      {/* Related similar slider */}
      {similarProducts.length > 0 && (
        <section className="mt-16 md:mt-24 border-t border-neutral-100 pt-16">
          <h2 className="text-lg font-bold tracking-wide text-neutral-900 mb-8 uppercase font-display">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} navigate={navigate} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
