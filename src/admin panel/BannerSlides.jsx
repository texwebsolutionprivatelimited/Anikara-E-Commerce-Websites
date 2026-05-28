import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus, Pencil, Trash2, X, Check, Eye, EyeOff,
  Image as ImageIcon, ChevronUp, ChevronDown, Monitor, LayoutTemplate
} from "lucide-react";
import { StatCard, DeleteModal } from "./AdminShared";

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
// SLIDES TAB
// ═══════════════════════════════════════════════════════════════════
export default function SlidesTab() {
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
