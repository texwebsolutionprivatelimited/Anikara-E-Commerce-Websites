import React from "react";
import {
  AlertTriangle, LayoutTemplate, FolderOpen, Tag, FileText,
  CreditCard, Package, Settings
} from "lucide-react";

// ─── TABS ──────────────────────────────────────────────────────────────────────
export const TABS = [
  { id: "slides", label: "Banner Slides", icon: LayoutTemplate },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "coupons", label: "Offers & Coupons", icon: Tag },
  { id: "orders", label: "Orders Tracking", icon: FileText },
  { id: "payments", label: "Payment Records", icon: CreditCard },
  { id: "products", label: "Product Inventory", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Colour presets (for coupons) ─────────────────────────────────────────────
export const COLOR_PRESETS = [
  { label: "Pink", accent: "#FF4D6D", badgeBg: "#FF4D6D", bg: "from-[#fff5f7] to-[#fff0f3]" },
  { label: "Black", accent: "#111111", badgeBg: "#111111", bg: "from-[#f5f5f5] to-[#f0f0f0]" },
  { label: "Gold", accent: "#c9860a", badgeBg: "#c9860a", bg: "from-[#fffbf0] to-[#fff8e6]" },
  { label: "Purple", accent: "#7c3aed", badgeBg: "#7c3aed", bg: "from-[#f5f3ff] to-[#ede9fe]" },
  { label: "Teal", accent: "#0d9488", badgeBg: "#0d9488", bg: "from-[#f0fdfa] to-[#ccfbf1]" },
  { label: "Red", accent: "#dc2626", badgeBg: "#dc2626", bg: "from-[#fff5f5] to-[#fee2e2]" },
];

// ─── Stat Card ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-neutral-200/60 rounded-xl p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-extrabold font-display" style={{ color }}>{value}</p>
    </div>
  );
}

// ─── Shared Delete Confirm Modal ───────────────────────────────────────────────
export function DeleteModal({ item, label, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-500"><AlertTriangle size={18} /></div>
          <h2 className="text-sm font-bold text-neutral-900">Delete {label}?</h2>
        </div>
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          This will permanently remove <strong className="text-neutral-800">"{item.title || item.code}"</strong>.
          This action cannot be undone.
        </p>
        <div className="flex gap-3 pt-1">
          <button onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors focus:outline-none">Delete</button>
          <button onClick={onClose}
            className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase rounded hover:bg-neutral-50 transition-colors focus:outline-none">Cancel</button>
        </div>
      </div>
    </div>
  );
}
