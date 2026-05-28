import React, { useState, useEffect } from "react";
import { useApp } from "../../context/AppContext";
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { Plus, Search, Pencil, Trash2, X, Check, Package, Image as ImageIcon, AlertTriangle } from "lucide-react";

const INITIAL_PRODUCT = {
  name: "",
  price: "",
  oldPrice: "",
  category: "Dress",
  stock: "",
  description: "",
  sizes: ["S", "M", "L", "XL"],
};

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
          This will permanently remove <strong className="text-neutral-800">"{item.name}"</strong>.
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

export default function AdminProductsTab() {
  const { addToast, categories, uploadToImageKit } = useApp();
  
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // Form State
  const [formData, setFormData] = useState(INITIAL_PRODUCT);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const snap = await getDocs(collection(db, "products"));
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
    } catch (err) {
      console.error(err);
      addToast("Failed to load products", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenAdd = () => {
    setFormData(INITIAL_PRODUCT);
    setImageFile(null);
    setEditTarget(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (prod) => {
    setFormData({
      name: prod.name || "",
      price: prod.price || "",
      oldPrice: prod.oldPrice || "",
      category: prod.category || "Dress",
      stock: prod.stock || "",
      description: prod.description || "",
      sizes: prod.sizes || ["S", "M", "L", "XL"],
    });
    setImageFile(null);
    setEditTarget(prod);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.category) {
      addToast("Please fill all required fields", "error");
      return;
    }

    if (!editTarget && !imageFile) {
      addToast("Please select a product image", "error");
      return;
    }

    setIsSubmitting(true);
    try {
      let imageUrl = editTarget?.image || "";

      // 1. Upload Image to ImageKit if selected
      if (imageFile) {
        imageUrl = await uploadToImageKit(imageFile);
      }

      // 2. Prepare Payload
      const payload = {
        name: formData.name,
        price: Number(formData.price),
        oldPrice: Number(formData.oldPrice || formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description,
        image: imageUrl,
        sizes: formData.sizes,
        updatedAt: new Date().toISOString()
      };

      // 3. Save to Firestore
      if (editTarget) {
        await updateDoc(doc(db, "products", editTarget.id), payload);
        addToast("Product updated successfully", "success");
      } else {
        payload.createdAt = new Date().toISOString();
        payload.rating = 4.5;
        payload.ratingCount = 0;
        await addDoc(collection(db, "products"), payload);
        addToast("Product added successfully", "success");
      }
      
      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
      addToast("An error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteDoc(doc(db, "products", deleteTarget.id));
      addToast("Product deleted.", "success");
      fetchProducts();
    } catch (err) {
      addToast("Failed to delete product.", "error");
    } finally {
      setDeleteTarget(null);
    }
  };

  // Filter & Search
  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.name || "").toLowerCase().includes((searchTerm || "").toLowerCase());
    const matchesCat = filterCategory ? p.category === filterCategory : true;
    return matchesSearch && matchesCat;
  });

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] transition-colors font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  return (
    <div className="font-sans">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
        <div className="flex gap-2 items-center">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input 
              type="text" 
              placeholder="Search products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs border border-neutral-200 rounded-lg w-full sm:w-64 focus:outline-none focus:border-[#FF4D6D]"
            />
          </div>
          <select 
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 text-xs border border-neutral-200 rounded-lg focus:outline-none bg-white text-neutral-700"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        
        <button onClick={handleOpenAdd}
          className="flex shrink-0 items-center gap-2 px-4 py-2 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-xs font-bold tracking-widest uppercase rounded-lg transition-colors focus:outline-none shadow-sm">
          <Plus size={13} /> Add Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-neutral-200/60 rounded-xl overflow-x-auto">
        <table className="w-full text-left text-xs text-neutral-600">
          <thead className="bg-neutral-50 border-b border-neutral-200/60 text-[10px] uppercase tracking-wider font-bold text-neutral-500">
            <tr>
              <th className="px-6 py-4">Product</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Stock</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {isLoading ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-neutral-400">Loading products...</td>
              </tr>
            ) : filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-12 text-center text-neutral-400">No products found.</td>
              </tr>
            ) : (
              filteredProducts.map(product => (
                <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-3">
                      <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} className="w-10 h-10 object-cover rounded bg-neutral-100" />
                      <div>
                        <p className="font-semibold text-neutral-900">{product.name}</p>
                        <p className="text-[10px] text-neutral-400 truncate max-w-[150px]">{product.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3">
                    <span className="px-2 py-1 bg-neutral-100 text-neutral-600 rounded text-[10px] font-semibold">{product.category}</span>
                  </td>
                  <td className="px-6 py-3 font-medium text-neutral-900">
                    ₹{product.price}
                  </td>
                  <td className="px-6 py-3">
                    <span className={`font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {product.stock > 0 ? product.stock : "Out of Stock"}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button onClick={() => handleOpenEdit(product)}
                      className="p-1.5 text-neutral-400 hover:text-[#111111] hover:bg-neutral-200 rounded transition-colors inline-block mr-1">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => setDeleteTarget(product)}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors inline-block">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl my-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-100">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display">
                {editTarget ? "Edit Product" : "Add New Product"}
              </h2>
              <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-black focus:outline-none">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                {/* Left Col */}
                <div className="space-y-4">
                  <div>
                    <label className={labelCls}>Product Name <span className="text-[#FF4D6D]">*</span></label>
                    <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputCls} placeholder="e.g. Silk Satin Dress" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Price (₹) <span className="text-[#FF4D6D]">*</span></label>
                      <input type="number" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={inputCls} placeholder="1999" />
                    </div>
                    <div>
                      <label className={labelCls}>Old Price (₹)</label>
                      <input type="number" value={formData.oldPrice} onChange={e => setFormData({...formData, oldPrice: e.target.value})} className={inputCls} placeholder="2999" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className={labelCls}>Category <span className="text-[#FF4D6D]">*</span></label>
                      <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputCls}>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Stock Qty <span className="text-[#FF4D6D]">*</span></label>
                      <input type="number" required value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className={inputCls} placeholder="50" />
                    </div>
                  </div>
                </div>

                {/* Right Col */}
                <div className="space-y-4 flex flex-col">
                  <div>
                    <label className={labelCls}>Product Image {(!editTarget) && <span className="text-[#FF4D6D]">*</span>}</label>
                    <div className="relative border-2 border-dashed border-neutral-200 rounded-lg p-4 flex flex-col items-center justify-center text-center bg-neutral-50 hover:bg-neutral-100 transition-colors group">
                      {imageFile ? (
                        <div className="text-xs font-semibold text-[#FF4D6D] break-all">{imageFile.name}</div>
                      ) : editTarget?.image ? (
                         <img src={editTarget.image} alt="Preview" className="h-16 w-16 object-cover rounded mb-2" />
                      ) : (
                        <ImageIcon size={24} className="text-neutral-300 mb-2 group-hover:text-[#FF4D6D] transition-colors" />
                      )}
                      <p className="text-[10px] text-neutral-500 font-medium">Click to browse or drag file here</p>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => e.target.files[0] && setImageFile(e.target.files[0])}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col">
                    <label className={labelCls}>Description</label>
                    <textarea 
                      value={formData.description} 
                      onChange={e => setFormData({...formData, description: e.target.value})} 
                      className={`${inputCls} flex-grow resize-none`} 
                      placeholder="Product details..."
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-neutral-100 mt-2">
                <button type="submit" disabled={isSubmitting}
                  className="flex-1 py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-2 disabled:opacity-50">
                  {isSubmitting ? (
                    "Saving..."
                  ) : (
                    <><Check size={14} /> {editTarget ? "Save Changes" : "Add Product"}</>
                  )}
                </button>
                <button type="button" onClick={() => setShowAddModal(false)} disabled={isSubmitting}
                  className="px-6 py-3 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase hover:bg-neutral-50 transition-colors rounded focus:outline-none disabled:opacity-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteModal item={deleteTarget} label="Product" onConfirm={handleDelete} onClose={() => setDeleteTarget(null)} />
      )}
    </div>
  );
}
