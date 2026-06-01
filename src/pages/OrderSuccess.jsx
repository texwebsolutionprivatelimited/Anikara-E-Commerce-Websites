import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, ShoppingBag, Calendar, MapPin, ShieldCheck, ClipboardList, Check, Truck, Package, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderSuccess({ navigate, currentParams = {} }) {
  const { orders } = useApp();
  const { orderId } = currentParams;

  const [order, setOrder] = useState(null);
  const [deliveryDate, setDeliveryDate] = useState("");

  useEffect(() => {
    if (orderId && orders.length > 0) {
      const foundOrder = orders.find((o) => o.id === orderId);
      setOrder(foundOrder);

      const date = foundOrder?.date ? new Date(foundOrder.date) : new Date();
      date.setDate(date.getDate() + 4);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setDeliveryDate(date.toLocaleDateString("en-IN", options));
    }
  }, [orderId, orders]);

  const getTimelineSteps = (order) => {
    if (!order || !order.date) return [];

    const [year, month, day] = order.date.split("-").map(Number);
    const orderDate = new Date(year, month - 1, day);
    const orderTime = order.time || "12:00 PM";

    const formatDate = (date) => {
      const options = { day: '2-digit', month: 'short' };
      return date.toLocaleDateString("en-IN", options);
    };

    const formatFullDate = (date) => {
      const options = { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' };
      return date.toLocaleDateString("en-IN", options);
    };

    // Calculate dates
    const placedDate = orderDate;
    const shippedDate = new Date(orderDate);
    shippedDate.setDate(shippedDate.getDate() + 2);

    const outForDeliveryDate = new Date(orderDate);
    outForDeliveryDate.setDate(outForDeliveryDate.getDate() + 3);

    const deliveryDateObj = new Date(orderDate);
    deliveryDateObj.setDate(deliveryDateObj.getDate() + 4);

    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const diffDays = Math.floor((todayMidnight - orderDate) / (1000 * 60 * 60 * 24));

    if (order.status === "Cancelled") {
      return [
        {
          title: "Order Placed",
          dateStr: formatDate(placedDate),
          timeStr: orderTime,
          detailTitle: `Ordered on ${formatFullDate(placedDate)}`,
          desc: "Your order was successfully received.",
          isCompleted: true,
          isActive: false,
          isCancelled: false,
        },
        {
          title: "Order Cancelled",
          dateStr: formatDate(todayMidnight),
          timeStr: "02:00 PM",
          detailTitle: `Cancelled on ${formatFullDate(todayMidnight)}`,
          desc: "This order has been cancelled and refunded.",
          isCompleted: true,
          isActive: true,
          isCancelled: true,
        }
      ];
    }

    return [
      {
        title: "Order Placed",
        dateStr: formatDate(placedDate),
        timeStr: orderTime,
        detailTitle: `Ordered on ${formatFullDate(placedDate)}`,
        desc: "Your order has been successfully placed.",
        isCompleted: true,
        isActive: diffDays === 0 || diffDays === 1,
        isCancelled: false,
      },
      {
        title: diffDays >= 2 ? "Shipped" : "Expected Shipping",
        dateStr: formatDate(shippedDate),
        timeStr: "11:00 AM",
        detailTitle: diffDays >= 2 
          ? `Shipped on ${formatFullDate(shippedDate)}` 
          : `Will ship by ${formatFullDate(shippedDate)}`,
        desc: diffDays >= 2 
          ? "Item has been handed over to our shipping partner." 
          : "Item is being packed and prepared for dispatch.",
        isCompleted: diffDays >= 2,
        isActive: diffDays === 2,
        isCancelled: false,
      },
      {
        title: diffDays >= 3 ? "Out for Delivery" : "Expected Transit",
        dateStr: formatDate(outForDeliveryDate),
        timeStr: "09:00 AM",
        detailTitle: diffDays >= 3 
          ? `Out for delivery on ${formatFullDate(outForDeliveryDate)}` 
          : `In transit by ${formatFullDate(outForDeliveryDate)}`,
        desc: diffDays >= 3 
          ? "Our courier agent is delivering your package today." 
          : "Item is on its way to the local delivery hub.",
        isCompleted: diffDays >= 3,
        isActive: diffDays === 3,
        isCancelled: false,
      },
      {
        title: diffDays >= 4 ? "Delivered" : "Expected Delivery",
        dateStr: formatDate(deliveryDateObj),
        timeStr: "05:00 PM",
        detailTitle: diffDays >= 4 
          ? `Delivered on ${formatFullDate(deliveryDateObj)}` 
          : `Expected delivery by ${formatFullDate(deliveryDateObj)}`,
        desc: diffDays >= 4 
          ? "Your order has been delivered successfully." 
          : "Item will be delivered to your shipping address.",
        isCompleted: diffDays >= 4,
        isActive: diffDays >= 4,
        isCancelled: false,
      }
    ];
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 text-center font-sans">
      
      {/* Visual Success Header */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 mb-2"
        >
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-wider text-neutral-900 uppercase font-display">
          Order Placed! Thank you for shopping with Anikara
        </h1>
        <p className="text-xs text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
          Your order has been successfully placed. You can view your real-time tracking progress and order details below.
        </p>
      </div>

      {order && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 items-start text-left">
          
          {/* Left Column: Flipkart/Amazon style Vertical Tracker (7 cols) */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-7 bg-white border border-neutral-200/60 p-5 sm:p-7 rounded-xl shadow-xs space-y-6 overflow-hidden"
          >
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 border-b border-neutral-100 pb-3 font-display flex items-center gap-2">
              <ClipboardList size={16} className="text-[#FF4D6D]" />
              Track Order Status
            </h3>

            {/* Vertical Timeline Container */}
            <div className="relative space-y-8 font-sans py-2">
              {/* Connecting Vertical Line */}
              <div className="absolute top-2 bottom-2 left-[12px] sm:left-[119px] md:left-[139px] w-0.5 bg-neutral-100" />

              {getTimelineSteps(order).map((step, idx) => {
                return (
                  <div key={idx} className="relative flex flex-col sm:flex-row gap-2 sm:gap-0 items-start text-xs font-sans">
                    
                    {/* Left Column: Date & Time (Desktop/Tablet) */}
                    <div className="hidden sm:block w-[100px] md:w-[120px] text-right pr-5 font-bold text-neutral-700 pt-0.5 font-mono">
                      {step.dateStr}
                      <div className="text-[10px] text-neutral-400 font-medium mt-0.5 font-sans">{step.timeStr}</div>
                    </div>

                    {/* Middle Column: Node Circle */}
                    <div className="w-6 sm:w-10 flex justify-center items-start pt-1 shrink-0 z-10">
                      <div
                        className={`h-4.5 w-4.5 rounded-full border-2 flex items-center justify-center transition-all ${
                          step.isCancelled
                            ? "bg-red-500 border-red-500 text-white shadow-sm"
                            : step.isCompleted
                            ? "bg-emerald-500 border-emerald-500 text-white shadow-sm"
                            : step.isActive
                            ? "bg-[#FF4D6D]/10 border-[#FF4D6D] text-[#FF4D6D]"
                            : "bg-white border-neutral-200 text-neutral-400"
                        }`}
                      >
                        {step.isCompleted ? (
                          <Check size={8} strokeWidth={4} />
                        ) : step.isActive ? (
                          <div className="h-1.5 w-1.5 rounded-full bg-[#FF4D6D] animate-pulse" />
                        ) : null}
                      </div>
                    </div>

                    {/* Right Column: Status Details */}
                    <div className="flex-1 pl-8 sm:pl-4 space-y-1 min-w-0">
                      {/* Mobile Date/Time fallback */}
                      <div className="sm:hidden text-[9px] font-bold text-neutral-400 tracking-wider font-mono">
                        {step.dateStr} at {step.timeStr}
                      </div>

                      <h4 className={`text-[10.5px] sm:text-xs font-bold uppercase tracking-wider ${
                        step.isCancelled 
                          ? "text-red-650"
                          : step.isCompleted 
                          ? "text-emerald-700" 
                          : step.isActive 
                          ? "text-[#FF4D6D]" 
                          : "text-neutral-400"
                      }`}>
                        {step.title}
                      </h4>
                      <p className="text-neutral-800 font-bold text-xs sm:text-[13px]">{step.detailTitle}</p>
                      <p className="text-[10.5px] text-neutral-400 font-light leading-relaxed max-w-md">{step.desc}</p>
                    </div>

                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Order Details (5 cols) */}
          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-5 bg-white border border-neutral-200/60 p-6 rounded-xl shadow-xs space-y-6"
          >
            <div className="border-b border-neutral-100 pb-4">
              <p className="text-[10px] font-bold text-neutral-400 uppercase mb-0.5 font-display">Order Number</p>
              <h2 className="text-sm font-bold text-neutral-900 font-display font-mono">{order.id}</h2>
            </div>

            {/* Estimated Delivery Block */}
            {order.status !== "Cancelled" && (
              <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg p-3 flex items-center gap-3 text-xs">
                <Calendar size={18} className="text-emerald-600 shrink-0" />
                <div>
                  <p className="font-bold text-emerald-800 font-display">Estimated Delivery Date</p>
                  <p className="text-neutral-700 font-medium font-sans mt-0.5">{deliveryDate}</p>
                </div>
              </div>
            )}

            {/* Purchased Items */}
            <div className="space-y-4">
              <h3 className="text-[10px] font-bold tracking-wider uppercase text-neutral-455 font-display">
                Purchased Items
              </h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex gap-3 text-xs font-sans text-neutral-600 min-w-0">
                    <button
                      onClick={() => navigate("product-details", { productId: item.id })}
                      className="w-10 aspect-[4/5] bg-neutral-50 border border-neutral-100 rounded-xs overflow-hidden shrink-0 cursor-pointer focus:outline-none"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <button
                        onClick={() => navigate("product-details", { productId: item.id })}
                        className="font-semibold text-neutral-900 truncate leading-tight hover:text-[#FF4D6D] cursor-pointer focus:outline-none block w-full text-left"
                      >
                        {item.name}
                      </button>
                      <p className="text-[9.5px] text-neutral-400 font-light mt-0.5">
                        Size {item.size} • Qty {item.quantity} {item.color !== "Default" && `• ${item.color}`}
                      </p>
                    </div>
                    <span className="font-bold text-neutral-900 shrink-0">
                      ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="space-y-4 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
              <div>
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[9px] mb-1 font-display flex items-center gap-1">
                  <MapPin size={11} className="text-[#FF4D6D]" /> Delivery Address
                </h4>
                <p className="leading-relaxed font-light">{order.address}</p>
              </div>
              <div className="pt-2 border-t border-neutral-50">
                <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[9px] mb-1 font-display flex items-center gap-1">
                  <ShieldCheck size={11} className="text-[#FF4D6D]" /> Payment Details
                </h4>
                <p className="font-light">Method: <strong className="font-semibold text-neutral-800">{order.paymentMethod}</strong></p>
                <p className="font-light mt-0.5">Total Paid: <strong className="font-extrabold text-neutral-950 text-sm">₹{order.total.toLocaleString("en-IN")}</strong></p>
              </div>
            </div>

          </motion.div>

        </div>
      )}

      {/* Navigation CTAs */}
      <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center font-sans">
        <button
          onClick={() => navigate("products")}
          className="h-12 px-8 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xs cursor-pointer focus:outline-none font-display"
        >
          <ShoppingBag size={15} />
          Continue Shopping
        </button>
        
        <button
          onClick={() => navigate("profile")}
          className="h-12 px-8 border border-[#111111] hover:bg-[#111111] hover:text-white text-[#111111] text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xs cursor-pointer focus:outline-none font-display"
        >
          <ClipboardList size={15} />
          Track Order Status
        </button>
      </div>

    </div>
  );
}
