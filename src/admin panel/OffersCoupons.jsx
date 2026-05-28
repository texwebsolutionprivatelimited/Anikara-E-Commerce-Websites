import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Tag, Plus, Pencil, Trash2, X, Check, Eye, EyeOff, Palette
} from "lucide-react";
import { StatCard, DeleteModal, COLOR_PRESETS } from "./AdminShared";

// ═══════════════════════════════════════════════════════════════════
// COUPON CONSTANTS & COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const EMPTY_COUPON = {
  label: "", headline: "", subtext: "", code: "", condition: "",
  accent: "#FF4D6D", badgeBg: "#FF4D6D", bg: "from-[#fff5f7] to-[#fff0f3]",
};

function CouponPreview({ coupon }) {
  return (
    <div className={`relative flex items-stretch bg-gradient-to-r ${coupon.bg} border border-neutral-200/80 overflow-hidden rounded`}
      style={{ minHeight: 64 }}>
      <div className="flex items-center justify-center px-2 py-3 shrink-0 text-white text-[8px] font-black"
        style={{
          background: coupon.badgeBg, minWidth: 52, writingMode: "vertical-rl",
          textOrientation: "mixed", transform: "rotate(180deg)", letterSpacing: "0.12em"
        }}>
        {coupon.label || "LABEL"}
      </div>
      <div className="flex items-center px-3 flex-1 min-w-0">
        <div>
          <p className="text-[8px] font-bold text-neutral-400 uppercase tracking-wider mb-0.5">{coupon.subtext || "Subtext"}</p>
          <p className="font-extrabold text-sm leading-none" style={{ color: coupon.accent }}>{coupon.headline || "HEADLINE"}</p>
          <p className="text-[8px] text-neutral-400 mt-0.5 font-light">{coupon.condition || "Condition"}</p>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center px-3 py-2 shrink-0 gap-1">
        <div className="border border-dashed px-2 py-0.5 text-center" style={{ borderColor: coupon.accent }}>
          <p className="text-[7px] font-bold text-neutral-400 uppercase">Code</p>
          <p className="font-black text-[9px] tracking-widest" style={{ color: coupon.accent }}>{coupon.code || "XXXX"}</p>
        </div>
      </div>
    </div>
  );
}

function CouponModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_COUPON);
  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));
  const applyPreset = (p) => setForm((f) => ({ ...f, accent: p.accent, badgeBg: p.badgeBg, bg: p.bg }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.label || !form.headline || !form.code) return;
    onSave(form);
  };
  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
            {initial?.id ? "Edit Coupon" : "Add New Coupon"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1">
              <Eye size={10} /> Live Preview
            </p>
            <CouponPreview coupon={form} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className={labelCls}>Badge Label <span className="text-[#FF4D6D]">*</span></label>
              <input required value={form.label} onChange={(e) => set("label", e.target.value)} placeholder="e.g. 1ST ORDER" className={inputCls} /></div>
            <div><label className={labelCls}>Headline <span className="text-[#FF4D6D]">*</span></label>
              <input required value={form.headline} onChange={(e) => set("headline", e.target.value)} placeholder="e.g. FLAT ₹300 OFF" className={inputCls} /></div>
            <div><label className={labelCls}>Subtext</label>
              <input value={form.subtext} onChange={(e) => set("subtext", e.target.value)} placeholder="e.g. On your 1st purchase" className={inputCls} /></div>
            <div><label className={labelCls}>Coupon Code <span className="text-[#FF4D6D]">*</span></label>
              <input required value={form.code} onChange={(e) => set("code", e.target.value)} placeholder="e.g. ANIKARA300" className={inputCls} /></div>
          </div>
          <div><label className={labelCls}>Condition / Fine Print</label>
            <input value={form.condition} onChange={(e) => set("condition", e.target.value)} placeholder="e.g. Min. order ₹999 • New users only" className={inputCls} /></div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <Palette size={10} /> Colour Theme
            </p>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((p) => (
                <button key={p.label} type="button" onClick={() => applyPreset(p)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold border-2 transition-all focus:outline-none"
                  style={{
                    borderColor: form.accent === p.accent ? p.accent : "transparent",
                    background: form.accent === p.accent ? p.accent + "15" : "#f5f5f5", color: p.accent
                  }}>
                  <span className="w-3 h-3 rounded-full" style={{ background: p.accent }} />{p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2 border-t border-neutral-100">
            <button type="submit"
              className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-2">
              <Check size={13} />{initial?.id ? "Save Changes" : "Add Coupon"}
            </button>
            <button type="button" onClick={onClose}
              className="px-6 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase hover:bg-neutral-50 transition-colors rounded focus:outline-none">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COUPONS TAB
// ═══════════════════════════════════════════════════════════════════
export default function CouponsTab() {
  const { coupons, adminAddCoupon, adminUpdateCoupon, adminDeleteCoupon, adminToggleCoupon } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);

  const activeCount = coupons.filter((c) => c.active).length;

  const handleSave = (form) => {
    if (editTarget?.id) { adminUpdateCoupon(editTarget.id, form); setEditTarget(null); }
    else { adminAddCoupon(form); setShowAdd(false); }
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Coupons" value={coupons.length} color="#111111" />
        <StatCard label="Active" value={activeCount} color="#22c55e" />
        <StatCard label="Inactive" value={coupons.length - activeCount} color="#FF4D6D" />
        <StatCard label="Visible on Site" value={activeCount > 0 ? "Yes" : "No"} color={activeCount > 0 ? "#22c55e" : "#FF4D6D"} />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag size={16} className="text-[#FF4D6D]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">All Coupons</h2>
          <span className="text-[10px] bg-neutral-200 text-neutral-600 font-bold px-2 py-0.5 rounded-full">{coupons.length}</span>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm">
          <Plus size={13} /> Add Coupon
        </button>
      </div>

      {coupons.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl py-16 text-center">
          <Tag size={32} className="mx-auto text-neutral-200 mb-3" />
          <p className="text-xs text-neutral-400 font-light">No coupons yet.</p>
          <button onClick={() => setShowAdd(true)}
            className="mt-4 px-6 py-2 bg-[#FF4D6D] text-white text-xs font-bold uppercase tracking-widest rounded-lg focus:outline-none">
            Add First Coupon
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {coupons.map((coupon) => (
            <div key={coupon.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${coupon.active ? "border-neutral-200/60" : "border-neutral-100 opacity-60"}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                <div className="flex-1 min-w-0"><CouponPreview coupon={coupon} /></div>
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${coupon.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-neutral-100 text-neutral-500 border border-neutral-200"}`}>
                    {coupon.active ? "Active" : "Hidden"}
                  </span>
                  <button onClick={() => adminToggleCoupon(coupon.id)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#111111] transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-neutral-100">
                    {coupon.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    {coupon.active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => setEditTarget(coupon)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#111111] transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-neutral-100">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setDelTarget(coupon)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-600 transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
              <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex flex-wrap gap-4 text-[10px] text-neutral-500 font-light">
                <span><span className="font-bold text-neutral-700">Code:</span> {coupon.code}</span>
                <span><span className="font-bold text-neutral-700">Label:</span> {coupon.label}</span>
                <span><span className="font-bold text-neutral-700">Condition:</span> {coupon.condition}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-[11px] text-blue-700 font-light leading-relaxed">
        <strong className="font-bold">How it works:</strong> Active coupons are displayed on the landing page under "Exclusive Offers & Coupons".
        Changes reflect immediately on the storefront.
      </div>

      {/* Modals */}
      {(showAdd || editTarget) && (
        <CouponModal initial={editTarget} onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditTarget(null); }} />
      )}
      {delTarget && (
        <DeleteModal item={delTarget} label="Coupon" onConfirm={() => { adminDeleteCoupon(delTarget.id); setDelTarget(null); }}
          onClose={() => setDelTarget(null)} />
      )}
    </>
  );
}
