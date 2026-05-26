import React from "react";
import { useApp } from "../context/AppContext";
import { Heart, Trash2, ShoppingCart, ChevronRight } from "lucide-react";

export default function Wishlist({ navigate }) {
  const { wishlist, toggleWishlist, moveToCart } = useApp();

  if (wishlist.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="inline-flex p-4 rounded-full bg-neutral-50 text-neutral-400 mb-4 border border-neutral-100">
          <Heart size={32} />
        </div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-800 mb-2">
          Your Wishlist is Empty
        </h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-8 font-light">
          Tap the heart button on products to save them to your wishlist. They will show up here.
        </p>
        <button
          onClick={() => navigate("products")}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
        >
          Discover Products
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Breadcrumbs */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] sm:text-xs text-neutral-400 font-medium tracking-wide uppercase mb-8">
        <button onClick={() => navigate("home")} className="hover:text-black cursor-pointer focus:outline-none">Home</button>
        <ChevronRight size={10} />
        <span className="text-[#FF4D6D] font-bold">My Wishlist</span>
      </div>

      <h1 className="text-xl md:text-2xl font-bold tracking-wider text-neutral-900 uppercase mb-8 font-display">
        My Wishlist ({wishlist.length})
      </h1>

      {/* Wishlist Grid */}
      <div className="grid grid-cols-[repeat(auto-fit,minmax(150px,1fr))] sm:grid-cols-3 lg:grid-cols-4 gap-x-3 sm:gap-x-4 gap-y-6 sm:gap-y-8">
        {wishlist.map((product) => {
          const discountPercent = product.oldPrice
            ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
            : 0;

          return (
            <div key={product.id} className="group relative flex flex-col w-full bg-white overflow-hidden border border-neutral-100 rounded-sm">
              
              {/* Product Image */}
              <div className="relative aspect-[3/4] w-full bg-neutral-100 overflow-hidden">
                <button
                  onClick={() => navigate("product-details", { productId: product.id })}
                  className="absolute inset-0 z-10 cursor-pointer focus:outline-none"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </button>

                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(product)}
                  className="absolute right-3 top-3 z-20 p-2 rounded-full bg-white/95 shadow-xs text-neutral-400 hover:text-red-500 transition-colors focus:outline-none cursor-pointer"
                  title="Remove from Wishlist"
                >
                  <Trash2 size={14} />
                </button>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute left-3 top-3 z-20 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white bg-[#FF4D6D] uppercase">
                    {discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Product Info */}
              <div className="p-3 sm:p-4 flex-grow flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-neutral-400 tracking-wider uppercase mb-1 block">
                    {product.category}
                  </span>
                  
                  <button
                    onClick={() => navigate("product-details", { productId: product.id })}
                    className="text-left hover:text-[#FF4D6D] transition-colors mb-1 block cursor-pointer focus:outline-none"
                  >
                    <h3 className="text-xs font-semibold text-neutral-900 tracking-tight line-clamp-2 sm:line-clamp-1">
                      {product.name}
                    </h3>
                  </button>

                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 mb-3">
                    <span className="text-xs font-bold text-neutral-900">
                      ₹{product.price.toLocaleString("en-IN")}
                    </span>
                    {product.oldPrice && product.oldPrice > product.price && (
                      <span className="text-[10px] text-neutral-400 line-through font-light">
                        ₹{product.oldPrice.toLocaleString("en-IN")}
                      </span>
                    )}
                  </div>
                </div>

                {/* Move to Cart */}
                <button
                  onClick={() => moveToCart(product, "M")}
                  className="w-full py-2 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[10px] font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-1.5 cursor-pointer focus:outline-none"
                >
                  <ShoppingCart size={12} />
                  Move to Bag
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
