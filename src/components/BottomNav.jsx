import React, { useState, useEffect } from "react";
import { Home, Grid, Heart, ShoppingBag, User } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function BottomNav({ currentPage, navigate }) {
  const { cart, wishlist } = useApp();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const cartCount = cart.reduce((total, item) => total + (item.quantity || 1), 0);
  const wishlistCount = wishlist.length;

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "products", label: "Categories", icon: Grid },
    { id: "wishlist", label: "Wishlist", icon: Heart, badge: wishlistCount },
    { id: "cart", label: "Cart", icon: ShoppingBag, badge: cartCount },
    { id: "profile", label: "Profile", icon: User },
  ];

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 md:hidden transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-2 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))] flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id || (item.id === "products" && currentPage === "products");

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 min-w-[56px] min-h-[48px] rounded-xl transition-all duration-200 cursor-pointer focus:outline-none ${
                isActive ? "text-[#FF4D6D]" : "text-neutral-500 hover:text-neutral-900"
              }`}
              aria-label={item.label}
            >
              {/* Active top line pill indicator */}
              {isActive && (
                <span className="absolute top-0 w-8 h-0.5 bg-[#FF4D6D] rounded-full shadow-[0_2px_8px_rgba(255,77,109,0.5)]" />
              )}

              <div className="relative flex items-center justify-center">
                <Icon size={20} className={isActive ? "stroke-[2.5]" : "stroke-[1.8]"} />
                {item.badge !== undefined && item.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2.5 bg-[#FF4D6D] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-xs border border-white">
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                ) : null}
              </div>

              <span className={`text-[10px] tracking-tight mt-0.5 font-sans ${isActive ? "font-bold" : "font-medium"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
