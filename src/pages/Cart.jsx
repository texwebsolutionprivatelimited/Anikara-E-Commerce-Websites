import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Trash2, Heart, Plus, Minus, Ticket, ChevronRight, ShoppingBag } from "lucide-react";

export default function Cart({ navigate }) {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    toggleWishlist,
    promoDiscount,
    applyCoupon,
    removeCoupon,
    addToast
  } = useApp();

  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponInput.trim()) {
      applyCoupon(couponInput);
    }
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = promoDiscount
    ? Math.round((subtotal * promoDiscount.discountPercent) / 100)
    : 0;

  const shipping = subtotal > 1500 || subtotal === 0 ? 0 : 150;
  const tax = Math.round((subtotal - discountAmount) * 0.05); // 5% GST/tax estimation
  const total = subtotal - discountAmount + shipping + tax;

  const handleSaveForLater = (item) => {
    toggleWishlist({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      sizes: ["S", "M", "L", "XL"]
    });
    removeFromCart(item.cartItemId);
    addToast(`Moved ${item.name} to Wishlist`, "success");
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="inline-flex p-4 rounded-full bg-neutral-50 text-neutral-400 mb-4 border border-neutral-100">
          <ShoppingBag size={32} />
        </div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-800 mb-2">
          Your Bag is Empty
        </h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-8 font-light">
          Looks like you haven't added anything to your cart yet. Discover our premium silhouettes and shop.
        </p>
        <button
          onClick={() => navigate("products")}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
        >
          Shop Now
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 font-medium tracking-wide uppercase mb-8 px-4 sm:px-0">
        <button onClick={() => navigate("home")} className="hover:text-black cursor-pointer focus:outline-none">Home</button>
        <ChevronRight size={10} />
        <span className="text-[#FF4D6D] font-bold">Shopping Bag</span>
      </div>

      <h1 className="text-xl md:text-2xl font-bold tracking-wider text-neutral-900 uppercase mb-8 font-display px-4 sm:px-0">
        Your Shopping Bag ({cart.length})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-start">
        
        {/* Left List */}
        <div className="lg:col-span-2 space-y-4 px-4 sm:px-0">
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              className="flex gap-3 sm:gap-4 p-3 sm:p-4 border border-neutral-200/60 rounded-xs bg-white"
            >
              <button
                onClick={() => navigate("product-details", { productId: item.id })}
                className="w-20 sm:w-24 aspect-[4/5] bg-neutral-50 shrink-0 overflow-hidden relative cursor-pointer focus:outline-none"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover object-center"
                />
              </button>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="flex flex-col min-[420px]:flex-row min-[420px]:justify-between min-[420px]:items-start gap-1.5 min-[420px]:gap-2">
                    <button
                      onClick={() => navigate("product-details", { productId: item.id })}
                      className="hover:text-[#FF4D6D] text-left transition-colors cursor-pointer focus:outline-none"
                    >
                      <h3 className="text-xs sm:text-sm font-semibold text-neutral-900 leading-tight line-clamp-2">
                        {item.name}
                      </h3>
                    </button>
                    <span className="text-xs sm:text-sm font-bold text-neutral-900 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-neutral-400 font-medium tracking-wider uppercase mt-1">
                    <span>Size: <strong className="text-neutral-700">{item.size}</strong></span>
                    {item.color !== "Default" && (
                      <span>Color: <strong className="text-neutral-700">{item.color}</strong></span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4 mt-4 pt-3 border-t border-neutral-100">
                  <div className="flex items-center justify-between border border-neutral-200 h-9 w-24 px-2 rounded-xs bg-neutral-50">
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity - 1)}
                      className="text-neutral-400 hover:text-black p-0.5 cursor-pointer focus:outline-none"
                    >
                      <Minus size={12} />
                    </button>
                    <span className="text-xs font-bold text-neutral-700">{item.quantity}</span>
                    <button
                      onClick={() => updateCartQuantity(item.cartItemId, item.quantity + 1)}
                      className="text-neutral-400 hover:text-black p-0.5 cursor-pointer focus:outline-none"
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleSaveForLater(item)}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-neutral-400 hover:text-[#FF4D6D] transition-colors cursor-pointer focus:outline-none"
                      title="Save for Later"
                    >
                      <Heart size={14} />
                      <span className="hidden sm:inline">Save</span>
                    </button>
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-semibold text-neutral-400 hover:text-red-500 transition-colors cursor-pointer focus:outline-none"
                      title="Remove Item"
                    >
                      <Trash2 size={14} />
                      <span className="hidden sm:inline">Remove</span>
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* Right Summary */}
        <div className="space-y-6">
          <div className="bg-white border-y border-neutral-200/60 sm:border sm:rounded-xs p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-1.5 font-display">
              <Ticket size={16} className="text-[#FF4D6D]" />
              Apply Promo Code
            </h3>
            
            {promoDiscount ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 px-3 py-2 text-emerald-800 text-xs">
                <span>Code <strong>{promoDiscount.code}</strong> Applied</span>
                <button
                  onClick={removeCoupon}
                  className="font-bold underline text-[10px] hover:text-emerald-950 cursor-pointer focus:outline-none"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="E.g., ANIKARA20"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-grow min-w-0 bg-white border border-neutral-200 text-xs px-3 py-2.5 focus:outline-none focus:border-[#111111] uppercase font-light"
                />
                <button
                  type="submit"
                  className="bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 transition-colors shrink-0 cursor-pointer focus:outline-none"
                >
                  Apply
                </button>
              </form>
            )}
            
            <p className="text-[10px] text-neutral-400 font-light leading-normal">
              * Try using **ANIKARA20** (20% off) or **WELCOME10** (10% off) to apply dynamic discounts.
            </p>
          </div>

          <div className="bg-neutral-50 border-y border-neutral-200/60 sm:border sm:rounded-xs p-6 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-3 font-display">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span className="font-light">Subtotal</span>
                <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              
              {promoDiscount && (
                <div className="flex justify-between text-emerald-700">
                  <span className="font-light">Promo Discount ({promoDiscount.discountPercent}%)</span>
                  <span className="font-bold">- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span className="font-light">Estimated Delivery</span>
                {shipping === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">Free</span>
                ) : (
                  <span className="font-bold text-neutral-900">₹{shipping}</span>
                )}
              </div>

              <div className="flex justify-between">
                <span className="font-light">Estimated GST (5%)</span>
                <span className="font-bold text-neutral-900">₹{tax}</span>
              </div>

              <div className="flex justify-between border-t border-neutral-200 pt-3 text-sm font-bold text-neutral-900">
                <span className="font-display uppercase tracking-wider">Grand Total</span>
                <span className="text-base font-display">₹{total.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <button
              onClick={() => navigate("checkout")}
              className="w-full h-12 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 rounded-xs mt-6 cursor-pointer focus:outline-none font-display"
            >
              Proceed to Checkout
            </button>

            <div className="text-center">
              <button
                onClick={() => navigate("products")}
                className="text-[10px] text-neutral-400 hover:text-black font-semibold underline tracking-wider uppercase cursor-pointer focus:outline-none"
              >
                Continue Shopping
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
