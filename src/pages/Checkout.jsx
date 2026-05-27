import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { MapPin, Truck, CreditCard, ClipboardCheck, ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";

export default function Checkout({ navigate }) {
  const { cart, user, promoDiscount, placeOrder } = useApp();

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate("cart");
    }
  }, [cart]);

  // Stepper state: 1: Address, 2: Shipping, 3: Payment, 4: Review
  const [step, setStep] = useState(1);

  // Form Fields
  const [name, setName] = useState(user?.name || "Ajeet Kumar");
  const [phone, setPhone] = useState(user?.phone || "+91 9876543210");
  const [street, setStreet] = useState(user?.address?.street || "");
  const [city, setCity] = useState(user?.address?.city || "");
  const [stateName, setStateName] = useState(user?.address?.state || "");
  const [zip, setZip] = useState(user?.address?.zip || "");

  // Shipping Method
  const [shippingMethod, setShippingMethod] = useState("Standard");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  // Total Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountAmount = promoDiscount
    ? Math.round((subtotal * promoDiscount.discountPercent) / 100)
    : 0;

  const standardShippingPrice = subtotal > 1500 ? 0 : 150;
  const shippingPrice = shippingMethod === "Standard" ? standardShippingPrice : 250;
  
  const tax = Math.round((subtotal - discountAmount) * 0.05);
  const grandTotal = subtotal - discountAmount + shippingPrice + tax;

  const handleNextStep = (e) => {
    e.preventDefault();
    if (step === 1) {
      if (!street || !city || !stateName || !zip || !name || !phone) {
        alert("Please complete all shipping address fields.");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 4));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleFinalCheckout = () => {
    const addressDetails = { street, city, state: stateName, zip };
    const createdOrder = placeOrder(addressDetails, paymentMethod);
    if (createdOrder) {
      navigate("order-success", { orderId: createdOrder.id });
    }
  };

  if (cart.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 font-sans">
      
      {/* 1. PROGRESS STEP INDICATOR */}
      <div className="max-w-3xl mx-auto mb-6 md:mb-12 px-2">
        <div className="w-full flex items-center justify-between font-display text-[8px] min-[360px]:text-[9px] sm:text-[10px] md:text-xs font-bold uppercase tracking-wider text-neutral-400">
          
          {/* Step 1 */}
          <div className="flex flex-col items-center gap-2 relative flex-1">
            <span
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                step >= 1 ? "border-[#FF4D6D] bg-[#FF4D6D] text-white" : "border-neutral-200 bg-white"
              }`}
            >
              <MapPin size={14} />
            </span>
            <span className={step >= 1 ? "text-neutral-900" : ""}>Address</span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 transition-all ${step >= 2 ? "bg-[#FF4D6D]" : "bg-neutral-200"}`} />

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-2 relative flex-1">
            <span
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                step >= 2 ? "border-[#FF4D6D] bg-[#FF4D6D] text-white" : "border-neutral-200 bg-white"
              }`}
            >
              <Truck size={14} />
            </span>
            <span className={step >= 2 ? "text-neutral-900" : ""}>Shipping</span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 transition-all ${step >= 3 ? "bg-[#FF4D6D]" : "bg-neutral-200"}`} />

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-2 relative flex-1">
            <span
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                step >= 3 ? "border-[#FF4D6D] bg-[#FF4D6D] text-white" : "border-neutral-200 bg-white"
              }`}
            >
              <CreditCard size={14} />
            </span>
            <span className={step >= 3 ? "text-neutral-900" : ""}>Payment</span>
          </div>

          <div className={`h-0.5 flex-1 mx-2 transition-all ${step >= 4 ? "bg-[#FF4D6D]" : "bg-neutral-200"}`} />

          {/* Step 4 */}
          <div className="flex flex-col items-center gap-2 relative flex-1">
            <span
              className={`h-8 w-8 rounded-full border-2 flex items-center justify-center transition-all ${
                step >= 4 ? "border-[#FF4D6D] bg-[#FF4D6D] text-white" : "border-neutral-200 bg-white"
              }`}
            >
              <ClipboardCheck size={14} />
            </span>
            <span className={step >= 4 ? "text-neutral-900" : ""}>Review</span>
          </div>

        </div>
      </div>

      {/* Main Checkout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10 items-start">
        
        {/* Form Inputs */}
        <div className="lg:col-span-2 bg-white border border-neutral-200/60 p-4 sm:p-8 rounded-xs space-y-6 min-w-0">
          
          {/* STEP 1: ADDRESS */}
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 font-display">
                Shipping Address
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">Recipient Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#111111] font-light"
                    placeholder="E.g., Ajeet Kumar"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">Contact Phone</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#111111] font-light"
                    placeholder="+91 9876543210"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">Flat/Street Address</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#111111] font-light"
                  placeholder="Flat No, Building Name, Street"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">City</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#111111] font-light"
                    placeholder="Mumbai"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">State</label>
                  <input
                    type="text"
                    required
                    value={stateName}
                    onChange={(e) => setStateName(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#111111] font-light"
                    placeholder="Maharashtra"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-neutral-500 mb-1.5 font-display">ZIP Code</label>
                  <input
                    type="text"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                    className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 px-4 focus:outline-none focus:border-[#111111] font-light"
                    placeholder="400054"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto justify-center px-6 sm:px-8 h-11 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center gap-1.5 rounded-xs cursor-pointer focus:outline-none"
                >
                  Continue to Delivery
                  <ArrowRight size={14} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: SHIPPING */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 font-display">
                Delivery Method
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-neutral-200 hover:border-neutral-800 cursor-pointer rounded-xs bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "Standard"}
                      onChange={() => setShippingMethod("Standard")}
                      className="accent-[#FF4D6D] h-4 w-4"
                    />
                    <div className="text-left font-sans">
                      <p className="text-xs font-bold text-neutral-800">Standard Delivery</p>
                      <p className="text-[10px] text-neutral-400 font-light">Delivers in 3-5 business days</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {standardShippingPrice === 0 ? "FREE" : `₹${standardShippingPrice}`}
                  </span>
                </label>

                <label className="flex items-center justify-between p-4 border border-neutral-200 hover:border-neutral-800 cursor-pointer rounded-xs bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="shipping"
                      checked={shippingMethod === "Express"}
                      onChange={() => setShippingMethod("Express")}
                      className="accent-[#FF4D6D] h-4 w-4"
                    />
                    <div className="text-left font-sans">
                      <p className="text-xs font-bold text-neutral-800">Express Delivery</p>
                      <p className="text-[10px] text-neutral-400 font-light">Delivers in 24-48 hours. Flat rate.</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">₹250</span>
                </label>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="justify-center px-6 h-11 border border-neutral-200 hover:border-neutral-800 text-neutral-700 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer focus:outline-none"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="justify-center px-6 sm:px-8 h-11 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center gap-1.5 rounded-xs cursor-pointer focus:outline-none"
                >
                  Continue to Payment
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 font-display">
                Payment Option
              </h2>
              
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border border-neutral-200 hover:border-neutral-800 cursor-pointer rounded-xs bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "UPI"}
                      onChange={() => setPaymentMethod("UPI")}
                      className="accent-[#FF4D6D] h-4 w-4"
                    />
                    <div className="text-left font-sans">
                      <p className="text-xs font-bold text-neutral-800">BHIM UPI / GooglePay / PhonePe</p>
                      <p className="text-[10px] text-neutral-400 font-light">Instant transfer via QR scan or UPI ID</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-neutral-200 hover:border-neutral-800 cursor-pointer rounded-xs bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "Credit Card"}
                      onChange={() => setPaymentMethod("Credit Card")}
                      className="accent-[#FF4D6D] h-4 w-4"
                    />
                    <div className="text-left font-sans">
                      <p className="text-xs font-bold text-neutral-800">Credit / Debit Card</p>
                      <p className="text-[10px] text-neutral-400 font-light">Visa, MasterCard, RuPay, Diners Club</p>
                    </div>
                  </div>
                </label>

                <label className="flex items-center justify-between p-4 border border-neutral-200 hover:border-neutral-800 cursor-pointer rounded-xs bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === "COD"}
                      onChange={() => setPaymentMethod("COD")}
                      className="accent-[#FF4D6D] h-4 w-4"
                    />
                    <div className="text-left font-sans">
                      <p className="text-xs font-bold text-neutral-800">Cash on Delivery (COD)</p>
                      <p className="text-[10px] text-neutral-400 font-light">Pay cash upon delivery. Charges may apply.</p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="justify-center px-6 h-11 border border-neutral-200 hover:border-neutral-800 text-neutral-700 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer focus:outline-none"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="justify-center px-6 sm:px-8 h-11 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center gap-1.5 rounded-xs cursor-pointer focus:outline-none"
                >
                  Review Order Details
                  <ArrowRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW */}
          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 font-display">
                Review & Confirm Order
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-neutral-600 font-sans">
                <div className="border border-neutral-200/60 p-4 rounded-xs">
                  <p className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] mb-2 font-display">
                    Shipping Details
                  </p>
                  <p className="font-bold text-neutral-800 mb-1">{name}</p>
                  <p className="font-light">{street}</p>
                  <p className="font-light">{city}, {stateName} - {zip}</p>
                  <p className="font-light mt-1.5">Phone: {phone}</p>
                </div>

                <div className="border border-neutral-200/60 p-4 rounded-xs flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-neutral-800 uppercase tracking-wider text-[10px] mb-2 font-display">
                      Delivery & Payment
                    </p>
                    <p className="font-light">Method: <strong className="text-neutral-800 font-semibold">{shippingMethod} Shipping</strong></p>
                    <p className="font-light">Payment: <strong className="text-neutral-800 font-semibold">{paymentMethod}</strong></p>
                  </div>
                  <div className="flex items-center gap-1 text-[#FF4D6D] text-[10px] font-bold tracking-wider mt-3 uppercase">
                    <ShieldCheck size={14} /> Safe & Encrypted Checkout
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-neutral-100 flex flex-col-reverse sm:flex-row sm:justify-between gap-3">
                <button
                  onClick={handlePrevStep}
                  className="justify-center px-6 h-11 border border-neutral-200 hover:border-neutral-800 text-neutral-700 text-xs font-bold tracking-widest uppercase transition-colors flex items-center gap-1.5 rounded-xs cursor-pointer focus:outline-none"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <button
                  onClick={handleFinalCheckout}
                  className="justify-center px-6 sm:px-8 h-11 bg-[#FF4D6D] hover:bg-[#111111] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center gap-1.5 rounded-xs shadow-md cursor-pointer focus:outline-none font-display"
                >
                  Place Order (₹{grandTotal.toLocaleString("en-IN")})
                  <ShieldCheck size={14} />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Sidebar Summary */}
        <div className="bg-neutral-50 border border-neutral-200/60 p-4 sm:p-6 rounded-xs space-y-5 min-w-0">
          <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 border-b border-neutral-200 pb-3 font-display">
            Items in Order
          </h3>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.cartItemId} className="flex gap-3 text-xs min-w-0">
                <div className="w-10 aspect-[4/5] bg-neutral-100 shrink-0 rounded-xs overflow-hidden border border-neutral-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0 font-sans">
                  <p className="font-semibold text-neutral-800 truncate leading-tight">{item.name}</p>
                  <p className="text-[10px] text-neutral-400 font-light mt-0.5">Size {item.size} x {item.quantity}</p>
                </div>
                <span className="font-bold text-neutral-900 shrink-0 font-sans">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 text-xs text-neutral-600 border-t border-neutral-200 pt-4">
            <div className="flex justify-between font-light">
              <span>Items Subtotal</span>
              <span className="font-bold text-neutral-900">₹{subtotal.toLocaleString("en-IN")}</span>
            </div>
            
            {promoDiscount && (
              <div className="flex justify-between text-emerald-700">
                <span>Coupon ({promoDiscount.code})</span>
                <span className="font-bold">- ₹{discountAmount.toLocaleString("en-IN")}</span>
              </div>
            )}

            <div className="flex justify-between font-light">
              <span>Shipping Fee</span>
              {shippingPrice === 0 ? (
                <span className="text-emerald-700 font-bold uppercase">Free</span>
              ) : (
                <span className="font-bold text-neutral-900">₹{shippingPrice}</span>
              )}
            </div>

            <div className="flex justify-between font-light">
              <span>GST / Taxes (5%)</span>
              <span className="font-bold text-neutral-900">₹{tax}</span>
            </div>

            <div className="flex justify-between border-t border-neutral-200 pt-3 text-sm font-bold text-neutral-900">
              <span className="font-display uppercase tracking-wider">Grand Total</span>
              <span className="text-base font-display">₹{grandTotal.toLocaleString("en-IN")}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
