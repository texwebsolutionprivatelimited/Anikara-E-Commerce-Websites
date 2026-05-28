import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Flame, Zap, Moon, Shirt, Link2, Gem, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_GROUPS = [
  {
    heading: "Sleep & Lounge",
    items: [
      { label: "Night Suit", value: "Night Suit" },
      { label: "Lounge Suit", value: "Lounge Suit" },
      { label: "Lingerie", value: "Lingerie" },
    ]
  },
  {
    heading: "Western Wear",
    items: [
      { label: "Dress", value: "Dress" },
      { label: "Top & Blouse", value: "Top & Blouse" },
      { label: "T-Shirt", value: "T-Shirt" },
      { label: "Co-ords", value: "Co-ords" },
    ]
  },
  {
    heading: "Ethnic & Formal",
    items: [
      { label: "Ethnic Wear", value: "Ethnic Wear" },
      { label: "Suit", value: "Suit" },
    ]
  },
  {
    heading: "Bottoms & Basics",
    items: [
      { label: "Bottom Wear", value: "Bottom Wear" },
      { label: "Denim", value: "Denim" },
    ]
  }
];
const TRENDING_SEARCHES = [
  "Night Suit", "Silk Dress", "Co-ords", "Ethnic Wear", "Summer Sale", "Lounge Set", "Denim", "Top & Blouse"
];

const HOT_CATEGORIES = [
  { icon: Moon, label: "Sleep", value: "Night Suit" },
  { icon: Shirt, label: "Dresses", value: "Dress" },
  { icon: Link2, label: "Co-ords", value: "Co-ords" },
  { icon: Gem, label: "Ethnic", value: "Ethnic Wear" },
  { icon: Layers, label: "Denim", value: "Denim" },
];

