import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus, Trash2, X, Check, AlertTriangle, Search, Heart, Star,
  Monitor, Package, Flame, Clock, Sparkles, LayoutGrid
} from "lucide-react";
import { StatCard } from "./AdminShared";

// ═══════════════════════════════════════════════════════════════════
// PRODUCTS TAB
// ═══════════════════════════════════════════════════════════════════

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
  details: [],
  displaySection: "all"
};

// Section options with icons and descriptions
const SECTION_OPTIONS = [
  { 
    id: "all", 
    label: "All Sections", 
    icon: LayoutGrid, 
    description: "Product appears in all sections",
    color: "#6B7280"
  },
  { 
    id: "deals", 
    label: "Deals of the Day", 
    icon: Clock, 
    description: "Shows in daily deals carousel",
    color: "#FF4D6D"
  },
  { 
    id: "trending", 
    label: "Trending", 
    icon: Flame, 
    description: "Shows in trending section",
    color: "#F59E0B"
  },
  { 
    id: "new_arrivals", 
    label: "New Arrivals", 
    icon: Sparkles, 
    description: "Shows in new arrivals section",
    color: "#10B981"
  }
];

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

function ProductModal({ onSave, onClose, editingProduct = null }) {
  const { categories } = useApp();

  const [form, setForm] = useState({
    name: editingProduct?.name || "",
    category: editingProduct?.category || categories[0] || "Dress",
    price: editingProduct?.price || "",
    oldPrice: editingProduct?.oldPrice || "",
    badge: editingProduct?.badge || "",
    image: editingProduct?.image || "",
    altImage: editingProduct?.altImage || "",
    description: editingProduct?.description || "",
    sizes: editingProduct?.sizes || ["S", "M", "L"],
    colors: editingProduct?.colors || [],
    details: editingProduct?.details?.join("\n") || "",
    displaySection: editingProduct?.displaySection || "all"
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
      ...(editingProduct?.id && { id: editingProduct.id }),
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
      details: detailsArr,
      displaySection: form.displaySection
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

  const selectedSection = SECTION_OPTIONS.find(s => s.id === form.displaySection);
  const SectionIcon = selectedSection?.icon || LayoutGrid;
  const discountPercent = previewProduct.oldPrice > previewProduct.price
    ? Math.round(((previewProduct.oldPrice - previewProduct.price) / previewProduct.oldPrice) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto flex flex-col">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
            {editingProduct ? "Edit Product" : "Add New Product"}
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

            {/* Section Selection - NEW SECTION */}
            <div className="bg-gradient-to-r from-neutral-50 to-white p-4 rounded-lg border border-neutral-200">
              <label className={`${labelCls} flex items-center gap-2`}>
                <LayoutGrid size={12} className="text-[#FF4D6D]" />
                Display Section <span className="text-[#FF4D6D]">*</span>
              </label>
              <p className="text-[9px] text-neutral-400 mb-3">Choose where this product will appear on the storefront</p>
              
              <div className="grid grid-cols-2 gap-3">
                {SECTION_OPTIONS.map((section) => {
                  const Icon = section.icon;
                  const isSelected = form.displaySection === section.id;
                  return (
                    <button
                      key={section.id}
                      type="button"
                      onClick={() => set("displaySection", section.id)}
                      className={`
                        relative p-3 rounded-lg border-2 transition-all text-left
                        ${isSelected 
                          ? 'border-[#FF4D6D] bg-[#FF4D6D]/5 shadow-sm' 
                          : 'border-neutral-200 bg-white hover:border-neutral-300'}
                      `}
                    >
                      <div className="flex items-start gap-2">
                        <div 
                          className="p-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: isSelected ? `${section.color}20` : '#F3F4F6' }}
                        >
                          <Icon size={16} style={{ color: isSelected ? section.color : '#9CA3AF' }} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className={`text-xs font-bold ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                              {section.label}
                            </span>
                            {isSelected && (
                              <Check size={12} className="text-[#FF4D6D]" />
                            )}
                          </div>
                          <p className="text-[9px] text-neutral-400 mt-0.5">{section.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
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

            {/* Badge & Sizes */}
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
                placeholder={"e.g. 100% Linen French Flax\nAdjustable crop straps\nBreathable fabric"} className={`${inputCls} resize-none`} />
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-neutral-100">
              <button type="submit"
                className="flex-1 py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-2 shadow-sm font-sans">
                <Check size={13} /> {editingProduct ? "Update Product" : "Add Product"}
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

            {/* Section Badge Preview */}
            <div className="w-full max-w-[280px] mb-3 flex justify-center">
              <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold" 
                style={{ 
                  backgroundColor: `${selectedSection?.color}15`, 
                  color: selectedSection?.color 
                }}>
                <SectionIcon size={10} />
                <span>Will appear in: {selectedSection?.label}</span>
              </div>
            </div>

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

                {/* Section Indicator Overlay */}
                <div className="absolute right-3 bottom-3">
                  <div className="p-1.5 rounded-full bg-white/95 shadow-sm">
                    <SectionIcon size={12} style={{ color: selectedSection?.color }} />
                  </div>
                </div>

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
              <p>• Select a display section to control where your product appears</p>
              <p>• "Deals of the Day" products will show discount badges</p>
              <p>• "New Arrivals" get a special badge on the storefront</p>
              <p>• "Trending" products appear in the hot picks section</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default function ProductsTab() {
  const { products, categories, adminAddProduct, adminDeleteProduct } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");

  // Statistics
  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts) : 0;
  const bestProduct = [...products].sort((a, b) => b.rating - a.rating)[0];

  // Get section counts
  const getSectionCount = (sectionId) => {
    if (sectionId === "all") return products.length;
    return products.filter(p => p.displaySection === sectionId).length;
  };

  // Filtering
  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === "" || p.category.toLowerCase() === selectedCat.toLowerCase();
    const matchesSection = selectedSection === "all" || p.displaySection === selectedSection;
    return matchesSearch && matchesCat && matchesSection;
  });

  const getSectionIcon = (sectionId) => {
    const section = SECTION_OPTIONS.find(s => s.id === sectionId);
    if (!section) return LayoutGrid;
    return section.icon;
  };

  const getSectionColor = (sectionId) => {
    const section = SECTION_OPTIONS.find(s => s.id === sectionId);
    return section?.color || "#6B7280";
  };

  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
        <StatCard label="Total Products" value={totalProducts} color="#111111" />
        <StatCard label="Average Price" value={`₹${avgPrice}`} color="#FF4D6D" />
        <StatCard label="Top Product" value={bestProduct ? bestProduct.name : "None"} color="#c9860a" />
        <StatCard label="Top Rating" value={bestProduct ? `${bestProduct.rating} ★` : "0.0"} color="#22c55e" />
      </div>

      {/* Section Quick Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {SECTION_OPTIONS.map(section => {
          const Icon = section.icon;
          const count = getSectionCount(section.id);
          return (
            <div 
              key={section.id}
              className="bg-white border border-neutral-200 rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSection(section.id)}
              style={{ 
                borderColor: selectedSection === section.id ? section.color : undefined,
                backgroundColor: selectedSection === section.id ? `${section.color}08` : undefined
              }}
            >
              <Icon size={18} style={{ color: section.color }} className="mx-auto mb-1" />
              <p className="text-[10px] font-bold text-neutral-600">{section.label}</p>
              <p className="text-lg font-black text-neutral-800">{count}</p>
            </div>
          );
        })}
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
          {/* Section Filter Badge */}
          {selectedSection !== "all" && (
            <div className="flex items-center gap-2 px-2 py-1 bg-neutral-100 rounded-lg">
              <span className="text-[10px] font-medium text-neutral-600">Filtering by:</span>
              <button
                onClick={() => setSelectedSection("all")}
                className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md text-xs font-medium"
              >
                {selectedSection.replace("_", " ").toUpperCase()}
                <X size={12} />
              </button>
            </div>
          )}
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
                  <th className="py-3 px-4">Display Section</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-xs">
                {filtered.map(p => {
                  const SectionIcon = getSectionIcon(p.displaySection);
                  const sectionColor = getSectionColor(p.displaySection);
                  return (
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
                      {/* Display Section */}
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold"
                          style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}>
                          <SectionIcon size={10} />
                          {SECTION_OPTIONS.find(s => s.id === p.displaySection)?.label || "All Sections"}
                        </span>
                      </td>
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
                  );
                })}
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