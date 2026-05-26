import React from "react";
import { useApp } from "../context/AppContext";
import { X, CheckCircle, Info, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Toast() {
  const { toasts, removeToast } = useApp();

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3 sm:max-w-[340px] w-auto sm:w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 25, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 250 }}
            className={`pointer-events-auto p-4 rounded-lg border flex items-start gap-3 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] font-sans ${
              toast.type === "success"
                ? "border-emerald-100"
                : toast.type === "error"
                ? "border-red-100"
                : "border-neutral-100"
            }`}
          >
            {/* Status Icons */}
            {toast.type === "success" && (
              <CheckCircle size={18} className="text-emerald-500 shrink-0 mt-0.5" />
            )}
            {toast.type === "error" && (
              <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            )}
            {toast.type === "info" && (
              <Info size={18} className="text-[#FF4D6D] shrink-0 mt-0.5" />
            )}

            <div className="flex-grow">
              <p className="text-xs font-semibold text-neutral-800 leading-normal">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-neutral-400 hover:text-neutral-600 transition-colors shrink-0 focus:outline-none cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