export default function Navbar({ currentPage, navigate, currentParams = {} }) {
  const { cart, wishlist, user, settings } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Autofocus mobile search input when overlay opens
  useEffect(() => {
    if (isMobileSearchOpen && mobileSearchInputRef.current) {
      mobileSearchInputRef.current.focus();
    }
  }, [isMobileSearchOpen]);

  // Scroll handler for floating shadow effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Update query state if search param in navigation changes
  useEffect(() => {
    if (currentPage === "products" && currentParams.searchQuery) {
      setSearchQuery(currentParams.searchQuery);
    }
  }, [currentPage, currentParams]);

  // Click-outside to close search dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Submission
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate("products", { searchQuery: searchQuery.trim() });
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
      setSearchQuery("");
    }
  };

  const handleTrendingClick = (term) => {
    navigate("products", { searchQuery: term });
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery("");
  };

  const handleHotCategoryClick = (val) => {
    navigate("products", { category: val });
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
    setSearchQuery("");
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-[32px] md:top-[36px] z-45 transition-all duration-300 font-display ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-[0_2px_15px_rgba(0,0,0,0.03)] border-b border-neutral-100"
            : "bg-white border-b border-neutral-100"
        }`}
      >
        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {isMobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-white z-50 flex items-center px-4 gap-3 lg:hidden"
            >
              <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center gap-2">
                <Search size={16} className="absolute left-3 text-neutral-400 pointer-events-none" />
                <input
                  ref={mobileSearchInputRef}
                  type="text"
                  placeholder="Search dresses, night suits…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 text-xs bg-neutral-50 border border-neutral-200 rounded-full pl-9 pr-8 focus:outline-none focus:border-[#FF4D6D] focus:bg-white transition-all duration-200 font-sans"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-neutral-400 hover:text-neutral-600 focus:outline-none cursor-pointer p-1"
                  >
                    <X size={12} />
                  </button>
                )}
              </form>
              <button
                onClick={() => {
                  setIsMobileSearchOpen(false);
                  setSearchQuery("");
                }}
                className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black focus:outline-none shrink-0"
              >
                Cancel
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-[72px] md:h-[80px] flex items-center justify-between gap-2">
          
          {/* Mobile Hamburger Trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-neutral-700 hover:text-black p-0.5 min-[360px]:p-1.5 focus:outline-none"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-[20px] h-[20px] sm:w-[24px] sm:h-[24px]" strokeWidth={1.8} />
            </button>
          </div>

          {/* Brand Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 lg:relative lg:left-auto lg:translate-x-0 flex justify-center lg:justify-start min-w-0 z-10">
            <button
              onClick={() => navigate("home")}
              className="hover:opacity-90 transition-opacity cursor-pointer focus:outline-none py-1 flex items-center"
            >
              <img
                src="/logo.png"
                alt={`${settings?.businessName || "Anikara"} Logo`}
                className="h-8 min-[360px]:h-9 sm:h-10 md:h-12 w-auto object-contain"
              />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-10 font-sans">
            <button
              onClick={() => navigate("home")}
              className={`text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer focus:outline-none ${
                currentPage === "home" ? "text-[#FF4D6D]" : "text-neutral-800 hover:text-[#FF4D6D]"
              }`}
            >
              Home
            </button>
            
            {/* Mega Menu Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setIsDropdownOpen(true)}
              onMouseLeave={() => setIsDropdownOpen(false)}
            >
              <button
                className="text-xs font-semibold tracking-wider text-neutral-800 hover:text-[#FF4D6D] uppercase flex items-center gap-1 focus:outline-none transition-colors cursor-pointer"
              >
                Categories
                <ChevronDown size={14} strokeWidth={2} className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-neutral-100 shadow-2xl z-50"
                    style={{ width: '520px' }}
                  >
                    {/* Header strip */}
                    <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400 font-display">Shop by Category</span>
                      <button
                        onClick={() => { navigate("products"); setIsDropdownOpen(false); }}
                        className="text-[10px] font-bold tracking-widest uppercase text-[#FF4D6D] hover:opacity-70 transition-opacity cursor-pointer focus:outline-none"
                      >
                        View All →
                      </button>
                    </div>

                    {/* Grid of grouped columns */}
                    <div className="grid grid-cols-4 gap-0 p-5">
                      {CATEGORY_GROUPS.map((group) => (
                        <div key={group.heading} className="space-y-2">
                          <p className="text-[9px] font-bold tracking-[0.18em] uppercase text-[#FF4D6D] mb-3 font-display">
                            {group.heading}
                          </p>
                          {group.items.map((item) => (
                            <button
                              key={item.value}
                              onClick={() => {
                                navigate("products", { category: item.value });
                                setIsDropdownOpen(false);
                              }}
                              className="block text-left text-xs font-medium text-neutral-700 hover:text-[#FF4D6D] transition-colors cursor-pointer focus:outline-none leading-relaxed w-full"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* Bottom CTA banner */}
                    <div
                      className="mx-5 mb-5 px-4 py-3 bg-neutral-50 border border-neutral-100 flex items-center justify-between cursor-pointer hover:bg-neutral-100 transition-colors"
                      onClick={() => { navigate("products", { badge: "Sale" }); setIsDropdownOpen(false); }}
                    >
                      <span className="text-xs font-bold text-neutral-800 font-display tracking-wide flex items-center gap-1.5"><Flame size={13} className="text-[#FF4D6D]" /> Sale — Up to 50% Off</span>
                      <span className="text-[10px] font-bold text-[#FF4D6D] tracking-widest uppercase">Shop Now →</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => navigate("products")}
              className={`text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer focus:outline-none ${
                currentPage === "products" && !currentParams.category && !currentParams.badge ? "text-[#FF4D6D]" : "text-neutral-800 hover:text-[#FF4D6D]"
              }`}
            >
              Shop All
            </button>
            
            <button
              onClick={() => navigate("products", { badge: "Sale" })}
              className={`text-xs font-semibold tracking-wider uppercase transition-colors cursor-pointer focus:outline-none ${
                currentPage === "products" && currentParams.badge === "Sale" ? "text-[#FF4D6D]" : "text-neutral-800 hover:text-[#FF4D6D]"
              }`}
            >
              Offers
            </button>
          </nav>

          {/* Action Icons + Persistent Search Bar */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-3 xl:gap-4 shrink-0">

            {/* Persistent Visible Search Bar (desktop only) */}
            <div ref={searchWrapperRef} className="relative hidden lg:flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search size={15} className="absolute left-3 text-neutral-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search dresses, night suits…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-[220px] xl:w-[280px] h-10 text-sm bg-neutral-50 border border-neutral-200 rounded-full pl-9 pr-8 focus:outline-none focus:border-[#FF4D6D] focus:bg-white transition-all duration-300 font-sans placeholder:text-neutral-400"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 text-neutral-400 hover:text-neutral-600 cursor-pointer focus:outline-none"
                  >
                    <X size={12} />
                  </button>
                )}
              </form>

              {/* Trending Searches Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-neutral-100 shadow-2xl z-50 rounded-md overflow-hidden"
                    style={{ width: "320px" }}
                  >
                    {/* Trending */}
                    <div className="px-4 pt-4 pb-2">
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3 flex items-center gap-1.5">
                        <Flame size={11} className="text-[#FF4D6D]" /> Trending Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {TRENDING_SEARCHES.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleTrendingClick(term)}
                            className="text-[10px] font-medium text-neutral-700 bg-neutral-100 hover:bg-[#FF4D6D] hover:text-white px-3 py-1.5 rounded-full transition-colors cursor-pointer focus:outline-none"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-neutral-100 mx-4 my-2" />

                    {/* Hot Categories */}
                    <div className="px-4 pb-4">
                      <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3 flex items-center gap-1.5">
                        <Zap size={11} className="text-[#FF4D6D]" /> Hot Categories
                      </p>
                      <div className="grid grid-cols-5 gap-1">
                        {HOT_CATEGORIES.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleHotCategoryClick(cat.value)}
                            className="flex flex-col items-center justify-center text-center text-[10px] font-medium text-neutral-700 hover:text-[#FF4D6D] py-2 px-1 rounded-md hover:bg-neutral-50 transition-colors cursor-pointer focus:outline-none gap-1"
                          >
                            <cat.icon size={15} strokeWidth={1.8} />
                            <span className="leading-tight">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Search Trigger */}
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="p-1 min-[360px]:p-1.5 text-neutral-700 hover:text-[#FF4D6D] lg:hidden transition-colors cursor-pointer focus:outline-none"
              aria-label="Open Mobile Search"
            >
              <Search className="w-[18px] h-[18px]" strokeWidth={1.8} />
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate("wishlist")}
              className={`relative p-1 min-[360px]:p-1.5 transition-colors cursor-pointer focus:outline-none ${
                currentPage === "wishlist" ? "text-[#FF4D6D]" : "text-neutral-700 hover:text-[#FF4D6D]"
              }`}
              aria-label="View Wishlist"
            >
              <Heart className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-[#FF4D6D] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white transform translate-x-1/3 -translate-y-1/3 animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate("cart")}
              className={`relative p-1 min-[360px]:p-1.5 transition-colors cursor-pointer focus:outline-none ${
                currentPage === "cart" ? "text-[#FF4D6D]" : "text-neutral-700 hover:text-[#FF4D6D]"
              }`}
              aria-label="View Cart"
            >
              <ShoppingBag className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" strokeWidth={1.8} />
              {totalCartItems > 0 && (
                <span className="absolute top-0 right-0 bg-[#111111] text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white transform translate-x-1/3 -translate-y-1/3">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate(user ? "profile" : "login")}
              className={`p-1 min-[360px]:p-1.5 transition-colors cursor-pointer focus:outline-none hidden sm:block ${
                currentPage === "profile" || currentPage === "login" ? "text-[#FF4D6D]" : "text-neutral-700 hover:text-[#FF4D6D]"
              }`}
              aria-label="View Profile"
            >
              <User className="w-[18px] h-[18px] sm:w-[20px] sm:h-[20px]" strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-50"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 h-dvh max-h-dvh w-[min(20rem,100vw)] bg-white z-50 flex flex-col p-5 sm:p-6 shadow-2xl overflow-y-auto overscroll-contain [touch-action:pan-y] [-webkit-overflow-scrolling:touch]"
            >
              <div className="flex items-center justify-between pb-6 border-b border-neutral-100">
                <button
                  onClick={() => {
                    navigate("home");
                    setIsMobileMenuOpen(false);
                  }}
                  className="hover:opacity-90 transition-opacity cursor-pointer focus:outline-none flex items-center"
                >
                  <img
                    src="/logo.png"
                    alt={`${settings?.businessName || "Anikara"} Logo`}
                    className="h-9 w-auto object-contain"
                  />
                </button>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-neutral-500 hover:text-black focus:outline-none"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mt-6">
                <input
                  type="text"
                  placeholder="Search collection..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-2.5 pl-3 pr-10 focus:outline-none focus:border-[#111111] font-sans"
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black focus:outline-none"
                >
                  <Search size={16} />
                </button>
              </form>

              {/* Mobile Navigation Links */}
              <nav className="mt-8 flex shrink-0 flex-col space-y-4 font-sans text-sm font-semibold tracking-wide text-neutral-800">
                <button
                  onClick={() => {
                    navigate("home");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-[#FF4D6D] py-1 border-b border-neutral-50 cursor-pointer focus:outline-none"
                >
                  Home
                </button>
                <button
                  onClick={() => {
                    navigate("products");
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-[#FF4D6D] py-1 border-b border-neutral-50 cursor-pointer focus:outline-none"
                >
                  Shop All
                </button>
                <button
                  onClick={() => {
                    navigate("products", { badge: "Sale" });
                    setIsMobileMenuOpen(false);
                  }}
                  className="text-left hover:text-[#FF4D6D] py-1 border-b border-neutral-50 cursor-pointer focus:outline-none"
                >
                  Special Offers
                </button>

                {/* Categories Submenu in Drawer */}
                <div className="pt-2">
                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-3">
                    Shop Categories
                  </p>
                  <div className="space-y-4 pl-1 sm:pl-2">
                    {CATEGORY_GROUPS.map((group) => (
                      <div key={group.heading}>
                        <p className="text-[9px] font-bold tracking-widest uppercase text-[#FF4D6D] mb-2">{group.heading}</p>
                        <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-x-4 gap-y-1">
                          {group.items.map((item) => (
                            <button
                              key={item.value}
                              onClick={() => {
                                navigate("products", { category: item.value });
                                setIsMobileMenuOpen(false);
                              }}
                              className="text-left text-xs font-medium text-neutral-600 hover:text-[#FF4D6D] py-1 cursor-pointer focus:outline-none"
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </nav>

              {/* User Account Quick Link */}
              <div className="shrink-0 mt-8 pt-6 border-t border-neutral-100 font-sans">
                {user ? (
                  <button
                    onClick={() => {
                      navigate("profile");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-sm font-semibold text-neutral-800 hover:text-[#FF4D6D] cursor-pointer focus:outline-none"
                  >
                    <User size={18} />
                    <span>Hello, {user.name.split(" ")[0]}</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      navigate("login");
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 text-sm font-semibold text-neutral-800 hover:text-[#FF4D6D] cursor-pointer focus:outline-none"
                  >
                    <User size={18} />
                    <span>Login / Register</span>
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
