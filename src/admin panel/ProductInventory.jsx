import React, { useState, useCallback } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus, Trash2, X, Check, AlertTriangle, Search, Heart, Star, Pencil,
  Monitor, Package, Flame, Clock, Sparkles, LayoutGrid, Upload, Image as ImageIcon,
  HelpCircle, Boxes, MessageSquare, Pipette
} from "lucide-react";
import { StatCard } from "./AdminShared";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

// Section options - products will ONLY appear in their assigned section
const SECTION_OPTIONS = [
  { 
    id: "deals", 
    label: "Deals of the Day", 
    icon: Clock, 
    description: "Shows ONLY in daily deals carousel",
    color: "#FF4D6D"
  },
  { 
    id: "trending", 
    label: "Trending", 
    icon: Flame, 
    description: "Shows ONLY in trending section",
    color: "#F59E0B"
  },
  { 
    id: "new_arrivals", 
    label: "New Arrivals", 
    icon: Sparkles, 
    description: "Shows ONLY in new arrivals section",
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

// Image upload component with drag & drop
function ImageUploader({ currentImage, onImageChange, label, required, isPickingColor, onImageClick }) {
  const { uploadToImageKit } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentImage || "");
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    setPreviewUrl(currentImage || "");
  }, [currentImage]);

  const handleFile = async (file) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      try {
        const cdnUrl = await uploadToImageKit(file);
        setPreviewUrl(cdnUrl);
        onImageChange(cdnUrl);
      } catch (err) {
        console.error(err);
        alert("Image upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isUploading) return;
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFile(file);
    }
  }, [isUploading]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    if (isUploading) return;
    setIsDragging(true);
  }, [isUploading]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleClickUpload = () => {
    if (isUploading || isPickingColor) return;
    fileInputRef.current?.click();
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFile(file);
    }
  };

  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1">
        {label} {required && <span className="text-[#FF4D6D]">*</span>}
      </label>
      
      <div
        onClick={handleClickUpload}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`
          relative w-full min-h-[160px] rounded-lg border-2 border-dashed transition-all cursor-pointer
          ${isDragging 
            ? 'border-[#FF4D6D] bg-[#FF4D6D]/5' 
            : previewUrl 
              ? 'border-neutral-200 bg-neutral-50' 
              : 'border-neutral-200 hover:border-[#FF4D6D]/50 hover:bg-neutral-50'
          }
        `}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center min-h-[160px] animate-pulse">
            <div className="w-8 h-8 border-2 border-[#FF4D6D] border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold text-neutral-800">Uploading to ImageKit...</p>
            <p className="text-[9px] text-neutral-400 mt-1">Please wait a moment</p>
          </div>
        ) : previewUrl ? (
          <div className="relative w-full h-full min-h-[160px] group flex items-center justify-center p-2">
            <img 
              src={previewUrl} 
              alt="Preview" 
              crossOrigin="anonymous"
              className={`w-full h-full max-h-[200px] object-contain rounded-lg ${isPickingColor ? 'cursor-crosshair border-2 border-dashed border-[#FF4D6D] animate-pulse ring-4 ring-[#FF4D6D]/10' : ''}`}
              onClick={(e) => {
                if (isPickingColor && onImageClick) {
                  e.stopPropagation();
                  onImageClick(e);
                }
              }}
            />
            {isPickingColor && (
              <div className="absolute inset-0 bg-[#FF4D6D]/5 backdrop-blur-[0.5px] border-2 border-dashed border-[#FF4D6D] rounded-lg pointer-events-none flex items-center justify-center">
                <span className="bg-[#FF4D6D] text-white text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded shadow-md flex items-center gap-1 select-none">
                  <Pipette size={10} className="animate-bounce" /> Click to Pick Color
                </span>
              </div>
            )}
            {!isPickingColor && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <Upload size={24} className="mx-auto mb-1" />
                  <p className="text-[10px] font-medium">Click or drag to replace</p>
                </div>
              </div>
            )}
            {!isPickingColor && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setPreviewUrl("");
                  onImageChange("");
                }}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
              >
                <X size={12} />
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
            <div className="p-3 rounded-full bg-neutral-100 mb-3">
              <ImageIcon size={24} className="text-neutral-400" />
            </div>
            <p className="text-xs font-medium text-neutral-600">Click to upload</p>
            <p className="text-[10px] text-neutral-400 mt-1">or drag & drop</p>
            <p className="text-[9px] text-neutral-400 mt-2">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>
    </div>
  );
}

