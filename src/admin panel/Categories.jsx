import React, { useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus, Trash2, Check, AlertTriangle, FolderOpen, Pencil, Sparkles,
  Image as ImageIcon
} from "lucide-react";
import { StatCard } from "./AdminShared";

// ═══════════════════════════════════════════════════════════════════
// CATEGORIES TAB
// ═══════════════════════════════════════════════════════════════════

// Resolve a clean editorial fallback image for any category slug
const resolveCategoryFallbackImage = (slug) => {
  const base = "https://ik.imagekit.io/feu3swboqb/categories/";
  const direct = [
    "sarees", "kurtis", "salwar-suits", "co-ord-sets", "dresses",
    "ethnic-wear", "lounge-wear", "night-suits", "pajamas",
    "lingerie", "bags", "accessories", "jewellery", "cosmetics",
    "shoes", "kurtis", "dresses"
  ];
  if (direct.includes(slug)) return `${base}${slug}.jpg`;

  const footwear = ["footwear", "sneakers", "heels", "flats", "sandals"];
  if (footwear.includes(slug)) return `${base}shoes.jpg`;

  const western = ["tops", "t-shirts", "shirts", "jeans", "trousers", "western-wear", "sweatshirts", "hoodies"];
  if (western.includes(slug)) return `${base}co-ord-sets.jpg`;

  const accs = ["sunglasses", "watches", "hair-accessories", "belts"];
  if (accs.includes(slug)) return `${base}accessories.jpg`;

  const beauty = ["beauty", "skincare", "perfumes"];
  if (beauty.includes(slug)) return `${base}cosmetics.jpg`;

  return "";
};

const OLD_PNG_URLS = new Set([
  "https://ik.imagekit.io/feu3swboqb/categories/bags.png",
  "https://ik.imagekit.io/feu3swboqb/categories/co-ord-sets.png",
  "https://ik.imagekit.io/feu3swboqb/categories/cosmetics.png",
  "https://ik.imagekit.io/feu3swboqb/categories/lingerie.png",
  "https://ik.imagekit.io/feu3swboqb/categories/lounge-wear.png",
  "https://ik.imagekit.io/feu3swboqb/categories/night-suits.png",
  "https://ik.imagekit.io/feu3swboqb/categories/pajamas.png",
  "https://ik.imagekit.io/feu3swboqb/categories/sarees.png"
]);

// Given the raw DB image URL and the category name, return the best image to show
const resolveAdminCoverImage = (dbImage, catName) => {
  const isOldPng = dbImage && OLD_PNG_URLS.has(dbImage);
  if (dbImage && !isOldPng) return dbImage; // custom uploaded or newly added image — use as-is
  // Fall back to new editorial image
  const slug = catName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return resolveCategoryFallbackImage(slug);
};

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

