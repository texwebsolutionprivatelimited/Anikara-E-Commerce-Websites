import React, { useState, useEffect, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Flame, Zap, Moon, Shirt, Link2, Gem, Layers, Clock, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const HOT_CATEGORY_ICONS = [Moon, Shirt, Link2, Gem, Layers];

export default function Navbar({ currentPage, navigate, currentParams = {} }) {
  const { cart, wishlist, user, settings, products = [], categories = [] } = useApp();

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const mobileSearchInputRef = useRef(null);
  const searchInputRef = useRef(null);
  const searchWrapperRef = useRef(null);

  // Persistent Recent Searches State
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const saved = localStorage.getItem("anikara_recent_searches");
      return saved ? JSON.parse(saved) : ["Party Dress", "Co-Ords", "Night Suit", "Denim"];
    } catch (e) {
      return ["Party Dress", "Co-Ords", "Night Suit", "Denim"];
    }
  });

  const saveRecentSearch = (term) => {
    if (!term || !term.trim()) return;
    const cleanTerm = term.trim();
    setRecentSearches((prev) => {
      const updated = [cleanTerm, ...prev.filter((t) => t.toLowerCase() !== cleanTerm.toLowerCase())].slice(0, 5);
      try {
        localStorage.setItem("anikara_recent_searches", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("anikara_recent_searches");
    } catch (e) {}
  };

  const removeRecentSearch = (termToRemove) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((t) => t !== termToRemove);
      try {
        localStorage.setItem("anikara_recent_searches", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

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
      saveRecentSearch(searchQuery.trim());
      navigate("products", { searchQuery: searchQuery.trim() });
      setIsSearchFocused(false);
      setIsMobileSearchOpen(false);
    }
  };

  const handleSearchTagClick = (term) => {
    saveRecentSearch(term);
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

  const handleProductPreviewClick = (productId) => {
    navigate("product-details", { productId });
    setIsSearchFocused(false);
    setIsMobileSearchOpen(false);
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);
  const liveCategories = categories.filter(Boolean);
  
  const trendingSearches = Array.from(
    new Set([
      "Party Dress",
      "Silk Co-Ords",
      "Nightwear",
      "Denim Jackets",
      "Cotton Tops",
      "Ethnic Suits"
    ])
  ).slice(0, 6);

  const hotCategories = liveCategories.slice(0, 5).map((category, index) => ({
    icon: HOT_CATEGORY_ICONS[index % HOT_CATEGORY_ICONS.length],
    label: category,
    value: category
  }));

  // Amazon-style Product Live Search Filter
  const matchingProducts = searchQuery.trim()
    ? products.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products.slice(0, 4);

  const rawAdminEmails =
    import.meta.env.VITE_ADMIN_EMAILS ||
    import.meta.env.VITE_ADMIN_EMAIL ||
    settings?.adminEmail ||
    "";
  const adminEmails = String(rawAdminEmails)
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);
  const userEmail = (user?.email || "").toLowerCase().trim();
  const isAdminUser = !!userEmail && adminEmails.includes(userEmail);

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
              className="absolute inset-x-0 top-0 bg-white z-50 p-4 shadow-xl border-b border-neutral-200 lg:hidden flex flex-col gap-3 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center gap-3">
                <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
                  <Search size={16} className="absolute left-3 text-neutral-400 pointer-events-none" />
                  <input
                    ref={mobileSearchInputRef}
                    type="text"
                    placeholder="Search dresses, night suits, co-ords…"
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
              </div>

              {/* Mobile Search Popover Sections */}
              <div className="space-y-4 pt-2">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between text-[10px] font-bold tracking-wider uppercase text-neutral-400 mb-2">
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#FF4D6D]" /> Recent Searches</span>
                      <button onClick={clearRecentSearches} className="text-neutral-400 hover:text-red-500 font-semibold cursor-pointer">Clear</button>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleSearchTagClick(term)}
                          className="text-xs text-neutral-700 bg-neutral-100 px-3 py-1 rounded-full flex items-center gap-1 hover:bg-[#FF4D6D] hover:text-white"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending */}
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                    <Flame size={12} className="text-[#FF4D6D]" /> Trending Searches
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleSearchTagClick(term)}
                        className="text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-[#FF4D6D] hover:text-white px-3 py-1 rounded-full"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Products Preview */}
                <div>
                  <p className="text-[10px] font-bold tracking-wider uppercase text-neutral-400 mb-2 flex items-center gap-1.5">
                    <ShoppingBag size={12} className="text-[#FF4D6D]" /> Product Previews
                  </p>
                  <div className="space-y-2">
                    {matchingProducts.slice(0, 3).map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleProductPreviewClick(p.id)}
                        className="flex items-center gap-3 p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 cursor-pointer border border-neutral-100"
                      >
                        <img src={p.image || p.imageUrl || "/1.jpeg"} alt={p.name} className="w-10 h-10 object-cover rounded-md shrink-0" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-semibold text-neutral-900 truncate">{p.name}</h4>
                          <span className="text-[9px] uppercase font-bold text-[#FF4D6D]">{p.category}</span>
                        </div>
                        <span className="text-xs font-bold text-neutral-900">₹{p.price?.toLocaleString("en-IN")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative max-w-[1720px] mx-auto px-3 sm:px-6 lg:px-8 h-[68px] sm:h-[72px] md:h-[80px] flex items-center justify-between gap-2">
          
          {/* Mobile Hamburger + Search Trigger (44px - 48px touch targets, tight spacing) */}
          <div className="flex items-center gap-0 sm:gap-0.5 lg:hidden shrink-0 z-20">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-100/80 active:scale-95 rounded-full focus:outline-none cursor-pointer transition-all"
              aria-label="Open Mobile Menu"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className="w-11 h-11 flex items-center justify-center text-neutral-700 hover:text-black hover:bg-neutral-100/80 active:scale-95 rounded-full focus:outline-none cursor-pointer transition-all"
              aria-label="Open Mobile Search"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.8} />
            </button>
          </div>

          {/* Brand Logo (10-15% size increase for mobile branding) */}
          <div className="flex-1 lg:flex-none flex justify-center lg:justify-start min-w-0 px-1 z-10">
            <button
              onClick={() => navigate("home")}
              className="hover:opacity-90 transition-opacity cursor-pointer focus:outline-none py-1 flex items-center justify-center max-w-full"
            >
              <img
                src="/logo.png"
                alt={`${settings?.businessName || "Anikara"} Logo`}
                className="h-7.5 min-[360px]:h-9 min-[400px]:h-10.5 sm:h-11 md:h-13 max-w-[125px] min-[360px]:max-w-[145px] min-[400px]:max-w-none w-auto object-contain shrink"
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white border border-neutral-100 shadow-2xl z-50 rounded-xl overflow-hidden"
                    style={{ width: '700px' }}
                  >
                    {/* Header strip */}
                    <div className="px-5 py-3 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-neutral-400 font-display">Shop by Category</span>
                      <button
                        onClick={() => { navigate("products"); setIsDropdownOpen(false); }}
                        className="text-[10px] font-bold tracking-widest uppercase text-[#FF4D6D] hover:opacity-70 transition-opacity cursor-pointer focus:outline-none min-h-unset min-w-unset"
                      >
                        View All →
                      </button>
                    </div>

                    {/* Realtime categories from Firestore */}
                    <div className="grid grid-cols-2 gap-2 p-5 sm:grid-cols-3 md:grid-cols-4">
                      {liveCategories.length > 0 ? (
                        liveCategories.map((category) => (
                          <button
                            key={category}
                            onClick={() => {
                              navigate("products", { category });
                              setIsDropdownOpen(false);
                            }}
                            className="block text-left text-xs font-medium text-neutral-700 hover:text-[#FF4D6D] transition-colors cursor-pointer focus:outline-none leading-relaxed w-full min-h-unset min-w-unset py-1"
                          >
                            {category}
                          </button>
                        ))
                      ) : (
                        <p className="col-span-full text-xs text-neutral-400">No categories found.</p>
                      )}
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

          {/* Action Icons + Persistent Amazon-Style Search Bar */}
          <div className="flex items-center gap-1 min-[360px]:gap-1.5 sm:gap-3 xl:gap-4 shrink-0">

            {/* Persistent Visible Search Bar (desktop only) */}
            <div ref={searchWrapperRef} className="relative hidden lg:flex items-center">
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <Search size={15} className="absolute left-3.5 text-neutral-400 pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search dresses, co-ords, nightwear…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  className="w-[240px] xl:w-[320px] h-10 text-xs bg-neutral-50 border border-neutral-200 rounded-full pl-9 pr-8 focus:outline-none focus:border-[#FF4D6D] focus:bg-white transition-all duration-300 font-sans placeholder:text-neutral-400"
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

              {/* Amazon-Style Search Modal Dropdown */}
              <AnimatePresence>
                {isSearchFocused && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full left-0 mt-2 bg-white border border-neutral-100 shadow-[0_15px_40px_rgba(0,0,0,0.18)] z-50 rounded-2xl overflow-hidden divide-y divide-neutral-100 max-h-[80vh] overflow-y-auto scrollbar-hide"
                    style={{ width: "440px" }}
                  >
                    {/* 1. Recent Searches */}
                    {recentSearches.length > 0 && (
                      <div className="px-4 py-3.5 bg-neutral-50/50">
                        <div className="flex items-center justify-between text-[10px] font-extrabold tracking-widest uppercase text-neutral-400 mb-2.5">
                          <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#FF4D6D]" /> Recent Searches</span>
                          <button onClick={clearRecentSearches} className="text-neutral-400 hover:text-red-500 font-semibold cursor-pointer transition-colors">Clear All</button>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {recentSearches.map((term) => (
                            <span
                              key={term}
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-neutral-200 text-xs text-neutral-800 hover:border-[#FF4D6D] hover:text-[#FF4D6D] cursor-pointer transition-all shadow-xs"
                            >
                              <span onClick={() => handleSearchTagClick(term)}>{term}</span>
                              <X size={11} className="text-neutral-400 hover:text-red-500 cursor-pointer ml-0.5" onClick={(e) => { e.stopPropagation(); removeRecentSearch(term); }} />
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Trending Searches */}
                    <div className="px-4 py-3.5">
                      <p className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400 mb-2.5 flex items-center gap-1.5">
                        <Flame size={12} className="text-[#FF4D6D]" /> Trending Searches
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {trendingSearches.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => handleSearchTagClick(term)}
                            className="text-xs font-medium text-neutral-700 bg-neutral-100 hover:bg-[#FF4D6D] hover:text-white px-3 py-1 rounded-full transition-all cursor-pointer focus:outline-none"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. Popular Categories */}
                    <div className="px-4 py-3.5">
                      <p className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400 mb-2.5 flex items-center gap-1.5">
                        <Zap size={12} className="text-[#FF4D6D]" /> Popular Categories
                      </p>
                      <div className="grid grid-cols-5 gap-1.5">
                        {hotCategories.map((cat) => (
                          <button
                            key={cat.value}
                            type="button"
                            onClick={() => handleHotCategoryClick(cat.value)}
                            className="flex flex-col items-center justify-center text-center text-[10px] font-medium text-neutral-700 hover:text-[#FF4D6D] py-2 px-1 rounded-lg hover:bg-neutral-50 border border-transparent hover:border-neutral-200/80 transition-all cursor-pointer focus:outline-none gap-1"
                          >
                            <cat.icon size={16} strokeWidth={1.8} />
                            <span className="leading-tight">{cat.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 4. Products Preview (Amazon Style) */}
                    <div className="px-4 py-3.5 bg-neutral-50/30">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[10px] font-extrabold tracking-widest uppercase text-neutral-400 flex items-center gap-1.5">
                          <ShoppingBag size={12} className="text-[#FF4D6D]" /> Matching Products Preview
                        </p>
                        <button
                          onClick={() => { navigate("products", { searchQuery }); setIsSearchFocused(false); }}
                          className="text-[10px] font-bold text-[#FF4D6D] hover:underline uppercase flex items-center gap-1"
                        >
                          View All ({matchingProducts.length}) <ArrowRight size={11} />
                        </button>
                      </div>

                      {matchingProducts.length > 0 ? (
                        <div className="space-y-2">
                          {matchingProducts.slice(0, 4).map((product) => (
                            <div
                              key={product.id}
                              onClick={() => handleProductPreviewClick(product.id)}
                              className="group flex items-center gap-3 p-2 rounded-xl bg-white border border-neutral-100 hover:border-[#FF4D6D]/30 hover:shadow-md transition-all cursor-pointer"
                            >
                              <img
                                src={product.image || product.imageUrl || "/1.jpeg"}
                                alt={product.name}
                                className="w-12 h-12 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300 shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-neutral-900 truncate group-hover:text-[#FF4D6D] transition-colors">
                                  {product.name}
                                </h4>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-[9px] font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                                    {product.category || "Apparel"}
                                  </span>
                                  {product.originalPrice > product.price && (
                                    <span className="text-[9px] text-emerald-600 font-bold">
                                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <span className="text-xs font-black text-[#111111] font-display block">
                                  ₹{(product.price || 0).toLocaleString("en-IN")}
                                </span>
                                {product.originalPrice > product.price && (
                                  <span className="text-[10px] text-neutral-400 line-through">
                                    ₹{product.originalPrice.toLocaleString("en-IN")}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="py-4 text-center text-xs text-neutral-400">
                          No products found matching "{searchQuery}".
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => navigate("wishlist")}
              className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer focus:outline-none hover:bg-neutral-100/80 lg:hover:bg-transparent lg:w-auto lg:h-auto lg:p-1.5 ${
                currentPage === "wishlist" ? "text-[#FF4D6D]" : "text-neutral-700 hover:text-[#FF4D6D]"
              }`}
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={1.8} />
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#FF4D6D] text-white text-[8.5px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white lg:top-0 lg:right-0 lg:translate-x-1/3 lg:-translate-y-1/3 animate-pulse">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => navigate("cart")}
              className={`relative w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer focus:outline-none hover:bg-neutral-100/80 lg:hover:bg-transparent lg:w-auto lg:h-auto lg:p-1.5 ${
                currentPage === "cart" ? "text-[#FF4D6D]" : "text-neutral-700 hover:text-[#FF4D6D]"
              }`}
              aria-label="View Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={1.8} />
              {totalCartItems > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#111111] text-white text-[8.5px] font-bold h-4 w-4 rounded-full flex items-center justify-center border border-white lg:top-0 lg:right-0 lg:translate-x-1/3 lg:-translate-y-1/3">
                  {totalCartItems}
                </span>
              )}
            </button>

            {/* Profile Button */}
            <button
              onClick={() => navigate(user ? "profile" : "login")}
              className={`w-11 h-11 flex items-center justify-center rounded-full transition-all active:scale-95 cursor-pointer focus:outline-none hover:bg-neutral-100/80 lg:hover:bg-transparent lg:w-auto lg:h-auto lg:p-1.5 ${
                currentPage === "profile" || currentPage === "login" ? "text-[#FF4D6D]" : "text-neutral-700 hover:text-[#FF4D6D]"
              }`}
              aria-label="View Profile"
            >
              <User className="w-5 h-5 sm:w-[20px] sm:h-[20px]" strokeWidth={1.8} />
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
                  <div className="grid grid-cols-1 min-[380px]:grid-cols-2 gap-x-4 gap-y-1 pl-1 sm:pl-2">
                    {liveCategories.length > 0 ? (
                      liveCategories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            navigate("products", { category });
                            setIsMobileMenuOpen(false);
                          }}
                          className="text-left text-xs font-medium text-neutral-600 hover:text-[#FF4D6D] py-1 cursor-pointer focus:outline-none min-h-unset min-w-unset"
                        >
                          {category}
                        </button>
                      ))
                    ) : (
                      <p className="text-xs text-neutral-400">No categories found.</p>
                    )}
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
                    <span>Hello, {(user.name || user.email || "User").split(" ")[0]}</span>
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