const normalizeColors = (colors) => {
  if (!Array.isArray(colors)) return [];
  return colors
    .map((color) => {
      if (typeof color === "string") {
        const name = color.trim();
        return name ? { name, hex: "#111111" } : null;
      }
      const name = color?.name?.trim();
      return name ? { name, hex: color.hex || "#111111" } : null;
    })
    .filter(Boolean);
};

const COLOR_NAME_TO_HEX = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  green: "#008000",
  blue: "#0000ff",
  yellow: "#ffff00",
  pink: "#ffc0cb",
  purple: "#800080",
  orange: "#ffa500",
  brown: "#8b4513",
  grey: "#808080",
  gray: "#808080",
  silver: "#c0c0c0",
  gold: "#ffd700",
  beige: "#f5f5dc",
  cream: "#fffdd0",
  maroon: "#800000",
  navy: "#000080",
  teal: "#008080",
  olive: "#808000",
  peach: "#ffe5b4",
  lavender: "#e6e6fa"
};

const normalizeHex = (value) => {
  const raw = value.trim();
  if (!raw) return "";
  const withHash = raw.startsWith("#") ? raw : `#${raw}`;
  return /^#[0-9a-fA-F]{6}$/.test(withHash) ? withHash.toLowerCase() : "";
};

const getHexFromColorName = (name) => COLOR_NAME_TO_HEX[name.trim().toLowerCase()] || "";

