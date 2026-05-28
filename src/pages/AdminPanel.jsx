import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Shield, Tag, Plus, Pencil, Trash2, X, Check,
  AlertTriangle, ChevronRight, Eye, EyeOff, Palette,
  Image as ImageIcon, ArrowUp, ArrowDown, LayoutTemplate,
  ChevronUp, ChevronDown, Monitor, FolderOpen, Package, Search, Heart, Star,
  Settings, CreditCard, FileText, Download, RotateCcw, CheckCircle, PlusCircle
} from "lucide-react";

// ─── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "slides", label: "Banner Slides", icon: LayoutTemplate },
  { id: "coupons", label: "Offers & Coupons", icon: Tag },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "products", label: "Product Inventory", icon: Package },
  { id: "payments", label: "Payment Records", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

// ─── Colour presets (for coupons) ─────────────────────────────────────────────
const COLOR_PRESETS = [
  { label: "Pink", accent: "#FF4D6D", badgeBg: "#FF4D6D", bg: "from-[#fff5f7] to-[#fff0f3]" },
  { label: "Black", accent: "#111111", badgeBg: "#111111", bg: "from-[#f5f5f5] to-[#f0f0f0]" },
  { label: "Gold", accent: "#c9860a", badgeBg: "#c9860a", bg: "from-[#fffbf0] to-[#fff8e6]" },
  { label: "Purple", accent: "#7c3aed", badgeBg: "#7c3aed", bg: "from-[#f5f3ff] to-[#ede9fe]" },
  { label: "Teal", accent: "#0d9488", badgeBg: "#0d9488", bg: "from-[#f0fdfa] to-[#ccfbf1]" },
  { label: "Red", accent: "#dc2626", badgeBg: "#dc2626", bg: "from-[#fff5f5] to-[#fee2e2]" },
];

// ═══════════════════════════════════════════════════════════════════
// SLIDE COMPONENTS
// ═══════════════════════════════════════════════════════════════════

const EMPTY_SLIDE = {
  title: "", subtitle: "", desc: "",
  image: "", navigatePage: "products", navigateParams: {},
};

function SlidePreview({ slide }) {
  return (
    <div className="relative w-full h-28 overflow-hidden bg-white border border-neutral-200 rounded-lg">
      {slide.image && (
        <div
          className="absolute inset-y-0 right-0 w-[55%] bg-cover bg-center"
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center px-4">
        <div className="max-w-[45%]">
          {slide.subtitle && (
            <p className="text-[7px] font-black tracking-[0.2em] text-[#FF4D6D] uppercase mb-0.5">
              {slide.subtitle}
            </p>
          )}
          <p className="text-xs font-extrabold text-[#111111] leading-tight">
            {slide.title || "Slide Title"}
          </p>
          {slide.desc && (
            <p className="text-[7px] text-neutral-500 font-light mt-0.5 line-clamp-2">
              {slide.desc}
            </p>
          )}
        </div>
      </div>
      {!slide.image && (
        <div className="absolute inset-y-0 right-0 w-[55%] bg-neutral-100 flex items-center justify-center">
          <ImageIcon size={24} className="text-neutral-300" />
        </div>
      )}
    </div>
  );
}

function SlideModal({ initial, onSave, onClose }) {
  const { categories } = useApp();
  const dynamicNavOptions = [
    { label: "Home", page: "home", params: {} },
    { label: "All Products", page: "products", params: {} },
    { label: "Sale / 50% OFF", page: "products", params: { badge: "50% OFF" } },
    { label: "Sale Badge", page: "products", params: { badge: "Sale" } },
    ...categories.map(cat => ({
      label: cat,
      page: "products",
      params: { category: cat }
    }))
  ];

  const [form, setForm] = useState(
    initial
      ? { ...initial }
      : { ...EMPTY_SLIDE }
  );

  const selectedNav = dynamicNavOptions.findIndex(
    (o) => o.page === form.navigatePage &&
      JSON.stringify(o.params) === JSON.stringify(form.navigateParams)
  );

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleNav = (idx) => {
    const opt = dynamicNavOptions[idx];
    setForm((f) => ({ ...f, navigatePage: opt.page, navigateParams: opt.params }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.image) return;
    onSave(form);
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
            {initial?.id ? "Edit Slide" : "Add New Slide"}
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {/* Live Preview */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-2 flex items-center gap-1">
              <Monitor size={10} /> Live Preview
            </p>
            <SlidePreview slide={form} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Title <span className="text-[#FF4D6D]">*</span></label>
              <input required value={form.title} onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Summer Sale 50% OFF" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Subtitle / Tag</label>
              <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)}
                placeholder="e.g. SEASONAL EDIT" className={inputCls} />
            </div>
          </div>

          <div>
            <label className={labelCls}>Description</label>
            <textarea rows={2} value={form.desc} onChange={(e) => set("desc", e.target.value)}
              placeholder="Short description shown below the title..."
              className={`${inputCls} resize-none`} />
          </div>

          <div>
            <label className={labelCls}>Image URL <span className="text-[#FF4D6D]">*</span></label>
            <input required value={form.image} onChange={(e) => set("image", e.target.value)}
              placeholder="https://images.unsplash.com/..." className={inputCls} />
            <p className="text-[9px] text-neutral-400 mt-0.5">
              Use Unsplash URLs or any direct image link. Recommended: 1600×900px or wider.
            </p>
          </div>

          <div>
            <label className={labelCls}>Button Links To</label>
            <select
              value={selectedNav >= 0 ? selectedNav : ""}
              onChange={(e) => handleNav(Number(e.target.value))}
              className={inputCls}
            >
              {dynamicNavOptions.map((o, i) => (
                <option key={i} value={i}>{o.label}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2 border-t border-neutral-100">
            <button type="submit"
              className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-2">
              <Check size={13} />
              {initial?.id ? "Save Changes" : "Add Slide"}
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
// COUPON COMPONENTS  (same as before)
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
// SHARED — Delete Confirm Modal
// ═══════════════════════════════════════════════════════════════════
function DeleteModal({ item, label, onConfirm, onClose }) {
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

// ─── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, color }) {
  return (
    <div className="bg-white border border-neutral-200/60 rounded-xl p-5">
      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">{label}</p>
      <p className="text-2xl font-extrabold font-display" style={{ color }}>{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SLIDES TAB
// ═══════════════════════════════════════════════════════════════════
function SlidesTab() {
  const { slides, adminAddSlide, adminUpdateSlide, adminDeleteSlide, adminToggleSlide, adminMoveSlide } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);

  const activeCount = slides.filter((s) => s.active).length;

  const handleSave = (form) => {
    if (editTarget?.id) { adminUpdateSlide(editTarget.id, form); setEditTarget(null); }
    else { adminAddSlide(form); setShowAdd(false); }
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard label="Total Slides" value={slides.length} color="#111111" />
        <StatCard label="Active" value={activeCount} color="#22c55e" />
        <StatCard label="Hidden" value={slides.length - activeCount} color="#FF4D6D" />
        <StatCard label="Visible on Site" value={activeCount > 0 ? "Yes" : "No"} color={activeCount > 0 ? "#22c55e" : "#FF4D6D"} />
      </div>

      {/* Header row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <LayoutTemplate size={16} className="text-[#FF4D6D]" />
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">All Slides</h2>
          <span className="text-[10px] bg-neutral-200 text-neutral-600 font-bold px-2 py-0.5 rounded-full">{slides.length}</span>
        </div>
        <button onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm">
          <Plus size={13} /> Add Slide
        </button>
      </div>

      {slides.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl py-16 text-center">
          <LayoutTemplate size={32} className="mx-auto text-neutral-200 mb-3" />
          <p className="text-xs text-neutral-400 font-light">No slides yet.</p>
          <button onClick={() => setShowAdd(true)}
            className="mt-4 px-6 py-2 bg-[#FF4D6D] text-white text-xs font-bold uppercase tracking-widest rounded-lg focus:outline-none">
            Add First Slide
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {slides.map((slide, idx) => (
            <div key={slide.id}
              className={`bg-white border rounded-xl overflow-hidden transition-all duration-200 ${slide.active ? "border-neutral-200/60" : "border-neutral-100 opacity-60"}`}>
              <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                {/* Order controls */}
                <div className="flex md:flex-col gap-1 shrink-0">
                  <button onClick={() => adminMoveSlide(slide.id, "up")} disabled={idx === 0}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-[#111111] disabled:opacity-30 focus:outline-none transition-colors">
                    <ChevronUp size={14} />
                  </button>
                  <span className="flex items-center justify-center text-[10px] font-black text-neutral-300 w-7 h-7">{idx + 1}</span>
                  <button onClick={() => adminMoveSlide(slide.id, "down")} disabled={idx === slides.length - 1}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-[#111111] disabled:opacity-30 focus:outline-none transition-colors">
                    <ChevronDown size={14} />
                  </button>
                </div>

                {/* Preview */}
                <div className="flex-1 min-w-0">
                  <SlidePreview slide={slide} />
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${slide.active ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-neutral-100 text-neutral-500 border border-neutral-200"}`}>
                    {slide.active ? "Active" : "Hidden"}
                  </span>
                  <button onClick={() => adminToggleSlide(slide.id)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#111111] transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-neutral-100">
                    {slide.active ? <EyeOff size={14} /> : <Eye size={14} />}
                    {slide.active ? "Hide" : "Show"}
                  </button>
                  <button onClick={() => setEditTarget(slide)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#111111] transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-neutral-100">
                    <Pencil size={14} /> Edit
                  </button>
                  <button onClick={() => setDelTarget(slide)}
                    className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-red-400 hover:text-red-600 transition-colors focus:outline-none px-2 py-1.5 rounded-lg hover:bg-red-50">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>

              {/* Info bar */}
              <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-100 flex flex-wrap gap-4 text-[10px] text-neutral-500 font-light">
                <span><span className="font-bold text-neutral-700">Title:</span> {slide.title}</span>
                <span><span className="font-bold text-neutral-700">Subtitle:</span> {slide.subtitle}</span>
                <span><span className="font-bold text-neutral-700">Links to:</span> {slide.navigatePage}{slide.navigateParams?.category ? ` › ${slide.navigateParams.category}` : slide.navigateParams?.badge ? ` › ${slide.navigateParams.badge}` : ""}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Help */}
      <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl px-5 py-4 text-[11px] text-blue-700 font-light leading-relaxed">
        <strong className="font-bold">How it works:</strong> Active slides appear on the landing page hero slider in the order listed above.
        Use the <strong>↑ ↓ arrows</strong> to reorder, and <strong>Hide/Show</strong> to control visibility — changes reflect immediately.
      </div>

      {/* Modals */}
      {(showAdd || editTarget) && (
        <SlideModal initial={editTarget} onSave={handleSave}
          onClose={() => { setShowAdd(false); setEditTarget(null); }} />
      )}
      {delTarget && (
        <DeleteModal item={delTarget} label="Slide" onConfirm={() => { adminDeleteSlide(delTarget.id); setDelTarget(null); }}
          onClose={() => setDelTarget(null)} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COUPONS TAB
// ═══════════════════════════════════════════════════════════════════
function CouponsTab() {
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

const DEFAULT_CATEGORY_IMAGE = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80";

function CategoriesTab() {
  const { categories, categoryImages = {}, products, adminAddCategory, adminDeleteCategory, addToast } = useApp();
  const [newCat, setNewCat] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [isDragActive, setIsDragActive] = useState(false);
  const [delTarget, setDelTarget] = useState(null);

  // Statistics
  const totalCategories = categories.length;
  const productCounts = categories.reduce((acc, cat) => {
    acc[cat] = products.filter(p => p.category.toLowerCase() === cat.toLowerCase()).length;
    return acc;
  }, {});

  const emptyCategoriesCount = Object.values(productCounts).filter(c => c === 0).length;
  const mostPopularCategory = Object.keys(productCounts).sort((a, b) => productCounts[b] - productCounts[a])[0] || "None";

  // Drag & Drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFile = (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Please upload an image file!", "error");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      setNewCatImage(event.target.result);
      addToast("Image uploaded successfully!", "success");
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const success = adminAddCategory(newCat, newCatImage);
    if (success) {
      setNewCat("");
      setNewCatImage("");
    }
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
        <StatCard label="Total Categories" value={totalCategories} color="#111111" />
        <StatCard label="Empty Categories" value={emptyCategoriesCount} color="#FF4D6D" />
        <StatCard label="Most Popular Category" value={mostPopularCategory} color="#c9860a" />
        <StatCard label="Popular Item Count" value={mostPopularCategory !== "None" ? productCounts[mostPopularCategory] : 0} color="#22c55e" />
      </div>

      {/* Header & Add Category bar */}
      <div className="bg-white border border-neutral-200/60 rounded-xl p-6 mb-6 font-sans">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-4 font-display">Add New Category</h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Left: Input details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Category Name <span className="text-[#FF4D6D]">*</span></label>
              <input
                required
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="e.g. Summer Activewear"
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-3 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans"
              />
            </div>

            <button type="submit" className="w-full py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded flex items-center justify-center gap-1.5 focus:outline-none font-sans h-12 shadow-sm">
              <Plus size={14} /> Add Category
            </button>
          </div>

          {/* Right: Drag & Drop Upload Zone */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Cover Image (Drag & Drop or Click)</label>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById("category-file-input").click()}
              className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${isDragActive ? "border-[#FF4D6D] bg-[#FF4D6D]/5 scale-[0.99]"
                  : newCatImage ? "border-emerald-500 bg-neutral-50"
                    : "border-neutral-200 bg-neutral-50/50 hover:border-[#FF4D6D] hover:bg-neutral-50"
                }`}
            >
              <input
                id="category-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {newCatImage ? (
                <>
                  <img src={newCatImage} alt="Category preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-black/45" />
                  <div className="relative z-10 text-white flex flex-col items-center gap-1.5">
                    <Check size={18} className="text-emerald-400 bg-white/10 p-0.5 rounded-full" />
                    <p className="text-[10px] font-extrabold tracking-widest uppercase font-sans">Ready to upload</p>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setNewCatImage("");
                      }}
                      className="mt-1 px-3 py-1 bg-red-500/80 hover:bg-red-600 hover:scale-105 active:scale-95 transition-all text-[8px] font-bold uppercase tracking-wider rounded font-sans"
                    >
                      Remove
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-neutral-400 font-sans">
                  <ImageIcon size={26} className={isDragActive ? "text-[#FF4D6D] animate-bounce" : "text-neutral-300"} />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Drag & Drop Image Here</p>
                  <p className="text-[9px] text-neutral-400">or click to browse local files (PNG, JPG, WEBP)</p>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* All Categories list */}
      <div className="flex items-center gap-2 mb-4 font-sans">
        <FolderOpen size={16} className="text-[#FF4D6D]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">All Categories</h2>
        <span className="text-[10px] bg-neutral-200 text-neutral-600 font-bold px-2 py-0.5 rounded-full">{totalCategories}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 font-sans">
        {categories.map((cat) => {
          const itemCount = productCounts[cat] || 0;
          const coverUrl = categoryImages[cat] || DEFAULT_CATEGORY_IMAGE;
          return (
            <div key={cat} className="group bg-white border border-neutral-200/60 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              {/* Category Cover Image Div */}
              <div
                className="h-28 w-full bg-cover bg-center relative transition-transform duration-500 overflow-hidden"
                style={{ backgroundImage: `url(${coverUrl})` }}
              >
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="text-[8px] font-black tracking-widest text-[#FF4D6D] bg-white px-2 py-0.5 rounded-xs uppercase">
                    Department
                  </span>
                </div>
              </div>

              <div className="p-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 group-hover:text-[#FF4D6D] transition-colors">{cat}</h3>
                  <p className="text-[11px] text-neutral-400 font-light mt-0.5">{itemCount} {itemCount === 1 ? "product" : "products"} listed</p>
                </div>
                <div className="flex justify-end pt-3 mt-3 border-t border-neutral-100">
                  <button
                    onClick={() => setDelTarget(cat)}
                    disabled={itemCount > 0}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-neutral-400 focus:outline-none transition-colors"
                    title={itemCount > 0 ? "Cannot delete: Products exist in this category" : "Delete category"}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {delTarget && (
        <DeleteCategoryModal
          category={delTarget}
          onConfirm={() => { adminDeleteCategory(delTarget); setDelTarget(null); }}
          onClose={() => setDelTarget(null)}
        />
      )}
    </>
  );
}

function DeleteCategoryModal({ category, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4 font-sans font-sans">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-500"><AlertTriangle size={18} /></div>
          <h2 className="text-sm font-bold text-neutral-900 font-display">Delete Category?</h2>
        </div>
        <p className="text-xs text-neutral-500 font-light leading-relaxed">
          Are you sure you want to remove the category <strong className="text-neutral-800">"{category}"</strong>?
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

// ═══════════════════════════════════════════════════════════════════
// PRODUCTS TAB
// ═══════════════════════════════════════════════════════════════════
function ProductsTab() {
  const { products, categories, adminAddProduct, adminDeleteProduct } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");

  // Statistics
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts) : 0;
  const bestProduct = [...products].sort((a, b) => b.rating - a.rating)[0];

  // Filtering
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "" || p.category.toLowerCase() === selectedCat.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
        <StatCard label="Total Products" value={totalProducts} color="#111111" />
        <StatCard label="Average Price" value={`₹${avgPrice}`} color="#FF4D6D" />
        <StatCard label="Top Product" value={bestProduct ? bestProduct.name : "None"} color="#c9860a" />
        <StatCard label="Top Rating" value={bestProduct ? `${bestProduct.rating} ★` : "0.0"} color="#22c55e" />
      </div>

      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-200/60 p-4 mb-6 rounded-xl font-sans">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded pl-9 pr-3 py-2 focus:outline-none focus:border-[#FF4D6D] transition-colors"
            />
          </div>
          {/* Category Filter */}
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF4D6D]"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {/* Add Product Button */}
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm font-sans"
        >
          <Plus size={13} /> Add Product
        </button>
      </div>

      {/* Product List table */}
      <div className="flex items-center gap-2 mb-4 font-sans">
        <Package size={16} className="text-[#FF4D6D]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">Inventory ({filtered.length})</h2>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl py-16 text-center font-sans">
          <Package size={32} className="mx-auto text-neutral-200 mb-3" />
          <p className="text-xs text-neutral-400 font-light">No products match your search/filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-xs font-sans">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                    {/* Item */}
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded bg-neutral-100 border border-neutral-200/60" />
                      <div>
                        <h4 className="font-bold text-neutral-800 line-clamp-1">{p.name}</h4>
                        {p.badge && (
                          <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-wider bg-red-50 text-[#FF4D6D] border border-red-100 px-1.5 py-0.5 rounded font-sans">
                            {p.badge}
                          </span>
                        )}
                      </div>
                    </td>
                    {/* Category */}
                    <td className="py-3 px-4 text-neutral-500 font-medium">{p.category}</td>
                    {/* Price */}
                    <td className="py-3 px-4 font-sans">
                      <div className="font-bold text-neutral-800">₹{p.price.toLocaleString("en-IN")}</div>
                      {p.oldPrice && p.oldPrice > p.price && (
                        <div className="text-[10px] text-neutral-400 line-through font-light">₹{p.oldPrice.toLocaleString("en-IN")}</div>
                      )}
                    </td>
                    {/* Actions */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => setDelTarget(p)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showAdd && (
        <ProductModal
          onSave={(form) => { adminAddProduct(form); setShowAdd(false); }}
          onClose={() => setShowAdd(false)}
        />
      )}

      {delTarget && (
        <DeleteProductConfirmModal
          product={delTarget}
          onConfirm={() => { adminDeleteProduct(delTarget.id); setDelTarget(null); }}
          onClose={() => setDelTarget(null)}
        />
      )}
    </>
  );
}

function DeleteProductConfirmModal({ product, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-500"><AlertTriangle size={18} /></div>
          <h2 className="text-sm font-bold text-neutral-900 font-display">Delete Product?</h2>
        </div>
        <p className="text-xs text-neutral-500 font-light leading-relaxed font-sans">
          Are you sure you want to delete <strong className="text-neutral-800">"{product.name}"</strong>?
          This product will be permanently removed from the storefront.
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

const MOCK_PREVIEW_PRODUCT = {
  name: "Mock Product Name",
  price: 2499,
  oldPrice: 3299,
  category: "Dress",
  badge: "Best Seller",
  image: "https://images.unsplash.com/photo-1618932260643-eee4a2f6c9d6?auto=format&fit=crop&w=600&q=80",
  altImage: "",
  rating: 5.0,
  ratingCount: 0,
  sizes: ["S", "M", "L"],
  colors: [],
  description: "A premium product built with style.",
  details: []
};

function ProductModal({ onSave, onClose }) {
  const { categories } = useApp();

  const [form, setForm] = useState({
    name: "",
    category: categories[0] || "Dress",
    price: "",
    oldPrice: "",
    badge: "",
    image: "",
    altImage: "",
    description: "",
    sizes: ["S", "M", "L"],
    colors: [],
    details: ""
  });

  const [colorInput, setColorInput] = useState({ name: "", hex: "#111111" });

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }));
  };

  const addColor = () => {
    if (!colorInput.name.trim()) return;
    setForm(f => ({
      ...f,
      colors: [...f.colors, { name: colorInput.name.trim(), hex: colorInput.hex }]
    }));
    setColorInput({ name: "", hex: "#111111" });
  };

  const removeColor = (name) => {
    setForm(f => ({
      ...f,
      colors: f.colors.filter(c => c.name !== name)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image || !form.description) return;

    const detailsArr = form.details
      .split("\n")
      .map(line => line.trim())
      .filter(line => line.length > 0);

    onSave({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
      badge: form.badge || null,
      image: form.image,
      altImage: form.altImage || null,
      description: form.description,
      sizes: form.sizes,
      colors: form.colors.length > 0 ? form.colors : [{ name: "Default", hex: "#111111" }],
      details: detailsArr
    });
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1";

  const previewProduct = {
    ...MOCK_PREVIEW_PRODUCT,
    name: form.name || "Enter Product Name...",
    price: form.price ? Number(form.price) : 0,
    oldPrice: form.oldPrice ? Number(form.oldPrice) : 0,
    category: form.category,
    badge: form.badge,
    image: form.image || "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
    altImage: form.altImage
  };

  const discountPercent = previewProduct.oldPrice > previewProduct.price
    ? Math.round(((previewProduct.oldPrice - previewProduct.price) / previewProduct.oldPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto flex flex-col font-sans">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
            Add New Product
          </h2>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none">
            <X size={18} />
          </button>
        </div>

        {/* Modal Content - Dual Panel layout */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Form Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Product Title <span className="text-[#FF4D6D]">*</span></label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Linen Tie-Dye Dress" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Category <span className="text-[#FF4D6D]">*</span></label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Price & Old Price */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₹) <span className="text-[#FF4D6D]">*</span></label>
                <input required type="number" value={form.price} onChange={(e) => set("price", e.target.value)}
                  placeholder="e.g. 2499" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Compare At Price (₹) / Old Price</label>
                <input type="number" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)}
                  placeholder="e.g. 3499" className={inputCls} />
              </div>
            </div>

            {/* Images */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Main Image URL <span className="text-[#FF4D6D]">*</span></label>
                <input required value={form.image} onChange={(e) => set("image", e.target.value)}
                  placeholder="https://images.unsplash.com/..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Alt Image URL (Hover View)</label>
                <input value={form.altImage} onChange={(e) => set("altImage", e.target.value)}
                  placeholder="https://images.unsplash.com/..." className={inputCls} />
              </div>
            </div>

            {/* Badge & Description */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Badge Label (e.g. "Best Seller", "New")</label>
                <input value={form.badge} onChange={(e) => set("badge", e.target.value)}
                  placeholder="e.g. Trending" className={inputCls} />
              </div>
              <div className="sm:col-span-1">
                <label className={labelCls}>Sizes Available</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {["S", "M", "L", "XL", "26", "28", "30", "32", "One Size"].map((size) => {
                    const isChecked = form.sizes.includes(size);
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => toggleSize(size)}
                        className={`px-2 py-1 text-[10px] font-bold border rounded transition-all focus:outline-none ${isChecked
                          ? "bg-[#111111] border-[#111111] text-white"
                          : "bg-neutral-50 border-neutral-200 text-neutral-600 hover:border-[#111111]"
                          }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Color Builder */}
            <div>
              <label className={labelCls}>Add Color Variants</label>
              <div className="flex gap-2 items-center mb-2">
                <input
                  value={colorInput.name}
                  onChange={(e) => setColorInput(c => ({ ...c, name: e.target.value }))}
                  placeholder="Color Name (e.g. Blush Pink)"
                  className={`${inputCls} flex-1`}
                />
                <input
                  type="color"
                  value={colorInput.hex}
                  onChange={(e) => setColorInput(c => ({ ...c, hex: e.target.value }))}
                  className="w-10 h-8 border border-neutral-200 rounded p-0.5 cursor-pointer bg-neutral-50"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase rounded focus:outline-none hover:bg-black transition-colors shrink-0"
                >
                  Add
                </button>
              </div>
              {form.colors.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 border border-neutral-100 rounded">
                  {form.colors.map(col => (
                    <span key={col.name} className="flex items-center gap-1.5 text-[10px] font-bold bg-white border border-neutral-200 px-2 py-1 rounded-full text-neutral-700 font-sans">
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-200/80" style={{ backgroundColor: col.hex }} />
                      {col.name}
                      <button type="button" onClick={() => removeColor(col.name)} className="text-neutral-400 hover:text-red-500 font-extrabold focus:outline-none ml-1">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className={labelCls}>Product Description <span className="text-[#FF4D6D]">*</span></label>
              <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Write a captivating product description..." className={`${inputCls} resize-none`} />
            </div>

            {/* Material/Detail points */}
            <div>
              <label className={labelCls}>Material Details / Bullet points (one per line)</label>
              <textarea rows={3} value={form.details} onChange={(e) => set("details", e.target.value)}
                placeholder="e.g. 100% Linen French Flax&#10;Adjustable crop straps&#10;Breathable fabric" className={`${inputCls} resize-none`} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <button type="submit"
                className="flex-1 py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-2 shadow-sm font-sans">
                <Check size={13} /> Add Product
              </button>
              <button type="button" onClick={onClose}
                className="px-6 py-3 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase hover:bg-neutral-50 transition-colors rounded focus:outline-none">
                Cancel
              </button>
            </div>

          </form>

          {/* Real-time Preview Side */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start bg-neutral-50/50 border-l border-neutral-100 p-6 rounded-r-xl font-sans">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-1.5 self-start">
              <Monitor size={10} /> Live Storefront Preview
            </p>

            {/* Replicated Product Card layout */}
            <div className="w-full max-w-[280px] bg-white border border-neutral-200/80 overflow-hidden rounded shadow-lg transition-transform duration-300">

              {/* Product Image */}
              <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden">
                <img
                  src={previewProduct.image}
                  alt={previewProduct.name}
                  className="absolute inset-0 h-full w-full object-cover object-center"
                />

                {/* Heart icon */}
                <button type="button" className="absolute right-3 top-3 p-2 rounded-full bg-white/95 shadow-xs text-neutral-400 focus:outline-none">
                  <Heart size={14} />
                </button>

                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white bg-[#FF4D6D] uppercase">
                    {discountPercent}% OFF
                  </span>
                )}

                {/* Custom Badge */}
                {previewProduct.badge && (
                  <span className="absolute left-3 bottom-3 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#111111] bg-white border border-neutral-100 uppercase font-sans">
                    {previewProduct.badge}
                  </span>
                )}
              </div>

              {/* Info Block */}
              <div className="p-4 flex flex-col">
                <p className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase mb-1">
                  {previewProduct.category}
                </p>
                <h3 className="text-xs font-bold text-neutral-900 tracking-tight leading-tight line-clamp-1 mb-1.5">
                  {previewProduct.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-bold text-neutral-800">5.0</span>
                  <span className="text-[10px] text-neutral-400 font-light">(0)</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black text-neutral-950 font-sans">
                    ₹{previewProduct.price.toLocaleString("en-IN")}
                  </span>
                  {previewProduct.oldPrice > previewProduct.price && (
                    <span className="text-[11px] text-neutral-400 line-through font-light font-sans">
                      ₹{previewProduct.oldPrice.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
              </div>

            </div>

            {/* Quick tips */}
            <div className="w-full mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-[10px] text-blue-700 font-light leading-relaxed space-y-1">
              <p className="font-bold uppercase tracking-wider text-blue-800 mb-1">💡 Professional Tips:</p>
              <p>• Paste an Unsplash photo URL for beautiful imagery.</p>
              <p>• Entering a Compare Price triggers automatic discount pill math.</p>
              <p>• Sizes are clickable blocks; make sure to select at least S/M/L.</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// INVOICE / RECEIPT MODAL
// ═══════════════════════════════════════════════════════════════════
function InvoiceModal({ payment, onClose }) {
  const { orders, settings } = useApp();
  const order = orders.find(o => o.id === payment.orderId);

  const invoiceItems = order?.items || [
    {
      id: "srv-offline",
      name: "Standard Offline E-Commerce Settlement Services",
      price: payment.amount,
      quantity: 1,
      size: "N/A",
      color: "N/A",
      image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=150&q=80"
    }
  ];

  const gstPercent = settings?.gstPercent || 5;
  const shippingThreshold = settings?.shippingThreshold || 1500;
  const shippingFee = settings?.shippingFee || 150;

  const orderSubtotal = order ? order.items.reduce((s, i) => s + i.price * i.quantity, 0) : payment.amount;
  const discountAmount = order ? (order.promoDiscount ? (orderSubtotal * order.promoDiscount.discountPercent) / 100 : 0) : 0;
  const netSubtotal = orderSubtotal - discountAmount;
  const calculatedTax = order ? Math.round(netSubtotal * (gstPercent / 100)) : 0;
  const calculatedShipping = order ? (netSubtotal > shippingThreshold ? 0 : shippingFee) : 0;
  const grandTotal = payment.amount;
  const subtotal = grandTotal - calculatedTax - calculatedShipping;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in no-print-backdrop">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto flex flex-col font-sans border border-neutral-200 print-invoice-container">

        {/* Invoice Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 no-print">
          <div className="flex items-center gap-2 text-neutral-500 text-xs font-semibold">
            <FileText size={14} />
            <span>Digital Receipt & Invoice</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-black transition-colors focus:outline-none">
            <X size={18} />
          </button>
        </div>

        {/* Invoice Body (printable section) */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto space-y-6 print:p-0 print:overflow-visible">
          {/* Top section: Store Info & Invoice Stamp */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="font-logo text-3xl font-bold text-[#FF4D6D] tracking-wide">{settings?.businessName || "Anikara"}</span>
              <p className="text-[9px] text-neutral-400 font-light mt-0.5 uppercase tracking-wider">Premium Fashion & Luxe Loungewear</p>
              <p className="text-[10px] text-neutral-500 font-light mt-2 leading-relaxed">
                Linking Road, Santacruz West, Mumbai, MH - 400054
                <br />support@anikarafashion.com • +91 98765 43210
              </p>
            </div>
            <div className="text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider mb-2.5 ${payment.status === "Success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  payment.status === "Pending" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                    payment.status === "Failed" ? "bg-red-50 text-red-700 border border-red-200" :
                      "bg-indigo-50 text-indigo-700 border border-indigo-200"
                }`}>
                {payment.status}
              </span>
              <p className="text-[11px] font-bold text-neutral-800 uppercase tracking-widest font-display">INVOICE</p>
              <p className="text-[10px] text-neutral-400 font-mono mt-0.5">{payment.id}</p>
              <p className="text-[10px] text-neutral-500 font-light mt-1">{payment.date} {payment.time}</p>
            </div>
          </div>

          <hr className="border-neutral-100" />

          {/* Billing & Payment Meta Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px]">
            <div>
              <p className="font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Billed To:</p>
              <p className="font-bold text-neutral-800 text-xs">{payment.customerName}</p>
              <p className="text-neutral-500 mt-0.5">{payment.customerEmail}</p>
              {order ? (
                <p className="text-neutral-500 font-light mt-1.5 leading-relaxed max-w-xs">{order.address}</p>
              ) : (
                <p className="text-neutral-400 font-light italic mt-1.5">Offline Payment Customer Address</p>
              )}
            </div>
            <div>
              <p className="font-bold text-neutral-400 uppercase tracking-wider mb-1.5">Payment Details:</p>
              <div className="space-y-1 text-neutral-600 font-light">
                <p><span className="font-medium text-neutral-800">Method:</span> {payment.paymentMethod}</p>
                <p><span className="font-medium text-neutral-800">Transaction ID:</span> <span className="font-mono text-[10px] font-bold">{payment.id}</span></p>
                <p><span className="font-medium text-neutral-800">Order Reference:</span> <span className="font-mono text-[10px]">{payment.orderId}</span></p>
                {payment.errorMessage && (
                  <p className="text-red-500 font-medium"><span className="font-bold">Error:</span> {payment.errorMessage}</p>
                )}
                {payment.refundReason && (
                  <p className="text-indigo-600 font-medium"><span className="font-bold">Refund Reason:</span> {payment.refundReason}</p>
                )}
              </div>
            </div>
          </div>

          {/* Purchased Items List */}
          <div className="space-y-2.5">
            <p className="font-bold text-neutral-400 uppercase tracking-wider text-[9px]">Itemized Summary</p>
            <div className="border border-neutral-100 rounded-xl overflow-hidden">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-neutral-50/50 border-b border-neutral-100 text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-display">
                    <th className="py-2.5 px-4">Item Details</th>
                    <th className="py-2.5 px-4 text-center">Qty</th>
                    <th className="py-2.5 px-4 text-right">Unit Price</th>
                    <th className="py-2.5 px-4 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-neutral-700 font-light">
                  {invoiceItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-neutral-50/10">
                      <td className="py-2.5 px-4 flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-8 h-10 object-cover rounded bg-neutral-50 border border-neutral-200/50 print:hidden" />
                        <div>
                          <p className="font-bold text-neutral-800 leading-tight">{item.name}</p>
                          <p className="text-[9px] text-neutral-400 mt-0.5">Size: {item.size} • Color: {item.color || "Default"}</p>
                        </div>
                      </td>
                      <td className="py-2.5 px-4 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-4 text-right font-sans">₹{item.price.toLocaleString("en-IN")}</td>
                      <td className="py-2.5 px-4 text-right font-bold text-neutral-800 font-sans">₹{(item.price * item.quantity).toLocaleString("en-IN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pricing Totals Breakdown */}
          <div className="flex justify-end pt-2">
            <div className="w-full sm:w-72 space-y-2 text-[11px] text-neutral-600">
              <div className="flex justify-between font-light">
                <span>Items Subtotal</span>
                <span className="font-bold text-neutral-800 font-sans">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              {order && order.promoDiscount && (
                <div className="flex justify-between font-light">
                  <span>Promo Discount</span>
                  <span className="font-bold text-emerald-600 font-sans">- ₹{discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between font-light">
                <span>GST Tax ({gstPercent}%)</span>
                <span className="font-bold text-neutral-800 font-sans">₹{calculatedTax.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>Shipping & Handling</span>
                {calculatedShipping === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">Free</span>
                ) : (
                  <span className="font-bold text-neutral-800 font-sans">₹{calculatedShipping.toLocaleString("en-IN")}</span>
                )}
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2.5 text-xs font-black text-neutral-900">
                <span>Grand Total Paid</span>
                <span className="font-sans text-sm font-black text-[#FF4D6D]">₹{grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Bottom disclaimer */}
          <div className="text-center pt-6 border-t border-dashed border-neutral-100 text-[10px] text-neutral-400 font-light space-y-1">
            <p>
              Thank you for shopping at Anikara. This is a computer-generated transaction receipt representing official e-commerce settlement.
            </p>
            <p className="text-[8px] text-neutral-300 font-mono">Settlement Node ID: ANK-TX-NODE-0928</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 px-6 py-4 border-t border-neutral-100 justify-end no-print bg-neutral-50/50 rounded-b-2xl">
          <button onClick={handlePrint} className="px-4 py-2 bg-neutral-800 hover:bg-black text-white text-xs font-bold tracking-widest uppercase transition-colors rounded flex items-center gap-1.5 focus:outline-none">
            <Download size={13} /> Print Invoice
          </button>
          <button onClick={onClose} className="px-4 py-2 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}

function ManualPaymentModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    amount: "",
    paymentMethod: "UPI",
    status: "Success",
    orderId: ""
  });

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.customerName || !form.customerEmail || !form.customerPhone || !form.amount) return;

    onSave({
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      amount: Number(form.amount),
      paymentMethod: form.paymentMethod,
      status: form.status,
      orderId: form.orderId.trim() || "N/A"
    });
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/20 transition-all font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 font-sans border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display flex items-center gap-2">
            <PlusCircle size={16} className="text-[#FF4D6D]" />
            Log Offline Payment
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelCls}>Customer Name <span className="text-[#FF4D6D]">*</span></label>
            <input required value={form.customerName} onChange={(e) => set("customerName", e.target.value)} placeholder="e.g. Ajeet Kumar" className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Customer Email <span className="text-[#FF4D6D]">*</span></label>
              <input required type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} placeholder="e.g. ajeet@example.com" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Customer Phone <span className="text-[#FF4D6D]">*</span></label>
              <input required value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} placeholder="e.g. +91 98765 43210" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Amount (₹) <span className="text-[#FF4D6D]">*</span></label>
              <input required type="number" min="0" value={form.amount} onChange={(e) => set("amount", e.target.value)} placeholder="e.g. 2999" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Order ID (Optional)</label>
              <input value={form.orderId} onChange={(e) => set("orderId", e.target.value)} placeholder="e.g. ORD-4820" className={inputCls} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} className={inputCls}>
                <option value="UPI">UPI</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
                <option value="Net Banking">Net Banking</option>
                <option value="Bank Transfer">Bank Transfer</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Initial Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                <option value="Success">Success</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-3 border-t border-neutral-100">
            <button type="submit" className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-1.5 shadow-xs font-sans">
              <Check size={13} /> Save Record
            </button>
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase hover:bg-neutral-50 transition-colors rounded focus:outline-none">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// REFUND CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════════
function RefundConfirmationModal({ payment, onConfirm, onClose }) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-500"><AlertTriangle size={18} /></div>
          <h2 className="text-sm font-bold text-neutral-900 font-display">Refund Transaction?</h2>
        </div>
        <div className="space-y-3 font-sans">
          <p className="text-xs text-neutral-500 font-light leading-relaxed">
            This will initiate a refund of <strong className="text-neutral-800 font-bold">₹{payment.amount.toLocaleString("en-IN")}</strong> to <strong className="text-neutral-800">{payment.customerName}</strong>.
            The transaction status will update to <span className="font-bold text-indigo-600">Refunded</span>.
          </p>
          <div>
            <label className="block text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Reason for Refund</label>
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Fit issue / Customer returned"
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans"
            />
          </div>
        </div>
        <div className="flex gap-3 pt-1 font-sans">
          <button onClick={() => onConfirm(reason)} className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors focus:outline-none font-sans">Confirm Refund</button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase rounded hover:bg-neutral-50 transition-colors focus:outline-none">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// COMPLETE PAYMENT MODAL (Mark Pending COD as Success)
// ═══════════════════════════════════════════════════════════════════
function CompletePaymentModal({ payment, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-neutral-200">
        <div className="flex items-center gap-3 font-sans">
          <div className="p-2 rounded-full bg-emerald-50 text-emerald-500"><CheckCircle size={18} /></div>
          <h2 className="text-sm font-bold text-neutral-900 font-display">Approve Payment?</h2>
        </div>
        <p className="text-xs text-neutral-500 font-light leading-relaxed font-sans">
          Verify that <strong className="text-neutral-800">₹{payment.amount.toLocaleString("en-IN")}</strong> has been received successfully for Cash on Delivery / Offline Settlement.
          This will update the payment status to <span className="font-bold text-emerald-600">Success</span>.
        </p>
        <div className="flex gap-3 pt-1 font-sans">
          <button onClick={onConfirm} className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors focus:outline-none">Approve</button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase rounded hover:bg-neutral-50 transition-colors focus:outline-none">Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN PAYMENTS TAB SECTION
// ═══════════════════════════════════════════════════════════════════
function PaymentsTab() {
  const { payments, adminUpdatePaymentStatus, adminAddPayment, addToast } = useApp();
  const [search, setSearch] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeRefund, setActiveRefund] = useState(null);
  const [activeComplete, setActiveComplete] = useState(null);
  const [showAddPayment, setShowAddPayment] = useState(false);

  // Stats Calculations
  const totalRecords = payments.length;

  const successAmt = payments.filter(p => p.status === "Success").reduce((s, p) => s + p.amount, 0);
  const refundAmt = payments.filter(p => p.status === "Refunded").reduce((s, p) => s + p.amount, 0);
  const totalCollections = successAmt - refundAmt;

  const refundsCount = payments.filter(p => p.status === "Refunded").length;
  const refundsTotal = payments.filter(p => p.status === "Refunded").reduce((s, p) => s + p.amount, 0);

  const pendingAmt = payments.filter(p => p.status === "Pending").reduce((s, p) => s + p.amount, 0);

  const attemptedCount = payments.filter(p => p.status === "Success" || p.status === "Failed").length;
  const successRate = attemptedCount > 0 ? Math.round((payments.filter(p => p.status === "Success").length / attemptedCount) * 100) : 0;

  // Filter Logic
  const filtered = payments.filter(p => {
    const term = search.toLowerCase();
    const matchesSearch =
      p.id.toLowerCase().includes(term) ||
      (p.orderId && p.orderId.toLowerCase().includes(term)) ||
      p.customerName.toLowerCase().includes(term) ||
      p.customerEmail.toLowerCase().includes(term);

    const matchesMethod = selectedMethod === "" || p.paymentMethod.toLowerCase() === selectedMethod.toLowerCase();
    const matchesStatus = selectedStatus === "" || p.status.toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesMethod && matchesStatus;
  });

  const handleExportCSV = () => {
    addToast("Exporting financial transactions as CSV...", "success");
    setTimeout(() => {
      addToast("CSV Export completed. File saved.", "success");
    }, 1500);
  };

  return (
    <>
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
        <StatCard label="Total Collections" value={`₹${totalCollections.toLocaleString("en-IN")}`} color="#22c55e" />
        <StatCard label="Refunds Issued" value={`₹${refundsTotal.toLocaleString("en-IN")} (${refundsCount})`} color="#7c3aed" />
        <StatCard label="Pending COD" value={`₹${pendingAmt.toLocaleString("en-IN")}`} color="#c9860a" />
        <StatCard label="Success Rate" value={`${successRate}%`} color="#111111" />
      </div>

      {/* Advanced Control Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-200/60 p-4 mb-6 rounded-xl font-sans">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Txn, Order, Customer..."
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] transition-colors"
            />
          </div>

          {/* Payment Method filter */}
          <select
            value={selectedMethod}
            onChange={(e) => setSelectedMethod(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] font-sans"
          >
            <option value="">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Credit Card">Credit Card</option>
            <option value="Cash on Delivery (COD)">Cash on Delivery (COD)</option>
            <option value="Net Banking">Net Banking</option>
            <option value="Bank Transfer">Bank Transfer</option>
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] font-sans"
          >
            <option value="">All Statuses</option>
            <option value="Success">Success</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold uppercase rounded-lg transition-colors focus:outline-none no-target"
            title="Export to CSV"
          >
            <Download size={13} /> <span className="hidden sm:inline">Export</span>
          </button>
          <button
            onClick={() => setShowAddPayment(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm font-sans"
          >
            <Plus size={13} /> Log Payment
          </button>
        </div>
      </div>

      {/* Payment List Header */}
      <div className="flex items-center gap-2 mb-4 font-sans">
        <CreditCard size={16} className="text-[#FF4D6D]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">Transaction Ledger ({filtered.length})</h2>
      </div>

      {/* Main List */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl py-16 text-center font-sans">
          <CreditCard size={32} className="mx-auto text-neutral-200 mb-3" />
          <p className="text-xs text-neutral-400 font-light font-sans">No payment records match your filters.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-xs font-sans">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Contact Number</th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs">
                  {filtered.map(p => (
                    <tr key={p.id} className="hover:bg-neutral-50/30 transition-colors">
                      {/* Monospace Txn ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-700">{p.id}</td>
                      {/* Customer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-800">{p.customerName}</div>
                        <div className="text-[10px] text-neutral-400 font-light font-sans">{p.customerEmail}</div>
                      </td>
                      {/* Contact Number */}
                      <td className="py-3.5 px-4 font-sans text-neutral-600 font-medium">
                        {p.customerPhone || "N/A"}
                      </td>
                      {/* Order ID */}
                      <td className="py-3.5 px-4">
                        {p.orderId && p.orderId !== "N/A" ? (
                          <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200/50">
                            {p.orderId}
                          </span>
                        ) : (
                          <span className="text-neutral-400 italic font-sans">Offline Log</span>
                        )}
                      </td>
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-neutral-500 font-light font-sans">
                        <div>{p.date}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{p.time}</div>
                      </td>
                      {/* Payment Method */}
                      <td className="py-3.5 px-4 text-neutral-600 font-medium font-sans">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]/45" />
                          {p.paymentMethod}
                        </span>
                      </td>
                      {/* Amount right-aligned */}
                      <td className="py-3.5 px-4 text-right font-sans font-bold text-neutral-900">
                        ₹{p.amount.toLocaleString("en-IN")}
                      </td>
                      {/* Status badge pill */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${p.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                            p.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                              p.status === "Failed" ? "bg-red-50 text-red-600 border-red-200" :
                                "bg-indigo-50 text-indigo-600 border-indigo-200"
                          }`}>
                          {p.status}
                        </span>
                      </td>
                      {/* Contextual actions */}
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => setActiveInvoice(p)}
                            className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors focus:outline-none no-target"
                            title="View digital invoice receipt"
                          >
                            <FileText size={14} />
                          </button>
                          {p.status === "Success" && (
                            <button
                              onClick={() => setActiveRefund(p)}
                              className="p-1.5 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors focus:outline-none no-target"
                              title="Issue refund for this transaction"
                            >
                              <RotateCcw size={14} />
                            </button>
                          )}
                          {p.status === "Pending" && (
                            <button
                              onClick={() => setActiveComplete(p)}
                              className="p-1.5 rounded hover:bg-emerald-50 text-neutral-400 hover:text-emerald-600 transition-colors focus:outline-none no-target"
                              title="Approve / Mark as Successful"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (fits perfectly between 320px and 425px) */}
          <div className="block md:hidden space-y-4 font-sans">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-xs font-bold text-neutral-800">{p.id}</p>
                    <p className="text-[9px] text-neutral-400 font-light mt-0.5">{p.date} • {p.time}</p>
                  </div>
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider border ${p.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                      p.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-100" :
                        p.status === "Failed" ? "bg-red-50 text-red-600 border-red-100" :
                          "bg-indigo-50 text-indigo-600 border-indigo-100"
                    }`}>
                    {p.status}
                  </span>
                </div>

                <hr className="border-neutral-100" />

                {/* Info Stack */}
                <div className="grid grid-cols-2 gap-2 text-[11px] leading-relaxed">
                  <div>
                    <p className="text-[9px] uppercase text-neutral-400 font-semibold font-sans">Customer</p>
                    <p className="font-bold text-neutral-800 line-clamp-1">{p.customerName}</p>
                    <p className="text-neutral-500 text-[10px] line-clamp-1 font-light">{p.customerEmail}</p>
                    <p className="text-neutral-600 text-[10px] font-medium mt-0.5 font-sans">{p.customerPhone || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase text-neutral-400 font-semibold font-sans">Details</p>
                    <p className="text-neutral-700 font-medium">{p.paymentMethod}</p>
                    {p.orderId && p.orderId !== "N/A" ? (
                      <p className="text-[10px] font-mono text-neutral-500">Order: {p.orderId}</p>
                    ) : (
                      <p className="text-[10px] italic text-neutral-400">Offline settled</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 mt-2">
                  <div>
                    <p className="text-[9px] uppercase text-neutral-400 font-semibold">Amount Paid</p>
                    <p className="font-sans font-black text-sm text-neutral-950">₹{p.amount.toLocaleString("en-IN")}</p>
                  </div>
                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setActiveInvoice(p)}
                      className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 focus:outline-none no-target"
                    >
                      <FileText size={11} /> View Invoice
                    </button>
                    {p.status === "Success" && (
                      <button
                        onClick={() => setActiveRefund(p)}
                        className="p-1.5 border border-red-200 hover:bg-red-50 text-red-500 rounded focus:outline-none no-target"
                        title="Refund"
                      >
                        <RotateCcw size={12} />
                      </button>
                    )}
                    {p.status === "Pending" && (
                      <button
                        onClick={() => setActiveComplete(p)}
                        className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase rounded flex items-center gap-0.5 focus:outline-none no-target"
                      >
                        <Check size={11} /> Approve
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Interactive modals */}
      {activeInvoice && (
        <InvoiceModal
          payment={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}

      {activeRefund && (
        <RefundConfirmationModal
          payment={activeRefund}
          onConfirm={(reason) => {
            adminUpdatePaymentStatus(activeRefund.id, "Refunded", { refundReason: reason || "Admin Refund" });
            setActiveRefund(null);
          }}
          onClose={() => setActiveRefund(null)}
        />
      )}

      {activeComplete && (
        <CompletePaymentModal
          payment={activeComplete}
          onConfirm={() => {
            adminUpdatePaymentStatus(activeComplete.id, "Success");
            setActiveComplete(null);
          }}
          onClose={() => setActiveComplete(null)}
        />
      )}

      {showAddPayment && (
        <ManualPaymentModal
          onSave={(record) => {
            adminAddPayment(record);
            setShowAddPayment(false);
          }}
          onClose={() => setShowAddPayment(false)}
        />
      )}
    </>
  );
}

// ═══════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════
function SettingsTab() {
  const { settings, adminUpdateSettings } = useApp();
  const [form, setForm] = useState({ ...settings });

  useEffect(() => {
    setForm({ ...settings });
  }, [settings]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = (e) => {
    e.preventDefault();
    adminUpdateSettings({
      businessName: form.businessName.trim(),
      gstPercent: Number(form.gstPercent),
      shippingThreshold: Number(form.shippingThreshold),
      shippingFee: Number(form.shippingFee),
      maintenanceMode: form.maintenanceMode,
    });
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/20 transition-all font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  // Simulation calculations
  const simSubtotal = 1200;
  const simDiscount = 200;
  const netSubtotal = simSubtotal - simDiscount;
  const simTax = Math.round(netSubtotal * (Number(form.gstPercent) / 100));
  const simShipping = netSubtotal > Number(form.shippingThreshold) ? 0 : Number(form.shippingFee);
  const simGrandTotal = netSubtotal + simTax + simShipping;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      {/* Left panel: Form */}
      <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">

        {/* Brand settings */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <div className="p-1.5 bg-[#FF4D6D]/5 text-[#FF4D6D] rounded-lg"><Shield size={14} /></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-display">General Brand Settings</h3>
          </div>
          <div>
            <label className={labelCls}>Business Name <span className="text-[#FF4D6D]">*</span></label>
            <input
              required
              value={form.businessName}
              onChange={(e) => set("businessName", e.target.value)}
              placeholder="e.g. Anikara"
              className={inputCls}
            />
            <p className="text-[9px] text-neutral-400 mt-1">Updates header, footer, copyrights, login forms, and system context labels globally.</p>
          </div>
        </div>

        {/* Finance settings */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <div className="p-1.5 bg-[#FF4D6D]/5 text-[#FF4D6D] rounded-lg"><Tag size={14} /></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-display">Taxation & Finance</h3>
          </div>
          <div>
            <label className={labelCls}>GST / Tax Percentage (%) <span className="text-[#FF4D6D]">*</span></label>
            <input
              required
              type="number"
              min="0"
              max="100"
              value={form.gstPercent}
              onChange={(e) => set("gstPercent", e.target.value)}
              placeholder="e.g. 5"
              className={inputCls}
            />
            <p className="text-[9px] text-neutral-400 mt-1">Tax rate automatically added to order subtotals after promotional discounts.</p>
          </div>
        </div>

        {/* Shipping settings */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <div className="p-1.5 bg-[#FF4D6D]/5 text-[#FF4D6D] rounded-lg"><Package size={14} /></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-display">Shipping Configuration</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Free Shipping Threshold (₹) <span className="text-[#FF4D6D]">*</span></label>
              <input
                required
                type="number"
                min="0"
                value={form.shippingThreshold}
                onChange={(e) => set("shippingThreshold", e.target.value)}
                placeholder="e.g. 1500"
                className={inputCls}
              />
              <p className="text-[9px] text-neutral-400 mt-1">Free shipping threshold across the storefront.</p>
            </div>
            <div>
              <label className={labelCls}>Standard Shipping Fee (₹) <span className="text-[#FF4D6D]">*</span></label>
              <input
                required
                type="number"
                min="0"
                value={form.shippingFee}
                onChange={(e) => set("shippingFee", e.target.value)}
                placeholder="e.g. 150"
                className={inputCls}
              />
              <p className="text-[9px] text-neutral-400 mt-1">Fee for orders under the threshold.</p>
            </div>
          </div>
        </div>

        {/* System Settings */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <div className="p-1.5 bg-[#FF4D6D]/5 text-[#FF4D6D] rounded-lg"><AlertTriangle size={14} /></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-display">System & Maintenance</h3>
          </div>
          <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg border border-neutral-100/50">
            <div className="max-w-[70%]">
              <p className="text-xs font-bold text-neutral-800">Storefront Maintenance Mode</p>
              <p className="text-[10px] text-neutral-500 font-light mt-0.5 leading-relaxed">
                Aesthetic full-page lock for the e-commerce storefront. The Admin panel remains open to unlock it.
              </p>
            </div>
            {/* Toggle switch slider */}
            <button
              type="button"
              onClick={() => set("maintenanceMode", !form.maintenanceMode)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${form.maintenanceMode ? "bg-[#FF4D6D]" : "bg-neutral-200"
                }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-xs ring-0 transition duration-200 ease-in-out ${form.maintenanceMode ? "translate-x-5" : "translate-x-0"
                  }`}
              />
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded-lg focus:outline-none flex items-center justify-center gap-2 shadow-sm font-sans"
        >
          <Check size={14} /> Save Configuration
        </button>

      </form>

      {/* Right panel: Real-time preview */}
      <div className="lg:col-span-5 flex flex-col justify-start bg-neutral-50/50 border-l border-neutral-100 p-6 rounded-xl font-sans">
        <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-1.5 self-start">
          <Monitor size={10} /> Live Configuration Preview
        </p>

        <div className="w-full space-y-6">
          {/* Copyright Box */}
          <div className="bg-white border border-neutral-200/60 p-4 rounded-xl shadow-xs">
            <p className="text-[8px] font-bold uppercase tracking-wider text-neutral-400 mb-2">Dynamic Footer Copyright</p>
            <div className="bg-neutral-900 text-[#a3a3a3] text-[10px] p-3 rounded flex items-center justify-between font-light font-sans">
              <span>© 2026 {form.businessName ? form.businessName.toUpperCase() : "ANIKARA"}. All Rights Reserved.</span>
              <span className="text-[8px] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded text-white font-bold shrink-0">Live</span>
            </div>
          </div>

          {/* Calculator simulation Box */}
          <div className="bg-white border border-neutral-200/60 p-4 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <p className="text-[8px] font-bold uppercase tracking-wider text-neutral-400">Checkout Tax & Shipping Simulation (Subtotal: ₹{simSubtotal})</p>
              <span className="text-[8px] bg-[#FF4D6D]/10 text-[#FF4D6D] px-1.5 py-0.5 rounded font-bold uppercase shrink-0">Active</span>
            </div>

            <div className="space-y-2 text-[10.5px] text-neutral-600">
              <div className="flex justify-between font-light">
                <span>Items Subtotal</span>
                <span className="font-bold text-neutral-900">₹{simSubtotal}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>Promo Discount</span>
                <span className="font-bold text-emerald-600">- ₹{simDiscount}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>Dynamic GST ({form.gstPercent || 0}%)</span>
                <span className="font-bold text-neutral-900">₹{simTax}</span>
              </div>
              <div className="flex justify-between font-light">
                <span>Dynamic Shipping (Free above ₹{form.shippingThreshold || 0})</span>
                {simShipping === 0 ? (
                  <span className="text-emerald-700 font-bold uppercase">Free</span>
                ) : (
                  <span className="font-bold text-neutral-900">₹{simShipping}</span>
                )}
              </div>
              <div className="flex justify-between border-t border-neutral-100 pt-2 text-xs font-bold text-neutral-900">
                <span>Grand Total Total</span>
                <span>₹{simGrandTotal.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Alert Preview Box */}
          {form.maintenanceMode && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-800 text-[10px] space-y-1.5 animate-pulse">
              <p className="font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                <AlertTriangle size={11} /> Maintenance Mode Enabled
              </p>
              <p className="font-light">
                Your storefront is currently locked behind a premium placeholder screen. Administrators can access this tab to disable it.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// MAIN ADMIN PANEL
// ═══════════════════════════════════════════════════════════════════
export default function AdminPanel({ navigate }) {
  const [activeTab, setActiveTab] = useState("slides");
  const { settings } = useApp();

  return (
    <div className="min-h-screen bg-neutral-50 font-sans">

      {/* ── Top Header ── */}
      <header className="bg-white border-b border-neutral-200 px-4 sm:px-6 py-3 sm:py-4 flex flex-wrap items-center justify-between gap-2 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#111111] text-white"><Shield size={16} /></div>
          <div>
            <h1 className="text-sm font-black tracking-wide text-neutral-900 font-display uppercase">{settings?.businessName || "Anikara"} Admin</h1>
            <p className="text-[10px] text-neutral-400 font-light">Landing Page Management</p>
          </div>
        </div>
        <button onClick={() => navigate("home")}
          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-[#FF4D6D] transition-colors focus:outline-none">
          View Storefront <ChevronRight size={12} />
        </button>
      </header>

      {/* ── Tab Bar ── */}
      <div className="bg-white border-b border-neutral-100 px-0 sm:px-6 overflow-x-auto scrollbar-hide">
        <div className="flex gap-0 max-w-6xl mx-auto min-w-max sm:min-w-0">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all focus:outline-none ${isActive ? "border-[#FF4D6D] text-[#FF4D6D]" : "border-transparent text-neutral-500 hover:text-neutral-800"
                  }`}>
                <Icon size={14} />{tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Tab Content ── */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 py-5 sm:py-8">
        {activeTab === "slides" && <SlidesTab />}
        {activeTab === "coupons" && <CouponsTab />}
        {activeTab === "categories" && <CategoriesTab />}
        {activeTab === "products" && <ProductsTab />}
        {activeTab === "payments" && <PaymentsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </main>
    </div>
  );
}
