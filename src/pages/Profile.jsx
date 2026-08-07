import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { User, LogOut, Package, MapPin, Phone, Mail, ChevronDown, ChevronUp, PackageOpen, Check, Star, X } from "lucide-react";

export default function Profile({ navigate }) {
  const { user, orders, logoutUser, updateProfile, addToast, addProductReview } = useApp();
  const [phoneError, setPhoneError] = useState("");

  // Review Modal State
  const [reviewingItem, setReviewingItem] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

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

  const userOrders = orders
    .filter(
      (order) =>
        (order.userId && order.userId === user?.uid) ||
        (order.customerEmail && order.customerEmail.toLowerCase() === user?.email?.toLowerCase())
    )
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));

  const getExpectedDeliveryDate = (orderDateStr) => {
    if (!orderDateStr) return "";
    try {
      const [year, month, day] = orderDateStr.split("-").map(Number);
      const date = new Date(year, month - 1, day);
      date.setDate(date.getDate() + 4);
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString("en-IN", options);
    } catch (e) {
      return orderDateStr;
    }
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editPhone, setEditPhone] = useState(user?.phone || "");
  const [editStreet, setEditStreet] = useState(user?.address?.street || "");
  const [editCity, setEditCity] = useState(user?.address?.city || "");
  const [editState, setEditState] = useState(user?.address?.state || "");
  const [editZip, setEditZip] = useState(user?.address?.zip || "");
  const [zipLoading, setZipLoading] = useState(false);
  const [zipStatus, setZipStatus] = useState(null);

  const handleProfileZipChange = async (val) => {
    setEditZip(val);
    if (val.trim().length === 6 && /^\d{6}$/.test(val.trim())) {
      setZipLoading(true);
      setZipStatus(null);
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${val.trim()}`);
        const data = await res.json();
        if (data && data[0] && data[0].Status === "Success" && data[0].PostOffice?.length > 0) {
          const po = data[0].PostOffice[0];
          const detectedCity = po.District || po.Block || po.Name;
          const detectedState = po.State;
          setEditCity(detectedCity);
          setEditState(detectedState);
          setZipStatus({
            valid: true,
            msg: `✓ Verified: ${detectedCity}, ${detectedState}`
          });
          if (addToast) addToast(`Verified Pincode: ${detectedCity}, ${detectedState}`, "success");
        } else {
          setZipStatus({ valid: false, msg: "Invalid 6-digit Indian Pincode" });
        }
      } catch (err) {
        setZipStatus({ valid: true, msg: "Format verified (6 digits)" });
      } finally {
        setZipLoading(false);
      }
    } else {
      setZipStatus(null);
    }
  };

  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleExpandOrder = (orderId) => {
    setExpandedOrder((prev) => (prev === orderId ? null : orderId));
  };

  const getTrackingStepFromOrder = (order) => {
    if (order?.trackingStep) return order.trackingStep;
    if (order?.status === "Processing") return 1;
    if (order?.status === "Shipped") return 2;
    if (order?.status === "In Transit" || order?.status === "Out for Delivery") return 3;
    if (order?.status === "Delivered") return 4;
    return 1;
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    setPhoneError("");

    const cleanPhone = (editPhone || "").replace(/\D/g, "");

    // Enforce 10-digit mobile number rule
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
  };

  const handleLogout = () => {
    logoutUser();
    navigate("login");
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center font-sans">
        <div className="inline-flex p-4 rounded-full bg-neutral-50 text-neutral-400 mb-4 border border-neutral-100">
          <User size={32} />
        </div>
        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-800 mb-2">
          Authentication Required
        </h2>
        <p className="text-xs text-neutral-400 max-w-xs mx-auto mb-8 font-light">
          Please log in to access your profile account settings and track your active orders.
        </p>
        <button
          onClick={() => navigate("login")}
          className="inline-flex items-center justify-center px-8 py-3.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans">
      <h1 className="text-xl md:text-2xl font-bold tracking-wider text-neutral-900 uppercase mb-8 font-display border-b border-neutral-100 pb-4">
        My Profile
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-start">
        
        {/* User details */}
        <div className="bg-white border border-neutral-200/60 p-6 rounded-xs space-y-6">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-14 w-14 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-600 border border-neutral-200 text-xl font-bold uppercase">
              {(user.name || user.email || "U").charAt(0)}
            </div>
            <div className="min-w-0">
              <h2 className="text-sm font-bold text-neutral-955 font-display">{user.name || user.email || "User"}</h2>
              <p className="text-[11px] text-[#FF4D6D] font-bold tracking-wider uppercase">Vip Member</p>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#111111]"
                />
              </div>

              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="block text-[9px] font-bold uppercase text-neutral-400">
                    Mobile Phone <span className="text-[#FF4D6D]">*</span>
                  </label>
                  <span className={`text-[9px] font-bold ${editPhone.length === 10 ? "text-emerald-600" : "text-neutral-400"}`}>
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
                  className={`w-full text-xs bg-neutral-50 border rounded-md py-2.5 px-3 focus:outline-none transition-all ${
                    phoneError ? "border-rose-500 bg-rose-50/50" : "border-neutral-200 focus:border-[#111111]"
                  }`}
                />
                {phoneError ? (
                  <p className="text-[10px] text-rose-600 font-bold mt-1">{phoneError}</p>
                ) : (
                  <p className="text-[9.5px] text-neutral-400 mt-0.5">10-digit Indian mobile number required to save profile.</p>
                )}
              </div>

              <div>
                <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">Street Address</label>
                <input
                  type="text"
                  required
                  value={editStreet}
                  onChange={(e) => setEditStreet(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#111111]"
                  placeholder="Flat No., House Name, Street"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-[9px] font-bold uppercase text-neutral-400">Pincode / ZIP Code</label>
                  {zipLoading && <span className="text-[9px] text-[#FF4D6D] font-bold animate-pulse">Verifying...</span>}
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={editZip}
                  onChange={(e) => handleProfileZipChange(e.target.value)}
                  className={`w-full text-xs bg-neutral-50 border rounded-md py-2 px-3 focus:outline-none transition-all ${
                    zipStatus ? (zipStatus.valid ? "border-emerald-500 bg-emerald-50/30" : "border-rose-500 bg-rose-50/30") : "border-neutral-200 focus:border-[#111111]"
                  }`}
                  placeholder="Enter 6-digit Pincode (e.g. 400054)"
                />
                {zipStatus && (
                  <p className={`text-[9.5px] mt-1 font-bold ${zipStatus.valid ? "text-emerald-600" : "text-rose-600"}`}>
                    {zipStatus.msg}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">City / District</label>
                  <input
                    type="text"
                    required
                    value={editCity}
                    onChange={(e) => setEditCity(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#111111]"
                    placeholder="Auto-detected City"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-bold uppercase text-neutral-400 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={editState}
                    onChange={(e) => setEditState(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-2 px-3 focus:outline-none focus:border-[#111111]"
                    placeholder="Auto-detected State"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none rounded-md"
                >
                  Save Profile
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); setPhoneError(""); }}
                  className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none rounded-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4 text-xs font-light text-neutral-600 font-sans">
              {/* Mandatory Mobile Alert Banner if phone is missing or not 10 digits */}
              {(!user.phone || user.phone.replace(/\D/g, "").length !== 10) && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] font-medium space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-amber-900">
                    ⚠️ Mobile Number Required
                  </p>
                  <p className="text-[10.5px] leading-relaxed text-amber-800">
                    Please update your profile with a valid 10-digit mobile number to complete your profile.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 min-w-0">
                <Mail size={15} className="text-neutral-400" />
                <span className="min-w-0 break-all">{user.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={15} className="text-neutral-400" />
                <span className={user.phone && user.phone.replace(/\D/g, "").length === 10 ? "text-neutral-900 font-medium" : "text-rose-600 font-bold"}>
                  {user.phone && user.phone.replace(/\D/g, "").length === 10 ? user.phone : "Not provided (10 digits required)"}
                </span>
              </div>
              <div className="flex items-start gap-3">
                <MapPin size={15} className="text-neutral-400 mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold text-neutral-800 mb-0.5">Primary Shipping Address:</p>
                  {user.address?.street ? (
                    <p className="leading-relaxed">
                      {user.address.street}, {user.address.city}, {user.address.state} - {user.address.zip}
                    </p>
                  ) : (
                    <p className="text-neutral-400 italic">No address added yet.</p>
                  )}
                </div>
              </div>

              <div className="flex gap-2 pt-4 border-t border-neutral-100">
                <button
                  onClick={() => {
                    setEditName(user.name);
                    setEditPhone(user.phone);
                    setEditStreet(user.address?.street || "");
                    setEditCity(user.address?.city || "");
                    setEditState(user.address?.state || "");
                    setEditZip(user.address?.zip || "");
                    setIsEditing(true);
                  }}
                  className="flex-1 py-2.5 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-[10px] font-bold tracking-widest uppercase transition-colors cursor-pointer focus:outline-none"
                >
                  Edit Profile
                </button>
                
                <button
                  onClick={handleLogout}
                  className="py-2.5 px-3 bg-neutral-100 hover:bg-red-500 hover:text-white text-neutral-700 transition-colors cursor-pointer focus:outline-none"
                  title="Logout"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2 font-display">
            <Package size={18} className="text-[#FF4D6D]" />
            Order History ({userOrders.length})
          </h2>

          <div className="space-y-4">
            {userOrders.length > 0 ? (
              userOrders.map((order) => {
                const isExpanded = expandedOrder === order.id;
                const activeStep = getTrackingStepFromOrder(order);

                return (
                  <div
                    key={order.id}
                    className="border border-neutral-200/60 rounded-xs bg-white overflow-hidden"
                  >
                    <div
                      onClick={() => toggleExpandOrder(order.id)}
                      className="p-4 bg-neutral-50/50 hover:bg-neutral-50 cursor-pointer flex items-center justify-between flex-wrap gap-3 border-b border-neutral-100"
                    >
                      <div className="flex gap-4 md:gap-8 flex-wrap text-xs font-sans text-neutral-600">
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">Order ID</p>
                          <p className="font-bold text-neutral-950 font-display break-all">{order.id}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">Placed On</p>
                          <p className="font-semibold text-neutral-800">{order.date}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">Total Amount</p>
                          <p className="font-bold text-neutral-950">₹{order.total.toLocaleString("en-IN")}</p>
                        </div>
                        {order.status !== "Cancelled" && (
                          <div>
                            <p className="text-[10px] font-bold uppercase text-neutral-400 mb-0.5">
                              {order.status === "Delivered" ? "Delivered On" : "Expected Delivery"}
                            </p>
                            <p className={`font-bold ${order.status === "Delivered" ? "text-emerald-700" : "text-[#FF4D6D]"}`}>
                              {getExpectedDeliveryDate(order.date)}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            order.status === "Delivered"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : order.status === "In Transit" || order.status === "Shipped" || order.status === "Out for Delivery"
                              ? "bg-blue-50 text-blue-700 border border-blue-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {order.status}
                        </span>
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-5 space-y-6">
                        
                        {/* Tracker Progress bar */}
                        <div className="max-w-xl mx-auto py-2 px-1">
                          <div className="relative w-full flex items-center justify-between font-display text-[7.5px] min-[360px]:text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase text-neutral-400">
                            
                            <div className="flex flex-col items-center gap-1.5 z-10">
                              <span
                                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border ${
                                  activeStep >= 1 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                }`}
                              >
                                {activeStep > 1 ? <Check size={10} strokeWidth={3} /> : "1"}
                              </span>
                              <span>Placed</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 -translate-y-3.5 ${activeStep >= 2 ? "bg-emerald-500" : "bg-neutral-200"}`} />

                            <div className="flex flex-col items-center gap-1.5 z-10">
                              <span
                                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border ${
                                  activeStep >= 2 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                }`}
                              >
                                {activeStep > 2 ? <Check size={10} strokeWidth={3} /> : "2"}
                              </span>
                              <span>Shipped</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 -translate-y-3.5 ${activeStep >= 3 ? "bg-emerald-500" : "bg-neutral-200"}`} />

                            <div className="flex flex-col items-center gap-1.5 z-10">
                              <span
                                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border ${
                                  activeStep >= 3 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                }`}
                              >
                                {activeStep > 3 ? <Check size={10} strokeWidth={3} /> : "3"}
                              </span>
                              <span>Out for Delivery</span>
                            </div>

                            <div className={`h-0.5 flex-1 mx-1 -translate-y-3.5 ${activeStep >= 4 ? "bg-emerald-500" : "bg-neutral-200"}`} />

                            <div className="flex flex-col items-center gap-1.5 z-10">
                              <span
                                className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] border ${
                                  activeStep >= 4 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                }`}
                              >
                                {activeStep >= 4 ? <Check size={10} strokeWidth={3} /> : "4"}
                              </span>
                              <span>Delivered</span>
                            </div>

                          </div>
                        </div>

                        {/* Order items lists with Write Review action */}
                        <div className="space-y-4 border-t border-neutral-100 pt-4">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3 sm:gap-4 text-xs font-sans text-neutral-600 min-w-0">
                              <button
                                onClick={() => navigate("product-details", { productId: item.id })}
                                className="w-12 aspect-[4/5] bg-neutral-50 border border-neutral-100 rounded-xs shrink-0 overflow-hidden cursor-pointer focus:outline-none"
                              >
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </button>
                              <div className="flex-1 min-w-0 text-left">
                                <button
                                  onClick={() => navigate("product-details", { productId: item.id })}
                                  className="font-semibold text-neutral-900 truncate leading-tight hover:text-[#FF4D6D] cursor-pointer focus:outline-none max-w-full block"
                                >
                                  {item.name}
                                </button>
                                <p className="text-[10px] text-neutral-400 font-light mt-0.5">
                                  Size {item.size} • Qty {item.quantity} {item.color && `• Color ${item.color}`}
                                </p>
                              </div>

                              <div className="flex flex-col items-end gap-1.5 shrink-0">
                                <span className="font-bold text-neutral-900">
                                  ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewingItem(item);
                                    setReviewRating(5);
                                    setReviewComment("");
                                  }}
                                  className="px-2.5 py-1 bg-[#111111] hover:bg-[#FF4D6D] text-white text-[9.5px] font-extrabold tracking-wider uppercase rounded-md transition-all flex items-center gap-1 cursor-pointer shadow-xs active:scale-95"
                                >
                                  <Star size={10} className="fill-amber-400 text-amber-400" />
                                  Write Review
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Shipment logs address */}
                        <div className="bg-neutral-50 p-4 rounded-xs text-[11px] font-sans text-neutral-500 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                          <div>
                            <p className="font-bold uppercase text-[9px] text-neutral-400 mb-1.5">Delivery Address</p>
                            <p className="leading-relaxed font-light text-neutral-700">{order.address}</p>
                          </div>
                          <div>
                            <p className="font-bold uppercase text-[9px] text-neutral-400 mb-1.5">Payment Details</p>
                            <p className="font-light text-neutral-700">Method: <strong className="font-semibold text-neutral-800">{order.paymentMethod}</strong></p>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 bg-neutral-50 border border-dashed border-neutral-200 rounded-sm">
                <PackageOpen className="mx-auto text-neutral-300 mb-2" size={32} />
                <p className="text-xs text-neutral-400 font-light">No order history recorded yet.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Write Review Modal for Ordered Items */}
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