export default function CategoriesTab() {
  const {
    categories,
    categoryImages = {},
    products,
    adminAddCategory,
    adminUpdateCategory,
    adminDeleteCategory,
    addToast,
    compressImage,
    uploadToImageKitWithProgress,
    deleteFromImageKit
  } = useApp();

  const [newCat, setNewCat] = useState("");
  const [newCatImage, setNewCatImage] = useState("");
  const [editTarget, setEditTarget] = useState(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [delTarget, setDelTarget] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const formRef = useRef(null);
  const nameInputRef = useRef(null);

  const handleGenerateAIImage = async () => {
    const trimmed = newCat.trim();
    if (!trimmed) {
      addToast("Please enter a category name first!", "error");
      return;
    }

    setIsGeneratingAI(true);
    setUploadProgress(0);

    try {
      // 1. Build a highly descriptive e-commerce banner prompt
      const prompt = `luxury e-commerce category cover banner for ${trimmed}, high-end professional studio fashion photography, minimalist style, clean bright background, studio lighting, highly detailed`;
      const encodedPrompt = encodeURIComponent(prompt);
      
      // 2. Load the image through our local CORS proxy
      const rawImageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=800&height=800&nologo=true&private=true&enhance=false`;
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(rawImageUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (!response.ok) {
        throw new Error("Failed to generate image from AI server via proxy.");
      }
      const blob = await response.blob();
      
      // 3. Rename image based on category name
      const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const filename = `${slug}.jpg`;
      const file = new File([blob], filename, { type: "image/jpeg" });

      // 4. Delete old temporary image if any
      if (newCatImage && newCatImage.startsWith("https://ik.imagekit.io") && (!editTarget || newCatImage !== categoryImages[editTarget])) {
        void deleteFromImageKit(newCatImage);
      }

      // 5. Upload to ImageKit
      const uploadedUrl = await uploadToImageKitWithProgress(file, (percent) => {
        setUploadProgress(percent);
      });

      setNewCatImage(uploadedUrl);
      addToast("AI Cover image generated and uploaded to ImageKit successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Failed to generate AI image", "error");
    } finally {
      setIsGeneratingAI(false);
    }
  };

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

  const processFile = async (file) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      addToast("Please upload an image file!", "error");
      return;
    }

    setIsUploading(true);
    setUploadProgress(1);

    try {
      // 1. Compress the image before uploading
      const compressed = await compressImage(file, 1000, 1000, 0.8);
      
      // 2. Generate meaningful filename based on the category name
      const slug = newCat.trim() ? newCat.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") : "category-image";
      const ext = file.name.split('.').pop() || 'png';
      const filename = `${slug}.${ext}`;
      const renamedFile = new File([compressed], filename, { type: compressed.type });

      // 3. Delete previous uploaded image from ImageKit (if replaced and not the original database image)
      if (newCatImage && newCatImage.startsWith("https://ik.imagekit.io") && (!editTarget || newCatImage !== categoryImages[editTarget])) {
        void deleteFromImageKit(newCatImage);
      }

      // 4. Upload to ImageKit with progress tracking
      const url = await uploadToImageKitWithProgress(renamedFile, (percent) => {
        setUploadProgress(percent);
      });

      setNewCatImage(url);
      addToast("Image uploaded successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast(err.message || "Image upload failed", "error");
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (!isUploading && e.dataTransfer.files && e.dataTransfer.files[0]) {
      void processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (!isUploading && e.target.files && e.target.files[0]) {
      void processFile(e.target.files[0]);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCat.trim()) return;
    const success = editTarget
      ? await adminUpdateCategory(editTarget, newCat, newCatImage)
      : await adminAddCategory(newCat, newCatImage);
    if (success) {
      // Delete old replaced image from ImageKit
      if (editTarget && categoryImages[editTarget] && categoryImages[editTarget] !== newCatImage && categoryImages[editTarget].startsWith("https://ik.imagekit.io")) {
        void deleteFromImageKit(categoryImages[editTarget]);
      }
      setNewCat("");
      setNewCatImage("");
      setEditTarget(null);
    }
  };

  const handleEditClick = (cat) => {
    setEditTarget(cat);
    setNewCat(cat);
    setNewCatImage(resolveAdminCoverImage(categoryImages[cat], cat));
    requestAnimationFrame(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      nameInputRef.current?.focus({ preventScroll: true });
    });
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
      <div ref={formRef} className="bg-white border border-neutral-200/60 rounded-xl p-6 mb-6 font-sans scroll-mt-6">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-800 mb-4 font-display">{editTarget ? "Edit Category" : "Add New Category"}</h3>

        <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Left: Input details */}
          <div className="space-y-4 flex flex-col justify-between">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Category Name <span className="text-[#FF4D6D]">*</span></label>
              <input
                ref={nameInputRef}
                required
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder="e.g. Summer Activewear"
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-3 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans"
              />
              {newCat.trim() && (
                <button
                  type="button"
                  disabled={isUploading || isGeneratingAI}
                  onClick={handleGenerateAIImage}
                  className="mt-2.5 px-3 py-2 border border-neutral-200 hover:border-[#FF4D6D] text-neutral-700 hover:text-[#FF4D6D] text-[10px] font-bold tracking-wider uppercase rounded transition-all flex items-center justify-center gap-1.5 focus:outline-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles size={12} className={isGeneratingAI ? "animate-spin text-[#FF4D6D]" : ""} />
                  {isGeneratingAI ? "Generating Image..." : "✨ Generate Cover with AI"}
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={isUploading || isGeneratingAI}
              className="w-full py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded flex items-center justify-center gap-1.5 focus:outline-none font-sans h-12 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {editTarget ? <Pencil size={14} /> : <Plus size={14} />} {editTarget ? "Update Category" : "Add Category"}
            </button>
            {editTarget && (
              <button
                type="button"
                onClick={() => {
                  setEditTarget(null);
                  setNewCat("");
                  setNewCatImage("");
                }}
                className="w-full py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase rounded hover:bg-neutral-50 transition-colors focus:outline-none"
              >
                Cancel Edit
              </button>
            )}
          </div>

          {/* Right: Drag & Drop Upload Zone */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">Cover Image (Drag & Drop or Click)</label>

            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => {
                if (!isUploading && !isGeneratingAI) {
                  document.getElementById("category-file-input").click();
                }
              }}
              className={`border-2 border-dashed rounded-xl h-36 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-all duration-300 relative overflow-hidden ${isDragActive ? "border-[#FF4D6D] bg-[#FF4D6D]/5 scale-[0.99]"
                : newCatImage ? "border-emerald-500 bg-neutral-50"
                  : "border-neutral-200 bg-neutral-50/50 hover:border-[#FF4D6D] hover:bg-neutral-50"
                } ${isUploading || isGeneratingAI ? "cursor-not-allowed opacity-85" : ""}`}
            >
              <input
                id="category-file-input"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading || isGeneratingAI}
              />

              {isGeneratingAI ? (
                <div className="flex flex-col items-center gap-2 text-neutral-500 font-sans z-10 w-full px-4">
                  <div className="w-8 h-8 border-3 border-neutral-200 border-t-[#FF4D6D] rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Generating image with AI...</p>
                </div>
              ) : isUploading ? (
                <div className="flex flex-col items-center gap-2 text-neutral-500 font-sans z-10 w-full px-4">
                  <div className="w-8 h-8 border-3 border-neutral-200 border-t-[#FF4D6D] rounded-full animate-spin" />
                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-700">Uploading to ImageKit...</p>
                  
                  {/* Progress bar container */}
                  <div className="w-full bg-neutral-200 rounded-full h-1.5 mt-1 overflow-hidden">
                    <div 
                      className="bg-[#FF4D6D] h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-[#FF4D6D]">{uploadProgress}%</p>
                </div>
              ) : newCatImage ? (
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
                        // If it's a temp uploaded image, delete from ImageKit
                        if (newCatImage.startsWith("https://ik.imagekit.io") && (!editTarget || newCatImage !== categoryImages[editTarget])) {
                          void deleteFromImageKit(newCatImage);
                        }
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
          const coverUrl = resolveAdminCoverImage(categoryImages[cat], cat);
          return (
            <div key={cat} className="group bg-white border border-neutral-200/60 rounded-xl overflow-hidden flex flex-col justify-between hover:shadow-lg transition-all duration-300 hover:scale-[1.01]">
              {/* Category Cover Image Div */}
              <div
                className="h-28 w-full bg-cover bg-center relative transition-transform duration-500 overflow-hidden"
                style={coverUrl ? { backgroundImage: `url(${coverUrl})` } : undefined}
              >
                {!coverUrl && (
                  <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center text-neutral-300">
                    <ImageIcon size={28} />
                  </div>
                )}
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
                    onClick={() => handleEditClick(cat)}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-[#111111] hover:bg-neutral-100 focus:outline-none transition-colors"
                    title="Edit category"
                  >
                    <Pencil size={15} />
                  </button>
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
          onConfirm={async () => {
            const oldUrl = categoryImages[delTarget];
            const success = await adminDeleteCategory(delTarget);
            if (success && oldUrl && oldUrl.startsWith("https://ik.imagekit.io")) {
              await deleteFromImageKit(oldUrl);
            }
            setDelTarget(null);
          }}
          onClose={() => setDelTarget(null)}
        />
      )}
    </>
  );
}
