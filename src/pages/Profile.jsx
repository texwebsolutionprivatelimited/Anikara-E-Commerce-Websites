import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { 
  User, LogOut, Package, MapPin, Phone, Mail, ChevronRight, ChevronDown, ChevronUp, 
  PackageOpen, Check, Star, X, Truck, Heart, CreditCard, Gift, Bell, Settings, 
  HelpCircle, RefreshCw, Sparkles, Eye, ShieldCheck, ArrowRight, Award, MessageCircle, Copy
} from "lucide-react";
import ProductCard from "../components/ProductCard";

export default function Profile({ navigate }) {
  const { user, orders, logoutUser, updateProfile, addToast, addProductReview, products, addToCart } = useApp();
  const [phoneError, setPhoneError] = useState("");

  // Account Modal Drawer State
  const [activeModal, setActiveModal] = useState(null);

  // Review Modal State
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Reward points state
  const rewardPoints = 250;

  // Coupon copy handler
  const [copiedCoupon, setCopiedCoupon] = useState(null);
  const handleCopyCoupon = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(code);
    if (addToast) addToast(`Coupon code ${code} copied!`, "success");
    setTimeout(() => setCopiedCoupon(null), 2000);
  };

  const handleModalReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewingItem || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    const newReview = {
      user: user?.name || user?.email || "Verified Buyer",
      rating: parseInt(reviewRating),
      date: new Date().toISOString().split("T")[0],
      comment: reviewComment
    };

    const success = await addProductReview(reviewingItem.id, newReview);
    setIsSubmittingReview(false);

    if (success) {
      if (addToast) addToast("Review posted successfully! Thank you.", "success");
      setReviewingItem(null);
      setReviewComment("");
      setReviewRating(5);
    } else {
      if (addToast) addToast("Failed to post review. Please try again.", "error");
    }
  };

  // Sample default order matching user requirements if no real orders exist yet
  const defaultSampleOrder = {
    id: "ORD-2760-2026",
    date: "08 Aug 2026",
    total: 8092.80,
    status: "Delivered",
    paymentMethod: "UPI (Online Paid)",
    paymentStatus: "Verified",
    courierPartner: "Delhivery Express",
    trackingId: "DEL-74928103",
    address: user?.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.zip}` : "Ghar, Siwan - 462028",
    items: [
      {
        id: products?.[0]?.id || "p1",
        name: products?.[0]?.name || "White Printed Cotton Night Suit",
        image: products?.[0]?.images?.[0] || "/1.jpeg",
        price: products?.[0]?.price || 1499,
        quantity: 2,
        size: "M",
        color: "Powder Blue"
      },
      {
        id: products?.[1]?.id || "p2",
        name: products?.[1]?.name || "Floral Print Anarkali Co-ord Set",
        image: products?.[1]?.images?.[0] || "/2.jpeg",
        price: products?.[1]?.price || 2547,
        quantity: 2,
        size: "L",
        color: "Emerald Green"
      }
    ],
    trackingHistory: [
      { title: "Order Placed", timestamp: "08 Aug 2026, 10:15 AM", note: "Order verified & packed at warehouse." },
      { title: "Confirmed & Dispatched", timestamp: "08 Aug 2026, 02:30 PM", note: "Handed over to Delhivery Express." },
      { title: "Out for Delivery", timestamp: "09 Aug 2026, 09:00 AM", note: "Agent assigned for doorstep delivery." },
      { title: "Delivered", timestamp: "09 Aug 2026, 01:45 PM", note: "Delivered to recipient Aditi." }
    ]
  };

  const realUserOrders = orders.filter(
    (order) =>
      (order.userId && order.userId === user?.uid) ||
      (order.customerEmail && order.customerEmail.toLowerCase() === user?.email?.toLowerCase())
  ).sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  // If user has no orders, provide default sample order
  const displayOrders = realUserOrders.length > 0 ? realUserOrders : [defaultSampleOrder];

  const getExpectedDeliveryDate = (orderDateStr) => {
    if (!orderDateStr) return "Aug 12, 2026";
    try {
      if (orderDateStr.includes("Aug")) return "09 Aug 2026";
      const [year, month, day] = orderDateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 3);
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString("en-IN", options);
    } catch (e) {
      return orderDateStr;
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "Aditi");
  const [editPhone, setEditPhone] = useState(user?.phone || "9508558234");
  const [editStreet, setEditStreet] = useState(user?.address?.street || "Ghar");
  const [editCity, setEditCity] = useState(user?.address?.city || "Siwan");
  const [editState, setEditState] = useState(user?.address?.state || "Bihar");
  const [editZip, setEditZip] = useState(user?.address?.zip || "462028");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipStatus, setZipStatus] = useState(null);

  const handleProfileZipChange = async (val) => {
    setEditZip(val);
    if (val.trim().length === 6 && /^[1-9]\d{5}$/.test(val.trim())) {
      setZipLoading(true);
      setZipStatus(null);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val.trim()}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Block || po.Name;
          const detectedState = po.State;
          setEditCity((prev) => prev || detectedCity);
          setEditState((prev) => prev || detectedState);
          setZipStatus({
            valid: true,
            msg: `✓ Verified: ${detectedCity}, ${detectedState}`
          });
          if (addToast) addToast(`Verified Pincode: ${detectedCity}, ${detectedState}`, "success");
        } else {
          setZipStatus({ valid: true, msg: "✓ Valid 6-digit Indian Pincode" });
        }
      } catch (err) {
        setZipStatus({ valid: true, msg: "✓ Valid 6-digit Indian Pincode" });
      } finally {
        setZipLoading(false);
      }
    } else if (val.trim().length > 0 && val.trim().length < 6) {
      setZipStatus({ valid: false, msg: "Pincode must be 6 digits" });
    } else if (val.trim().length === 6 && !/^[1-9]\d{5}$/.test(val.trim())) {
      setZipStatus({ valid: false, msg: "Invalid 6-digit Indian Pincode format" });
    } else {
      setZipStatus(null);
    }
  };

  const [expandedOrder, setExpandedOrder] = useState("ORD-2760-2026");

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const getTrackingStepFromOrder = (order) => {
    if (order?.trackingStep) return order.trackingStep;
    if (order?.status === "Processing") return 1;
    if (order?.status === "Confirmed") return 2;
    if (order?.status === "Shipped") return 3;
    if (order?.status === "In Transit" || order?.status === "Out for Delivery") return 4;
    if (order?.status === "Delivered") return 5;
    return 5;
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setPhoneError("");
    const cleanPhone = (editPhone || "").replace(/\D/g, "");

    if (!editPhone || cleanPhone.length !== 10) {
      const errMsg = "Mobile number is required and must be exactly 10 digits.";
      setPhoneError(errMsg);
      if (addToast) addToast(errMsg, "error");
      return;
    }

    const updatedUser = {
      name: editName,
      email: user.email,
      phone: cleanPhone,
      address: {
        street: editStreet,
        city: editCity,
        state: editState,
        zip: editZip,
        country: "India"
      }
    };
    updateProfile(updatedUser);
    setIsEditing(false);
    if (addToast) addToast("Profile details updated successfully!", "success");
  };

  const handleLogout = () => {
    logoutUser();
    navigate("login");
  };

  const handleBuyAgain = (order, e) => {
    if (e) e.stopPropagation();
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart(item, item.quantity || 1, item.size || "M", item.color);
    });
    if (addToast) addToast(`Items from order ${order.id} added to cart!`, "success");
    navigate("cart");
  };

  // Products for Recently Viewed and Recommended
  const recentlyViewedProducts = (products || []).slice(0, 4);
  const recommendedProducts = (products || []).slice(4, 8);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="inline-flex p-4 rounded-full bg-neutral-50 text-neutral-400 mb-4 border border-neutral-100">
          <User size={32} />
        </div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-800 mb-2 font-display">
          Authentication Required
        </h2>
        <p className="text-xs text-neutral-500 max-w-xs mx-auto mb-8 font-light">
          Please log in to access your profile account settings and track your active orders.
        </p>
        <button
          onClick={() => navigate("login")}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none rounded-md"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Quick Account Menu items
  const accountMenuItems = [
    {
      id: "personal",
      title: "Personal Information",
      subtitle: "Name, email & phone details",
      icon: User,
      action: () => setIsEditing(true)
    },
    {
      id: "addresses",
      title: "Saved Addresses",
      subtitle: `${user?.address?.city ? `${user.address.city}, ${user.address.state}` : "Default shipping address"}`,
      icon: MapPin,
      action: () => setActiveModal("addresses")
    },
    {
      id: "wishlist",
      title: "Wishlist",
      subtitle: "Saved favorite outfits & styles",
      icon: Heart,
      action: () => navigate("wishlist")
    },
    {
      id: "payments",
      title: "Payment Methods",
      subtitle: "Saved UPI & Card details",
      icon: CreditCard,
      action: () => setActiveModal("payments")
    },
    {
      id: "orders",
      title: "My Orders",
      subtitle: "Track, return & re-order items",
      icon: Package,
      action: () => {
        const el = document.getElementById("order-history-section");
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "coupons",
      title: "Coupons & Offers",
      subtitle: "Active discount vouchers & codes",
      icon: Gift,
      action: () => setActiveModal("coupons")
    },
    {
      id: "notifications",
      title: "Notifications",
      subtitle: "Order updates & exclusive deals",
      icon: Bell,
      action: () => setActiveModal("notifications")
    },
    {
      id: "settings",
      title: "Settings",
      subtitle: "Password, privacy & notifications",
      icon: Settings,
      action: () => setActiveModal("settings")
    },
    {
      id: "help",
      title: "Help & Support",
      subtitle: "24/7 customer care & FAQs",
      icon: HelpCircle,
      action: () => setActiveModal("help")
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 font-sans pb-28 sm:pb-16 text-left">
      
      {/* Page Title & Breadcrumb Header */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3 sm:pb-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-wider text-neutral-900 uppercase font-display">
            My Profile
          </h1>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5 font-light">
            Manage your account preferences, orders, and addresses.
          </p>
        </div>

        {/* Anikara Rewards Balance Header Pill */}
        <button
          onClick={() => setActiveModal("rewards")}
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-amber-500/10 to-rose-500/10 border border-amber-200/80 rounded-full cursor-pointer hover:bg-amber-100/50 transition-colors"
        >
          <Award size={16} className="text-amber-600" />
          <div className="text-left leading-none">
            <span className="block text-[8.5px] font-bold uppercase tracking-wider text-amber-700 font-display">Anikara Rewards</span>
            <span className="block text-[11.5px] font-extrabold text-neutral-900 font-display">{rewardPoints} Points</span>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
        
        {/* Left Column: 1. Profile Card & 2. Account Quick Links */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* 1. Profile Card */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-5">
            
            {/* Header: Avatar, Name & Badges */}
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-[#FFF0F3] border border-[#FFD0D8] flex items-center justify-center text-[#FF4D6D] text-xl font-black uppercase font-display shadow-xs shrink-0">
                {(user.name || user.email || "A").charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-bold text-neutral-900 font-display truncate">
                  {user.name || "Aditi"}
                </h2>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="inline-flex items-center gap-1 text-[9.5px] font-extrabold tracking-wider text-[#FF4D6D] bg-[#FFF0F3] border border-[#FFCCD5] px-2.5 py-0.5 rounded-full uppercase font-display">
                    <Sparkles size={10} /> ANIKARA VIP MEMBER
                  </span>
                </div>
              </div>
            </div>

            {/* Edit Profile Form vs Info Display */}
            {isEditing ? (
              <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2 border-t border-neutral-100">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1 font-display">Full Name</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 focus:outline-none focus:border-[#111111]"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 font-display">
                      Mobile Phone <span className="text-[#FF4D6D]">*</span>
                    </label>
                    <span className={`text-[9.5px] font-bold ${editPhone.length === 10 ? "text-emerald-600" : "text-neutral-400"}`}>
                      {editPhone.length}/10 digits
                    </span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="Enter 10-digit mobile number"
                    value={editPhone}
                    onChange={(e) => {
                      const cleaned = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setEditPhone(cleaned);
                      setPhoneError("");
                    }}
                    className={`w-full text-xs bg-neutral-50 border rounded-lg py-2.5 px-3 focus:outline-none transition-all ${
                      phoneError ? "border-rose-500 bg-rose-50/50" : "border-neutral-200 focus:border-[#111111]"
                    }`}
                  />
                  {phoneError ? (
                    <p className="text-[10px] text-rose-600 font-bold mt-1">{phoneError}</p>
                  ) : (
                    <p className="text-[9.5px] text-neutral-400 mt-0.5">10-digit Indian mobile number required.</p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1 font-display">Street Address</label>
                  <input
                    type="text"
                    required
                    value={editStreet}
                    onChange={(e) => setEditStreet(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 focus:outline-none focus:border-[#111111]"
                    placeholder="Flat No., House Name, Street"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 font-display">Pincode / ZIP Code</label>
                    {zipLoading && <span className="text-[9px] text-[#FF4D6D] font-bold animate-pulse">Verifying...</span>}
                  </div>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={editZip}
                    onChange={(e) => handleProfileZipChange(e.target.value)}
                    className={`w-full text-xs bg-neutral-50 border rounded-lg py-2 px-3 focus:outline-none transition-all ${
                      zipStatus ? (zipStatus.valid ? "border-emerald-500 bg-emerald-50/30" : "border-rose-500 bg-rose-50/30") : "border-neutral-200 focus:border-[#111111]"
                    }`}
                    placeholder="Enter 6-digit Pincode (e.g. 462028)"
                  />
                  {zipStatus && (
                    <p className={`text-[9.5px] mt-1 font-bold ${zipStatus.valid ? "text-emerald-600" : "text-rose-600"}`}>
                      {zipStatus.msg}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1 font-display">City / District</label>
                    <input
                      type="text"
                      required
                      value={editCity}
                      onChange={(e) => setEditCity(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 focus:outline-none focus:border-[#111111]"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1 font-display">State</label>
                    <input
                      type="text"
                      required
                      value={editState}
                      onChange={(e) => setEditState(e.target.value)}
                      className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg py-2 px-3 focus:outline-none focus:border-[#111111]"
                      placeholder="State"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[10.5px] font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-xl"
                  >
                    Save Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); setPhoneError(""); }}
                    className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 text-[10.5px] font-bold tracking-widest uppercase transition-colors cursor-pointer rounded-xl"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-3.5 text-xs text-neutral-600 font-sans border-t border-neutral-100 pt-4">
                
                {/* Email line */}
                <div className="flex items-center gap-3 min-w-0 p-2.5 rounded-xl bg-neutral-50/70 border border-neutral-100">
                  <Mail size={16} className="text-[#FF4D6D] shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[9.5px] font-bold uppercase text-neutral-400 font-display">Email Address</span>
                    <span className="text-neutral-900 font-medium truncate block text-[11.5px]">{user.email || "asakdityasahu@gmail.com"}</span>
                  </div>
                </div>

                {/* Phone line */}
                <div className="flex items-center gap-3 min-w-0 p-2.5 rounded-xl bg-neutral-50/70 border border-neutral-100">
                  <Phone size={16} className="text-[#FF4D6D] shrink-0" />
                  <div className="min-w-0">
                    <span className="block text-[9.5px] font-bold uppercase text-neutral-400 font-display">Mobile Number</span>
                    <span className="text-neutral-900 font-semibold text-[11.5px]">{user.phone || "9508558234"}</span>
                  </div>
                </div>

                {/* Primary Shipping Address */}
                <div className="flex items-start gap-3 min-w-0 p-2.5 rounded-xl bg-neutral-50/70 border border-neutral-100">
                  <MapPin size={16} className="text-[#FF4D6D] shrink-0 mt-0.5" />
                  <div className="min-w-0">
                    <span className="block text-[9.5px] font-bold uppercase text-neutral-400 font-display">Primary Shipping Address</span>
                    <p className="text-neutral-900 font-medium text-[11.5px] leading-relaxed">
                      {user.address?.street ? `${user.address.street}, ${user.address.city} – ${user.address.zip}` : "Ghar, Siwan – 462028"}
                    </p>
                  </div>
                </div>

                {/* Profile Actions: EDIT PROFILE & Logout with explicit label & icon */}
                <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
                  <button
                    onClick={() => {
                      setEditName(user.name || "Aditi");
                      setEditPhone(user.phone || "9508558234");
                      setEditStreet(user.address?.street || "Ghar");
                      setEditCity(user.address?.city || "Siwan");
                      setEditState(user.address?.state || "Bihar");
                      setEditZip(user.address?.zip || "462028");
                      setIsEditing(true);
                    }}
                    className="flex-1 py-2.5 px-4 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[10.5px] font-bold tracking-widest uppercase transition-all duration-300 rounded-xl cursor-pointer shadow-xs active:scale-[0.98]"
                  >
                    Edit Profile
                  </button>

                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white border border-rose-200 text-[10.5px] font-bold tracking-wider uppercase transition-all duration-300 rounded-xl cursor-pointer active:scale-[0.98]"
                    title="Sign out of your account"
                    aria-label="Logout from Anikara"
                  >
                    <LogOut size={15} strokeWidth={2.2} />
                    <span>Logout</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* 2. Account Quick Links Section */}
          <div className="bg-white border border-neutral-200/80 rounded-2xl p-4 sm:p-5 shadow-xs">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 font-display mb-3 px-1">
              My Account Navigation
            </h3>
            
            <div className="divide-y divide-neutral-100">
              {accountMenuItems.map((item) => {
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-3 hover:bg-neutral-50/80 rounded-xl transition-all group text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="p-2 rounded-xl bg-neutral-50 text-neutral-600 group-hover:bg-[#FFF0F3] group-hover:text-[#FF4D6D] transition-colors shrink-0">
                        <ItemIcon size={17} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-neutral-800 font-display group-hover:text-[#111111]">
                          {item.title}
                        </h4>
                        <p className="text-[10px] text-neutral-400 font-light truncate">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-neutral-400 group-hover:text-neutral-800 group-hover:translate-x-0.5 transition-all shrink-0" />
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right Column: 3. Order History & Timeline, 4. Recently Viewed, 5. Recommended */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Order History Container */}
          <div id="order-history-section" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 font-display">
                <Package size={18} className="text-[#FF4D6D]" />
                Order History ({displayOrders.length})
              </h2>
              <span className="text-[10.5px] text-neutral-400 font-light">Showing recent orders</span>
            </div>

            <div className="space-y-4">
              {displayOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const activeStep = getTrackingStepFromOrder(order);

                return (
                  <div
                    key={order.id}
                    className="border border-neutral-200/80 rounded-2xl bg-white overflow-hidden shadow-xs transition-all hover:border-neutral-300"
                  >
                    {/* Order Summary Header Row */}
                    <div
                      onClick={() => toggleExpandOrder(order.id)}
                      className="p-4 sm:p-5 bg-neutral-50/40 hover:bg-neutral-50 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-neutral-900 font-display text-sm">
                            {order.id}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[9.5px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                              order.status === "Delivered"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-neutral-500 font-sans flex-wrap">
                          <span>Placed: <strong className="text-neutral-800 font-medium">{order.date}</strong></span>
                          <span>Total: <strong className="text-neutral-900 font-bold">₹{Number(order.total).toLocaleString("en-IN")}</strong></span>
                        </div>
                      </div>

                      {/* Header Actions: View Details + Buy Again */}
                      <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200/60">
                        <button
                          type="button"
                          onClick={(e) => handleBuyAgain(order, e)}
                          className="px-3 py-1.5 bg-neutral-900 hover:bg-[#FF4D6D] text-white text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                          title="Re-order these items"
                        >
                          <RefreshCw size={12} />
                          <span>Buy Again</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleExpandOrder(order.id);
                          }}
                          className="px-3 py-1.5 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-[10.5px] font-bold uppercase tracking-wider rounded-xl transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>{isExpanded ? "Hide Details" : "View Details →"}</span>
                          {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </div>

                    {/* Order Details & Timeline Drawer */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 space-y-6 bg-white animate-fade-in text-left">
                        
                        {/* 4. Order Status Timeline Component */}
                        <div className="bg-neutral-50/80 border border-neutral-200/70 p-4 sm:p-5 rounded-xl">
                          <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-neutral-500 font-display mb-4 flex items-center gap-1.5">
                            <Truck size={14} className="text-[#FF4D6D]" /> Order Status Timeline
                          </h4>

                          {/* Desktop & Mobile Responsive Step Timeline */}
                          <div className="relative flex items-center justify-between font-display text-[8px] sm:text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                            
                            {/* Step 1: Placed */}
                            <div className="flex flex-col items-center gap-1 z-10 text-center">
                              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${activeStep >= 1 ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"}`}>
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="text-neutral-900 font-semibold">Order Placed</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 sm:mx-2 -translate-y-3 ${activeStep >= 2 ? "bg-emerald-600" : "bg-neutral-200"}`} />

                            {/* Step 2: Confirmed */}
                            <div className="flex flex-col items-center gap-1 z-10 text-center">
                              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${activeStep >= 2 ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"}`}>
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="text-neutral-900 font-semibold">Confirmed</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 sm:mx-2 -translate-y-3 ${activeStep >= 3 ? "bg-emerald-600" : "bg-neutral-200"}`} />

                            {/* Step 3: Shipped */}
                            <div className="flex flex-col items-center gap-1 z-10 text-center">
                              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${activeStep >= 3 ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"}`}>
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="text-neutral-900 font-semibold">Shipped</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 sm:mx-2 -translate-y-3 ${activeStep >= 4 ? "bg-emerald-600" : "bg-neutral-200"}`} />

                            {/* Step 4: Out for Delivery */}
                            <div className="flex flex-col items-center gap-1 z-10 text-center">
                              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${activeStep >= 4 ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"}`}>
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="text-neutral-900 font-semibold">Out for Delivery</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 sm:mx-2 -translate-y-3 ${activeStep >= 5 ? "bg-emerald-600" : "bg-neutral-200"}`} />

                            {/* Step 5: Delivered */}
                            <div className="flex flex-col items-center gap-1 z-10 text-center">
                              <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold border transition-colors ${activeStep >= 5 ? "bg-emerald-600 border-emerald-600 text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"}`}>
                                <Check size={12} strokeWidth={3} />
                              </span>
                              <span className="text-emerald-700 font-extrabold">Delivered</span>
                            </div>

                          </div>
                        </div>

                        {/* Order Items List */}
                        <div className="space-y-4">
                          <h4 className="text-[10.5px] font-bold uppercase tracking-wider text-neutral-400 font-display">
                            Ordered Items ({order.items.length})
                          </h4>

                          <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100 py-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="py-3 flex items-center gap-3.5 text-xs font-sans text-neutral-600 min-w-0">
                                <button
                                  onClick={() => navigate("product-details", { productId: item.id })}
                                  className="w-14 aspect-[4/5] bg-neutral-50 border border-neutral-100 rounded-xl shrink-0 overflow-hidden cursor-pointer focus:outline-none"
                                >
                                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                </button>
                                
                                <div className="flex-1 min-w-0 text-left">
                                  <button
                                    onClick={() => navigate("product-details", { productId: item.id })}
                                    className="font-bold text-neutral-900 truncate leading-tight hover:text-[#FF4D6D] cursor-pointer focus:outline-none max-w-full block text-xs"
                                  >
                                    {item.name}
                                  </button>
                                  <p className="text-[10.5px] text-neutral-400 font-light mt-1">
                                    Size: <strong className="text-neutral-700 font-medium">{item.size}</strong> • Qty: <strong className="text-neutral-700 font-medium">{item.quantity}</strong> {item.color && `• Color: ${item.color}`}
                                  </p>
                                </div>

                                <div className="flex flex-col items-end gap-1.5 shrink-0">
                                  <span className="font-bold text-neutral-900 text-xs">
                                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setReviewingItem(item);
                                      setReviewRating(5);
                                      setReviewComment("");
                                    }}
                                    className="px-2.5 py-1 bg-neutral-900 hover:bg-[#FF4D6D] text-white text-[9px] font-extrabold tracking-wider uppercase rounded-lg transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                                  >
                                    <Star size={10} className="fill-amber-400 text-amber-400" />
                                    Write Review
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Shipment Courier Details & AWB */}
                        <div className="bg-neutral-900 text-white p-4 rounded-xl text-left space-y-3 font-sans shadow-xs">
                          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-800 pb-2.5">
                            <div className="flex items-center gap-2 text-xs font-bold font-display">
                              <Truck size={15} className="text-[#FF4D6D]" />
                              <span>Courier Partner: <strong className="text-white">{order.courierPartner || "Delhivery Express"}</strong></span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[10.5px] bg-neutral-800 px-3 py-1 rounded-lg border border-neutral-700 font-mono text-neutral-300">
                              <span>AWB: {order.trackingId || "DEL-74928103"}</span>
                            </div>
                          </div>

                          {order.trackingHistory && order.trackingHistory.length > 0 && (
                            <div className="space-y-2 pt-1">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 font-display">Tracking Logs</p>
                              <div className="space-y-2 border-l-2 border-[#FF4D6D]/60 pl-3">
                                {order.trackingHistory.map((log, lIdx) => (
                                  <div key={lIdx} className="text-[11px] leading-snug">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                      <span>{log.title}</span>
                                      <span className="text-[9.5px] text-neutral-400 font-normal">({log.timestamp})</span>
                                    </div>
                                    <p className="text-[10px] text-neutral-300 font-light mt-0.5">{log.note}</p>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Recently Viewed Products */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 font-display">
                <Eye size={18} className="text-[#FF4D6D]" />
                Recently Viewed
              </h3>
              <button
                onClick={() => navigate("products")}
                className="text-xs font-bold text-[#FF4D6D] hover:underline uppercase tracking-wider font-display"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {recentlyViewedProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          </div>

          {/* 6. You May Also Like / Recommended For You */}
          <div className="space-y-4 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 font-display">
                <Sparkles size={18} className="text-[#FF4D6D]" />
                You May Also Like
              </h3>
              <span className="text-[10.5px] text-neutral-400 font-light">Curated for your style</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Account Modals (Addresses, Payments, Coupons, Notifications, Settings, Help, Rewards) */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl space-y-4 relative font-sans text-left border border-neutral-100 max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Saved Addresses Modal */}
            {activeModal === "addresses" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <MapPin className="text-[#FF4D6D]" size={20} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Saved Delivery Addresses</h3>
                    <p className="text-xs text-neutral-500">Manage your shipping destinations</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-emerald-500/80 bg-emerald-50/30 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md font-display">
                        Default Address
                      </span>
                      <button onClick={() => { setActiveModal(null); setIsEditing(true); }} className="text-xs font-bold text-[#FF4D6D]">
                        Edit
                      </button>
                    </div>
                    <p className="font-bold text-xs text-neutral-900">{user.name || "Aditi"}</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {user.address?.street ? `${user.address.street}, ${user.address.city}, ${user.address.state} - ${user.address.zip}` : "Ghar, Siwan - 462028"}
                    </p>
                    <p className="text-xs text-neutral-500 font-mono pt-1">Phone: {user.phone || "9508558234"}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setActiveModal(null); setIsEditing(true); }}
                  className="w-full py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                >
                  + Add New Address
                </button>
              </div>
            )}

            {/* Payment Methods Modal */}
            {activeModal === "payments" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <CreditCard className="text-[#FF4D6D]" size={20} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Saved Payment Methods</h3>
                    <p className="text-xs text-neutral-500">Fast checkout with secure payment options</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-neutral-200 font-bold text-xs">UPI</div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Google Pay / PhonePe UPI</p>
                        <p className="text-[11px] text-neutral-500 font-mono">asakdityasahu@upi</p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">Verified</span>
                  </div>

                  <div className="p-3.5 rounded-xl border border-neutral-200 flex items-center justify-between bg-neutral-50">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-white border border-neutral-200 font-bold text-xs">CARD</div>
                      <div>
                        <p className="text-xs font-bold text-neutral-900">HDFC Platinum Credit Card</p>
                        <p className="text-[11px] text-neutral-500 font-mono">•••• •••• •••• 4921</p>
                      </div>
                    </div>
                    <span className="text-[9.5px] font-bold uppercase text-neutral-500 bg-neutral-200 px-2 py-0.5 rounded-md">Saved</span>
                  </div>
                </div>
              </div>
            )}

            {/* Coupons & Offers Modal */}
            {activeModal === "coupons" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Gift className="text-[#FF4D6D]" size={20} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Active Coupons & Offers</h3>
                    <p className="text-xs text-neutral-500">Apply these promo codes at checkout for discounts</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-xl border border-rose-200 bg-gradient-to-r from-rose-50 to-amber-50 flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-[#FF4D6D] font-display">Special Offer</span>
                      <p className="font-bold text-sm text-neutral-900 font-display">ANIFEST500</p>
                      <p className="text-xs text-neutral-600">Flat ₹500 OFF on orders above ₹1,500</p>
                    </div>
                    <button
                      onClick={() => handleCopyCoupon("ANIFEST500")}
                      className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1"
                    >
                      <Copy size={12} />
                      {copiedCoupon === "ANIFEST500" ? "Copied!" : "Copy"}
                    </button>
                  </div>

                  <div className="p-4 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <span className="text-[9.5px] font-extrabold uppercase tracking-wider text-amber-600 font-display">VIP Member Coupon</span>
                      <p className="font-bold text-sm text-neutral-900 font-display">ANIKARAVIP</p>
                      <p className="text-xs text-neutral-600">Extra 15% OFF on all Luxury Collections</p>
                    </div>
                    <button
                      onClick={() => handleCopyCoupon("ANIKARAVIP")}
                      className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-lg uppercase tracking-wider flex items-center gap-1"
                    >
                      <Copy size={12} />
                      {copiedCoupon === "ANIKARAVIP" ? "Copied!" : "Copy"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Modal */}
            {activeModal === "notifications" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Bell className="text-[#FF4D6D]" size={20} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Account Notifications</h3>
                    <p className="text-xs text-neutral-500">Recent order & offer updates</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                    <p className="text-xs font-bold text-neutral-900">📦 Order Delivered Successfully</p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      Your order ORD-2760-2026 was delivered to your shipping address.
                    </p>
                    <span className="text-[9.5px] text-neutral-400 font-mono">Today, 01:45 PM</span>
                  </div>

                  <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                    <p className="text-xs font-bold text-neutral-900">🎁 250 Reward Points Credited</p>
                    <p className="text-[11px] text-neutral-600 leading-relaxed">
                      You earned 250 Anikara Reward Points on your recent order.
                    </p>
                    <span className="text-[9.5px] text-neutral-400 font-mono">Yesterday</span>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Modal */}
            {activeModal === "settings" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Settings className="text-[#FF4D6D]" size={20} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Account Settings</h3>
                    <p className="text-xs text-neutral-500">Security & notification preferences</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <p className="font-bold text-neutral-900">WhatsApp Order Tracking</p>
                      <p className="text-[11px] text-neutral-500">Receive live delivery updates on WhatsApp</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#FF4D6D] h-4 w-4" />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 border border-neutral-100">
                    <div>
                      <p className="font-bold text-neutral-900">Promotional Emails</p>
                      <p className="text-[11px] text-neutral-500">Get notified about flash sales & new arrivals</p>
                    </div>
                    <input type="checkbox" defaultChecked className="accent-[#FF4D6D] h-4 w-4" />
                  </div>
                </div>
              </div>
            )}

            {/* Help & Support Modal */}
            {activeModal === "help" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <HelpCircle className="text-[#FF4D6D]" size={20} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Help & Customer Support</h3>
                    <p className="text-xs text-neutral-500">We're here 24/7 to assist you</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <a
                    href="https://wa.me/919508558234"
                    target="_blank"
                    rel="noreferrer"
                    className="p-3.5 rounded-xl border border-emerald-200 bg-emerald-50 flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <MessageCircle className="text-emerald-600" size={20} />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">Chat on WhatsApp</p>
                        <p className="text-[11px] text-neutral-600">+91 9508558234 (Instant Support)</p>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                  </a>

                  <div className="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50">
                    <p className="text-xs font-bold text-neutral-900 mb-1">Email Support</p>
                    <p className="text-[11px] text-neutral-600">support@anikara.com • 24 hour response time</p>
                  </div>
                </div>
              </div>
            )}

            {/* Anikara Rewards Modal */}
            {activeModal === "rewards" && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
                  <Award className="text-amber-500" size={22} />
                  <div>
                    <h3 className="text-base font-bold text-neutral-900 font-display">Anikara Rewards Club</h3>
                    <p className="text-xs text-neutral-500">Your points & VIP tier benefits</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white space-y-2 shadow-md">
                  <span className="text-[10px] font-extrabold uppercase tracking-widest bg-white/20 px-2.5 py-0.5 rounded-full font-display">
                    VIP Tier Balance
                  </span>
                  <div className="text-3xl font-black font-display">{rewardPoints} Points</div>
                  <p className="text-xs font-light opacity-90">1 Point = ₹1 Discount on future orders</p>
                </div>

                <div className="space-y-2 text-xs">
                  <h4 className="font-bold text-neutral-900 font-display">Redeem Points</h4>
                  <div className="p-3 rounded-xl border border-neutral-200 bg-neutral-50 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-neutral-900">₹200 OFF Coupon</p>
                      <p className="text-[11px] text-neutral-500">Redeem 200 Points</p>
                    </div>
                    <button
                      onClick={() => {
                        if (addToast) addToast("Redeemed 200 Points for ₹200 Voucher!", "success");
                        setActiveModal(null);
                      }}
                      className="px-3 py-1.5 bg-[#111111] text-white text-xs font-bold rounded-lg uppercase tracking-wider"
                    >
                      Redeem
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Review Modal */}
      {reviewingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4 relative font-sans text-left border border-neutral-100">
            <button
              onClick={() => setReviewingItem(null)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-black cursor-pointer p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3.5 border-b border-neutral-100 pb-4">
              <img
                src={reviewingItem.image}
                alt={reviewingItem.name}
                className="w-13 h-15 object-cover rounded-lg border border-neutral-100 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#FF4D6D] font-display">
                  Verified Buyer Review
                </span>
                <h3 className="text-sm font-bold text-neutral-900 truncate font-display">{reviewingItem.name}</h3>
                <p className="text-[11px] text-neutral-400">Size {reviewingItem.size} • ₹{reviewingItem.price?.toLocaleString("en-IN")}</p>
              </div>
            </div>

            <form onSubmit={handleModalReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">
                  Overall Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-1 focus:outline-none cursor-pointer hover:scale-110 transition-transform"
                    >
                      <Star
                        size={26}
                        className={star <= reviewRating ? "text-amber-400 fill-amber-400" : "text-neutral-200"}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-neutral-700 ml-2 font-display">
                    {reviewRating} / 5 Stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">
                  Your Detailed Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience regarding material quality, fit, color accuracy, and styling..."
                  className="w-full bg-neutral-50 border border-neutral-200 text-xs p-3.5 rounded-xl focus:outline-none focus:border-[#FF4D6D] focus:bg-white font-light leading-relaxed resize-none transition-all"
                />
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  disabled={isSubmittingReview}
                  className="flex-1 py-3 bg-[#111111] hover:bg-[#FF4D6D] active:scale-[0.98] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 rounded-xl cursor-pointer shadow-md focus:outline-none disabled:opacity-50"
                >
                  {isSubmittingReview ? "Submitting Review..." : "Submit Review"}
                </button>
                <button
                  type="button"
                  onClick={() => setReviewingItem(null)}
                  className="px-4 py-3 border border-neutral-200 text-neutral-600 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
