import React, { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { CheckCircle2, ShoppingBag, Calendar, MapPin, ShieldCheck, ClipboardList } from "lucide-react";
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

      const date = new Date();
      date.setDate(date.getDate() + 3);
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      setDeliveryDate(date.toLocaleDateString("en-IN", options));
    }
  }, [orderId, orders]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center font-sans">
      
      {/* Visual Success */}
      <div className="space-y-4">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15, stiffness: 200 }}
          className="inline-flex p-4 bg-emerald-50 text-emerald-500 rounded-full border border-emerald-100 mb-2"
        >
          <CheckCircle2 size={48} strokeWidth={1.5} />
        </motion.div>
        
        <h1 className="text-2xl md:text-3xl font-bold tracking-wider text-neutral-900 uppercase font-display">
          Thank You For Your Order!
        </h1>
        <p className="text-xs text-neutral-500 font-light max-w-md mx-auto leading-relaxed">
          Your order has been placed successfully. A confirmation receipt and tracking logs have been sent to your email.
        </p>
      </div>

      {order && (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 bg-white border border-neutral-200/60 text-left p-6 sm:p-8 rounded-xs space-y-6 shadow-xs"
        >
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-4 border-b border-neutral-100 pb-4">
            <div>
              <p className="text-[10px] font-bold text-neutral-400 uppercase mb-0.5 font-display">Order Number</p>
              <h2 className="text-sm font-bold text-neutral-900 font-display">{order.id}</h2>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-bold text-neutral-400 uppercase mb-0.5 font-display">Estimated Delivery</p>
              <p className="text-xs font-semibold text-emerald-700 flex sm:justify-end items-center gap-1 font-display">
                <Calendar size={13} /> {deliveryDate}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 font-display">
              Purchased Items
            </h3>
            <div className="space-y-3.5">
              {order.items.map((item, idx) => (
                <div key={idx} className="flex gap-3 sm:gap-4 text-xs font-sans text-neutral-600 min-w-0">
                  <button
                    onClick={() => navigate("product-details", { productId: item.id })}
                    className="w-10 aspect-[3/4] bg-neutral-100 border border-neutral-100 rounded-xs overflow-hidden shrink-0 cursor-pointer focus:outline-none"
                  >
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  </button>
                  <div className="flex-1 min-w-0 text-left">
                    <button
                      onClick={() => navigate("product-details", { productId: item.id })}
                      className="font-semibold text-neutral-800 truncate leading-tight hover:text-[#FF4D6D] cursor-pointer focus:outline-none"
                    >
                      {item.name}
                    </button>
                    <p className="text-[10px] text-neutral-400 font-light mt-0.5">
                      Size {item.size} • Qty {item.quantity} {item.color !== "Default" && `• Color ${item.color}`}
                    </p>
                  </div>
                  <span className="font-bold text-[#111111] shrink-0">
                    ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-neutral-100 pt-5 text-xs text-neutral-600">
            <div>
              <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[9px] mb-1.5 font-display flex items-center gap-1">
                <MapPin size={12} /> Shipping Address
              </h4>
              <p className="leading-relaxed font-light">{order.address}</p>
            </div>
            <div>
              <h4 className="font-bold text-neutral-800 uppercase tracking-wider text-[9px] mb-1.5 font-display flex items-center gap-1">
                <ShieldCheck size={12} /> Payment Info
              </h4>
              <p className="font-light">Method: <strong className="font-semibold text-neutral-800">{order.paymentMethod}</strong></p>
              <p className="font-light mt-0.5">Total Paid: <strong className="font-bold text-neutral-900">₹{order.total.toLocaleString("en-IN")}</strong></p>
            </div>
          </div>

        </motion.div>
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