function ProductModal({ onSave, onClose, editingProduct = null }) {
  const { categories, addToast } = useApp();

  // IMPORTANT: Default displaySection must be one of the specific sections, not "all"
  const [form, setForm] = useState({
    name: editingProduct?.name || "",
    category: editingProduct?.category || categories[0] || "",
    price: editingProduct?.price || "",
    oldPrice: editingProduct?.oldPrice || "",
    stock: editingProduct?.stock ?? "",
    badge: editingProduct?.badge || "",
    image: editingProduct?.image || "",
    altImage: editingProduct?.altImage || "",
    images: editingProduct?.images || [],
    description: editingProduct?.description || "",
    sizes: editingProduct?.sizes || ["S", "M", "L"],
    colors: normalizeColors(editingProduct?.colors),
    details: editingProduct?.details?.join("\n") || "",
    displaySection: editingProduct?.displaySection || "deals" // Default to "deals" instead of "all"
  });

  const [colorInput, setColorInput] = useState({ name: "", hex: "" });
  const [colorError, setColorError] = useState("");
  const [imageError, setImageError] = useState("");
  const [isPickingColor, setIsPickingColor] = useState(false);

  const triggerNativeEyeDropper = async () => {
    if ("EyeDropper" in window) {
      try {
        const eyeDropper = new window.EyeDropper();
        const result = await eyeDropper.open();
        setColorInput(c => ({ ...c, hex: result.sRGBHex }));
        addToast("Color picked from screen!", "success");
      } catch (err) {
        console.log("EyeDropper closed or failed", err);
      }
    }
  };

  const handleImageColorPick = (e) => {
    const img = e.currentTarget;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    ctx.drawImage(img, 0, 0);
    
    const rect = img.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * img.naturalWidth);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * img.naturalHeight);
    
    try {
      const pixel = ctx.getImageData(x, y, 1, 1).data;
      const hex = "#" + [pixel[0], pixel[1], pixel[2]]
        .map(val => val.toString(16).padStart(2, "0"))
        .join("");
      
      setColorInput(c => ({
        ...c,
        hex: hex
      }));
      setIsPickingColor(false);
      addToast("Color picked from image!", "success");
    } catch (err) {
      console.error("Failed to pick color from image:", err);
      // Fallback to native eyedropper if image was cross-origin and blocked
      if ("EyeDropper" in window) {
        triggerNativeEyeDropper();
      } else {
        addToast("Cross-origin image security blocked picking. Please use a local image or enter Hex code manually.", "error");
      }
    }
  };

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  React.useEffect(() => {
    if (!form.category && categories.length > 0) {
      set("category", categories[0]);
    }
  }, [categories, form.category]);

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size]
    }));
  };

  const addColor = () => {
    const name = colorInput.name.trim();
    const hex = normalizeHex(colorInput.hex) || getHexFromColorName(name);
    if (!name && !hex) {
      setColorError("Please enter a color name or hex code.");
      return;
    }
    if (colorInput.hex.trim() && !normalizeHex(colorInput.hex)) {
      setColorError("Hex code should look like #ff0000 or ff0000.");
      return;
    }
    if (name && !hex) {
      setColorError("Color name not recognized. Add a hex code too, like #ff0000.");
      return;
    }
    const colorName = name || hex;
    setForm(f => ({
      ...f,
      colors: [
        ...normalizeColors(f.colors).filter((c) => c.name.toLowerCase() !== colorName.toLowerCase()),
        { name: colorName, hex }
      ]
    }));
    setColorError("");
    setColorInput({ name: "", hex: "" });
  };

  const removeColor = (name) => {
    setForm(f => ({
      ...f,
      colors: f.colors.filter(c => c.name !== name)
    }));
  };

  const handleImageChange = (key, url) => {
    setImageError("");
    set(key, url);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name) {
      alert("Product name is required");
      return;
    }
    if (!form.category) {
      alert("Please add/select a category first");
      return;
    }
    if (!form.price) {
      alert("Price is required");
      return;
    }
    if (!form.image) {
      setImageError("Main image is required");
      return;
    }
    if (!form.description) {
      alert("Description is required");
      return;
    }
    if (!form.displaySection) {
      alert("Please select a display section");
      return;
    }

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
      stock: form.stock === "" ? 0 : Number(form.stock),
      badge: form.badge || null,
      image: form.image,
      altImage: form.altImage || null,
      images: form.images || [],
      description: form.description,
      sizes: form.sizes,
      colors: normalizeColors(form.colors).length > 0 ? normalizeColors(form.colors) : [{ name: "Default", hex: "#111111" }],
      details: detailsArr,
      displaySection: form.displaySection, // This is now either "deals", "trending", or "new_arrivals"
      rating: editingProduct?.rating || 0,
      ratingCount: editingProduct?.ratingCount || 0
    });
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1";
  const hintCls = "text-[9px] text-neutral-400 mt-1 leading-relaxed";

  const selectedSection = SECTION_OPTIONS.find(s => s.id === form.displaySection) || SECTION_OPTIONS[0];
  const SectionIcon = selectedSection?.icon || Clock;
  const discountPercent = form.oldPrice && Number(form.oldPrice) > Number(form.price)
    ? Math.round(((Number(form.oldPrice) - Number(form.price)) / Number(form.oldPrice)) * 100)
    : 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-y-auto flex flex-col">

        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <p className="text-[10px] text-neutral-400 mt-0.5">
              Required fields are marked with *. The preview updates as you type.
            </p>
          </div>
          <button type="button" onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Form Side */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-4">
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-4 text-blue-800">
              <div className="flex items-start gap-2">
                <HelpCircle size={16} className="mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider">Easy product checklist</p>
                  <p className="text-[10px] mt-1 leading-relaxed">
                    Add title, category, selling price, stock, main image, and description. Old price, badge, sizes, colors, and gallery images are optional.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Product Title <span className="text-[#FF4D6D]">*</span></label>
                <input required value={form.name} onChange={(e) => set("name", e.target.value)}
                  placeholder="Example: Pink Cotton Co-ord Set" className={inputCls} />
                <p className={hintCls}>Use the name customers will search for.</p>
              </div>
              <div>
                <label className={labelCls}>Category <span className="text-[#FF4D6D]">*</span></label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls} disabled={categories.length === 0}>
                  <option value="">{categories.length === 0 ? "No categories available" : "Select category"}</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <p className={hintCls}>
                  {categories.length === 0 ? "First add a category from the Categories tab." : "Choose where this product belongs."}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price (₹) <span className="text-[#FF4D6D]">*</span></label>
                <input required type="number" step="1" value={form.price} onChange={(e) => set("price", e.target.value)}
                  placeholder="Example: 2499" className={inputCls} />
                <p className={hintCls}>Final customer price.</p>
              </div>
              <div>
                <label className={labelCls}>Compare At Price (₹) / Old Price</label>
                <input type="number" step="1" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)}
                  placeholder="Example: 3499" className={inputCls} />
                <p className={hintCls}>Optional. Add higher MRP to show discount.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Stock Quantity</label>
                <div className="relative">
                  <Boxes size={13} className="absolute left-3 top-2.5 text-neutral-400" />
                  <input type="number" min="0" step="1" value={form.stock} onChange={(e) => set("stock", e.target.value)}
                    placeholder="Example: 25" className={`${inputCls} pl-8`} />
                </div>
                <p className={hintCls}>How many pieces are available. Blank means 0.</p>
              </div>
              <div>
                <label className={labelCls}>Badge Label</label>
                <input value={form.badge} onChange={(e) => set("badge", e.target.value)}
                  placeholder="Example: New, Best Seller, Sale" className={inputCls} />
                <p className={hintCls}>Optional label shown on product card.</p>
              </div>
            </div>

            {/* Section Selection - REQUIRED, no "all" option */}
            <div className="bg-gradient-to-r from-neutral-50 to-white p-4 rounded-lg border border-neutral-200">
              <label className={`${labelCls} flex items-center gap-2`}>
                <LayoutGrid size={12} className="text-[#FF4D6D]" />
                Display Section <span className="text-[#FF4D6D]">*</span>
              </label>
              <p className="text-[9px] text-neutral-400 mb-3">Product will ONLY appear in the selected section on the storefront</p>
              
              <div className="grid grid-cols-3 gap-3">
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
                      <div className="flex flex-col items-center text-center gap-2">
                        <div 
                          className="p-2 rounded-full"
                          style={{ backgroundColor: isSelected ? `${section.color}20` : '#F3F4F6' }}
                        >
                          <Icon size={20} style={{ color: isSelected ? section.color : '#9CA3AF' }} />
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-1">
                            <span className={`text-xs font-bold ${isSelected ? 'text-neutral-900' : 'text-neutral-600'}`}>
                              {section.label}
                            </span>
                            {isSelected && (
                              <Check size={12} className="text-[#FF4D6D]" />
                            )}
                          </div>
                          <p className="text-[8px] text-neutral-400 mt-0.5">{section.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Images with drag & drop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <ImageUploader
                  currentImage={form.image}
                  onImageChange={(url) => handleImageChange("image", url)}
                  label="Main Image"
                  required={true}
                  isPickingColor={isPickingColor}
                  onImageClick={handleImageColorPick}
                />
                {imageError && <p className="text-[10px] text-red-500 mt-1">{imageError}</p>}
                <p className={hintCls}>Main image appears on product cards and product page.</p>
              </div>
              <div>
                <ImageUploader
                  currentImage={form.altImage}
                  onImageChange={(url) => handleImageChange("altImage", url)}
                  label="Second Image (Hover View)"
                  required={false}
                  isPickingColor={isPickingColor}
                  onImageClick={handleImageColorPick}
                />
                <p className={hintCls}>Optional. Customers see this on hover.</p>
              </div>
            </div>

            {/* Gallery Images (Multiple Images) */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
              <label className={labelCls}>Additional Gallery Images</label>
              <p className="text-[9px] text-neutral-400 mb-3">Upload multiple images that will show up as thumbnails on the product details page</p>
              
              {/* Existing Gallery Preview Grid */}
              {form.images && form.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                  {form.images.map((imgUrl, index) => (
                    <div key={index} className="relative aspect-[4/5] bg-white border border-neutral-200 rounded-lg overflow-hidden group">
                      <img src={imgUrl} alt={`Gallery Preview ${index + 1}`} className="w-full h-full object-cover animate-fade-in" />
                      <button
                        type="button"
                        onClick={() => {
                          setForm(f => ({
                            ...f,
                            images: f.images.filter((_, idx) => idx !== index)
                          }));
                        }}
                        className="absolute top-1.5 right-1.5 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 cursor-pointer shadow-md focus:outline-none"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Gallery Image */}
              <ImageUploader
                currentImage=""
                onImageChange={(url) => {
                  if (url) {
                    setForm(f => ({
                      ...f,
                      images: [...(f.images || []), url]
                    }));
                  }
                }}
                label="Add Gallery Image"
                required={false}
                isPickingColor={isPickingColor}
                onImageClick={handleImageColorPick}
              />
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className={labelCls}>Sizes Available</label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {["XS", "S", "M", "L", "XL", "XXL", "3XL", "4XL", "5XL", "26", "28", "30", "32", "34", "36", "38", "40", "One Size"].map((size) => {
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
                <p className={hintCls}>Tap sizes to select or unselect. Use One Size for bags/accessories.</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className={labelCls}>Add Color Variants</label>
                {isPickingColor && (
                  <span className="text-[9px] font-black text-[#FF4D6D] bg-red-50 border border-red-100 rounded px-1.5 py-0.5 animate-pulse uppercase tracking-wider font-sans">
                    Pipette Active: Tap product image above!
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_120px_auto_auto_auto] gap-2 items-center mb-2">
                <input
                  value={colorInput.name}
                  onChange={(e) => {
                    setColorError("");
                    const nextName = e.target.value;
                    setColorInput(c => ({
                      ...c,
                      name: nextName,
                      hex: c.hex || getHexFromColorName(nextName)
                    }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addColor();
                    }
                  }}
                  placeholder="Example: Blush Pink"
                  className={`${inputCls} flex-1`}
                />
                <input
                  value={colorInput.hex}
                  onChange={(e) => {
                    setColorError("");
                    setColorInput(c => ({ ...c, hex: e.target.value }));
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addColor();
                    }
                  }}
                  placeholder="#ff0000"
                  className={inputCls}
                  aria-label="Color hex code"
                />
                <button
                  type="button"
                  onClick={() => setIsPickingColor(!isPickingColor)}
                  className={`p-2 rounded border focus:outline-none transition-all flex items-center justify-center ${
                    isPickingColor 
                      ? "bg-[#FF4D6D] border-[#FF4D6D] text-white shadow-sm scale-95" 
                      : "bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-600 hover:border-[#FF4D6D]/45"
                  }`}
                  title="Pick color from product image"
                >
                  <Pipette size={14} className={isPickingColor ? "animate-pulse" : ""} />
                </button>
                <input
                  type="color"
                  value={normalizeHex(colorInput.hex) || getHexFromColorName(colorInput.name) || "#111111"}
                  onChange={(e) => setColorInput(c => ({ ...c, hex: e.target.value }))}
                  className="w-full sm:w-12 h-9 border border-neutral-200 rounded p-0.5 cursor-pointer bg-neutral-50"
                  aria-label="Choose color swatch"
                />
                <button
                  type="button"
                  onClick={addColor}
                  className="px-4 py-2 bg-neutral-800 text-white text-xs font-bold uppercase rounded focus:outline-none hover:bg-black transition-colors shrink-0"
                >
                  Add Color
                </button>
              </div>
              <p className={hintCls}>Type name or enter hex. Or click the pipette (🧪/🎨) button to pick any color directly from the product image above!</p>
              {colorError && <p className="text-[10px] text-red-500 mt-1">{colorError}</p>}
              {normalizeColors(form.colors).length > 0 ? (
                <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 border border-neutral-100 rounded">
                  {normalizeColors(form.colors).map(col => (
                    <span key={col.name} className="flex items-center gap-1.5 text-[10px] font-bold bg-white border border-neutral-200 px-2 py-1 rounded-full text-neutral-700 font-sans">
                      <span className="w-3.5 h-3.5 rounded-full border border-neutral-200/80" style={{ backgroundColor: col.hex }} />
                      {col.name}
                      <button type="button" onClick={() => removeColor(col.name)} className="text-neutral-400 hover:text-red-500 font-extrabold focus:outline-none ml-1" aria-label={`Remove ${col.name}`}>x</button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="rounded border border-dashed border-neutral-200 bg-neutral-50 px-3 py-2 text-[10px] text-neutral-400">
                  No colors added yet. The product will use a default color if you leave this empty.
                </div>
              )}
            </div>

            <div>
              <label className={labelCls}>Product Description <span className="text-[#FF4D6D]">*</span></label>
              <textarea required rows={3} value={form.description} onChange={(e) => set("description", e.target.value)}
                placeholder="Example: Soft cotton co-ord set for everyday comfort. Lightweight, breathable, and easy to style." className={`${inputCls} resize-none`} />
              <p className={hintCls}>Write 1-3 simple lines about fabric, fit, and use.</p>
            </div>

            <div>
              <label className={labelCls}>Material Details / Bullet points (one per line)</label>
              <textarea rows={3} value={form.details} onChange={(e) => set("details", e.target.value)}
                placeholder={"Example:\n100% cotton fabric\nRelaxed fit\nMachine washable"} className={`${inputCls} resize-none`} />
              <p className={hintCls}>Each line becomes one bullet point on the product page.</p>
            </div>

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

          {/* Live Preview Side */}
          <div className="lg:col-span-5 flex flex-col items-center justify-start bg-neutral-50/50 border-l border-neutral-100 p-6 rounded-r-xl font-sans">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-1.5 self-start">
              <Monitor size={10} /> Live Storefront Preview
            </p>

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

            <div className="w-full max-w-[280px] bg-white border border-neutral-200/80 overflow-hidden rounded shadow-lg">

              <div className="relative aspect-[4/5] w-full bg-neutral-100 overflow-hidden">
                {form.image ? (
                  <img
                    src={form.image}
                    alt={form.name || "Product preview"}
                    className="absolute inset-0 h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
                    <ImageIcon size={32} className="text-neutral-300" />
                  </div>
                )}

                <button type="button" className="absolute right-3 top-3 p-2 rounded-full bg-white/95 shadow-xs text-neutral-400 focus:outline-none">
                  <Heart size={14} />
                </button>

                {discountPercent > 0 && (
                  <span className="absolute left-3 top-3 px-2 py-0.5 text-[9px] font-bold tracking-wider text-white bg-[#FF4D6D] uppercase">
                    {discountPercent}% OFF
                  </span>
                )}

                <div className="absolute right-3 bottom-3">
                  <div className="p-1.5 rounded-full bg-white/95 shadow-sm">
                    <SectionIcon size={12} style={{ color: selectedSection?.color }} />
                  </div>
                </div>

                {form.badge && (
                  <span className="absolute left-3 bottom-3 px-2 py-0.5 text-[9px] font-bold tracking-widest text-[#111111] bg-white border border-neutral-100 uppercase font-sans">
                    {form.badge}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col">
                <p className="text-[9px] font-bold text-neutral-400 tracking-wider uppercase mb-1">
                  {form.category || "Category"}
                </p>
                <h3 className="text-xs font-bold text-neutral-900 tracking-tight leading-tight line-clamp-1 mb-1.5">
                  {form.name || "Enter Product Name..."}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  <Star size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-bold text-neutral-800">5.0</span>
                  <span className="text-[10px] text-neutral-400 font-light">(0)</span>
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-sm font-black text-neutral-950 font-sans">
                    ₹{form.price ? Number(form.price).toLocaleString("en-IN") : "0"}
                  </span>
                  {form.oldPrice && Number(form.oldPrice) > Number(form.price) && (
                    <span className="text-[11px] text-neutral-400 line-through font-light font-sans">
                      ₹{Number(form.oldPrice).toLocaleString("en-IN")}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-[10px] text-neutral-400">
                  Stock: {form.stock === "" ? 0 : form.stock}
                </p>
              </div>

            </div>

            <div className="w-full mt-6 bg-blue-50 border border-blue-100 rounded-lg p-4 text-[10px] text-blue-700 font-light leading-relaxed space-y-1">
              <p className="font-bold uppercase tracking-wider text-blue-800 mb-1">💡 Important:</p>
              <p>• Products appear ONLY in their assigned section on the storefront</p>
              <p>• "Deals of the Day" products show discount badges</p>
              <p>• "New Arrivals" get a special badge on the storefront</p>
              <p>• "Trending" products appear in the hot picks section</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

function ManageReviewsModal({ product: initialProduct, onClose }) {
  const { products, addToast } = useApp();
  
  // Dynamically find the latest product from context to stay reactive
  const product = products.find(p => p.id === initialProduct.id) || initialProduct;
  const [reviews, setReviews] = useState(product.reviews || []);

  React.useEffect(() => {
    setReviews(product.reviews || []);
  }, [product.reviews]);

  const handleDeleteReview = async (reviewIndex) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    
    try {
      const updatedReviews = reviews.filter((_, idx) => idx !== reviewIndex);
      
      // Calculate new rating and ratingCount
      const newRatingCount = updatedReviews.length;
      let newRating = 0;
      if (newRatingCount > 0) {
        const totalRating = updatedReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0);
        newRating = Number((totalRating / newRatingCount).toFixed(1));
      }
      
      // Write back to Firestore!
      const productRef = doc(db, "products", product.id);
      await setDoc(productRef, {
        reviews: updatedReviews,
        rating: newRating,
        ratingCount: newRatingCount
      }, { merge: true });
      
      setReviews(updatedReviews);
      addToast("Review deleted successfully!", "success");
    } catch (err) {
      console.error("Error deleting review:", err);
      addToast("Failed to delete review. Please try again.", "error");
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / reviews.length).toFixed(1)
    : "0.0";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100 sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display flex items-center gap-2">
              <MessageSquare size={16} className="text-[#FF4D6D]" />
              Manage Reviews: {product.name}
            </h2>
            <p className="text-[10px] text-neutral-400 mt-0.5 font-medium">
              Review count: {reviews.length} • Average rating: {averageRating} ★
            </p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {reviews.length === 0 ? (
            <div className="text-center py-16 bg-neutral-50/50 border border-dashed border-neutral-200 rounded-xl flex flex-col items-center justify-center gap-2">
              <Star size={24} className="text-neutral-200" />
              <p className="text-xs text-neutral-400 font-light font-sans">No customer reviews for this product yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((review, idx) => (
                <div key={idx} className="p-4 bg-neutral-50/50 border border-neutral-200 rounded-xl flex items-start justify-between gap-4 hover:border-red-100 hover:bg-red-50/5 transition-all duration-300">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-neutral-800">{review.user}</span>
                      <span className="text-[9px] text-neutral-400 font-sans">{review.date}</span>
                      <span className="inline-flex items-center gap-0.5 text-amber-500 bg-amber-50 border border-amber-250/20 px-1.5 py-0.5 rounded text-[10px] font-black font-sans leading-none">
                        {review.rating} ★
                      </span>
                    </div>
                    <p className="text-xs text-neutral-600 font-light leading-relaxed font-sans font-normal">
                      {review.comment}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteReview(idx)}
                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors focus:outline-none shrink-0"
                    title="Delete Review"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-neutral-100 flex justify-end bg-neutral-50/50">
          <button onClick={onClose} className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-805 text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-xs font-sans">
            Done
          </button>
        </div>

      </div>
    </div>
  );
}

export default function ProductsTab() {
  const { products, categories, adminAddProduct, adminDeleteProduct } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [delTarget, setDelTarget] = useState(null);
  const [reviewsTarget, setReviewsTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCat, setSelectedCat] = useState("");
  const [selectedSection, setSelectedSection] = useState("all");

  const totalProducts = products.length;
  const avgPrice = totalProducts > 0 ? Math.round(products.reduce((acc, p) => acc + p.price, 0) / totalProducts) : 0;
  const bestProduct = [...products].sort((a, b) => b.rating - a.rating)[0];

  const getSectionCount = (sectionId) => {
    if (sectionId === "all") return products.length;
    return products.filter(p => p.displaySection === sectionId).length;
  };

  // CRITICAL FIX: Filter products based on selected section
  // Products without displaySection or with "all" are treated as "deals" for backward compatibility
  const filtered = products.filter(p => {
    const matchesSearch = search === "" || 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    
    const matchesCat = selectedCat === "" || p.category === selectedCat;
    
    // For backward compatibility: if product has no displaySection or it's "all", treat as "deals"
    const productSection = p.displaySection && p.displaySection !== "all" ? p.displaySection : "deals";
    const matchesSection = selectedSection === "all" || productSection === selectedSection;
    
    return matchesSearch && matchesCat && matchesSection;
  });

  const getSectionIcon = (sectionId) => {
    const section = SECTION_OPTIONS.find(s => s.id === sectionId);
    return section?.icon || Clock;
  };

  const getSectionColor = (sectionId) => {
    const section = SECTION_OPTIONS.find(s => s.id === sectionId);
    return section?.color || "#FF4D6D";
  };

  const getSectionLabel = (sectionId) => {
    const section = SECTION_OPTIONS.find(s => s.id === sectionId);
    return section?.label || "Deals of the Day";
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
        <StatCard label="Total Products" value={totalProducts} color="#111111" />
        <StatCard label="Average Price" value={`₹${avgPrice}`} color="#FF4D6D" />
        <StatCard label="Top Product" value={bestProduct ? bestProduct.name.substring(0, 20) + (bestProduct.name.length > 20 ? "..." : "") : "None"} color="#c9860a" />
        <StatCard label="Top Rating" value={bestProduct ? `${bestProduct.rating} ★` : "0.0"} color="#22c55e" />
      </div>

      {/* Section Quick Stats - Shows count of products in each section */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {SECTION_OPTIONS.map(section => {
          const Icon = section.icon;
          const count = getSectionCount(section.id);
          return (
            <div 
              key={section.id}
              className="bg-white border border-neutral-200 rounded-xl p-3 text-center hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedSection(selectedSection === section.id ? "all" : section.id)}
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

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-200/60 p-4 mb-6 rounded-xl font-sans">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded pl-9 pr-3 py-2 focus:outline-none focus:border-[#FF4D6D] transition-colors"
            />
          </div>
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
          {selectedSection !== "all" && (
            <div className="flex items-center gap-2 px-2 py-1 bg-neutral-100 rounded-lg">
              <span className="text-[10px] font-medium text-neutral-600">Filtering by:</span>
              <button
                onClick={() => setSelectedSection("all")}
                className="flex items-center gap-1.5 px-2 py-0.5 bg-white rounded-md text-xs font-medium"
              >
                {getSectionLabel(selectedSection)}
                <X size={12} />
              </button>
            </div>
          )}
        </div>
        <button
          onClick={() => setShowAdd(true)}
          disabled={categories.length === 0}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm font-sans"
          title={categories.length === 0 ? "Add a category before adding products" : "Add Product"}
        >
          <Plus size={13} /> Add Product
        </button>
      </div>

      <div className="flex items-center gap-2 mb-4 font-sans">
        <Package size={16} className="text-[#FF4D6D]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">Inventory ({filtered.length})</h2>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl py-16 text-center font-sans">
          <Package size={32} className="mx-auto text-neutral-200 mb-3" />
          <p className="text-sm font-bold text-neutral-800">
            {products.length === 0 ? "No products listed yet" : "No products match your search/filter"}
          </p>
          <p className="text-xs text-neutral-400 font-light mt-1 max-w-sm mx-auto">
            {products.length === 0
              ? "Start by adding categories, then click Add Product and fill the required fields."
              : "Try clearing search, category, or section filters."}
          </p>
          {products.length === 0 && categories.length > 0 && (
            <button
              onClick={() => setShowAdd(true)}
              className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm"
            >
              <Plus size={13} /> Add First Product
            </button>
          )}
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
                  // For backward compatibility: if no displaySection or "all", treat as "deals"
                  const sectionId = p.displaySection && p.displaySection !== "all" ? p.displaySection : "deals";
                  const SectionIcon = getSectionIcon(sectionId);
                  const sectionColor = getSectionColor(sectionId);
                  const sectionLabel = getSectionLabel(sectionId);
                  
                  return (
                    <tr key={p.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded bg-neutral-100 border border-neutral-200/60" />
                        <div>
                          <h4 className="font-bold text-neutral-800 line-clamp-1 max-w-[200px]">{p.name}</h4>
                          {p.badge && (
                            <span className="inline-block mt-1 text-[8px] font-black uppercase tracking-wider bg-red-50 text-[#FF4D6D] border border-red-100 px-1.5 py-0.5 rounded font-sans">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-500 font-medium">{p.category}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-bold"
                          style={{ backgroundColor: `${sectionColor}15`, color: sectionColor }}>
                          <SectionIcon size={10} />
                          {sectionLabel}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans">
                        <div className="font-bold text-neutral-800">₹{p.price.toLocaleString("en-IN")}</div>
                        {p.oldPrice && p.oldPrice > p.price && (
                          <div className="text-[10px] text-neutral-400 line-through font-light">₹{p.oldPrice.toLocaleString("en-IN")}</div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setEditTarget(p)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 transition-colors focus:outline-none"
                            title="Edit Product"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => setReviewsTarget(p)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-amber-500 hover:bg-amber-50 transition-colors focus:outline-none"
                            title="Manage Reviews"
                          >
                            <MessageSquare size={14} />
                          </button>
                          <button
                            onClick={() => setDelTarget(p)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors focus:outline-none"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
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

      {editTarget && (
        <ProductModal
          editingProduct={editTarget}
          onSave={(form) => { adminAddProduct(form); setEditTarget(null); }}
          onClose={() => setEditTarget(null)}
        />
      )}

      {delTarget && (
        <DeleteProductConfirmModal
          product={delTarget}
          onConfirm={() => { adminDeleteProduct(delTarget.id); setDelTarget(null); }}
          onClose={() => setDelTarget(null)}
        />
      )}

      {reviewsTarget && (
        <ManageReviewsModal
          product={reviewsTarget}
          onClose={() => setReviewsTarget(null)}
        />
      )}
    </>
  );
}
