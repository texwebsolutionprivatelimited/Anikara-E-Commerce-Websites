import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  FileText, X, Check, AlertTriangle, Search, Download, RotateCcw,
  Pencil, Trash2, ChevronUp, ChevronDown, Plus
} from "lucide-react";
import { InvoiceModal } from "./PaymentRecords";
import { StatCard } from "./AdminShared";

// ═══════════════════════════════════════════════════════════════════
// ORDER STATUS UPDATE MODAL
// ═══════════════════════════════════════════════════════════════════
function OrderStatusModal({ order, onSave, onClose }) {
  const [status, setStatus] = useState(order.status);
  const [step, setStep] = useState(order.trackingStep || 1);

  // Sync step when status changes for standard options
  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    if (newStatus === "Processing") setStep(1);
    else if (newStatus === "In Transit" || newStatus === "Shipped") setStep(2);
    else if (newStatus === "Out for Delivery") setStep(3);
    else if (newStatus === "Delivered") setStep(4);
  };

  const handleStepChange = (newStep) => {
    setStep(newStep);
    if (newStep === 1) setStatus("Processing");
    else if (newStep === 2) setStatus("In Transit");
    else if (newStep === 3) setStatus("Out for Delivery");
    else if (newStep === 4) setStatus("Delivered");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(order.id, status, step);
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] transition-all font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 font-sans border border-neutral-200">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display flex items-center gap-2">
            <FileText size={16} className="text-[#FF4D6D]" />
            Update Order Status
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Details */}
          <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-100 text-[11px] leading-relaxed text-left">
            <p><span className="font-semibold text-neutral-700">Order ID:</span> <span className="font-mono text-neutral-900 font-bold">{order.id}</span></p>
            <p><span className="font-semibold text-neutral-700">Address:</span> <span className="text-neutral-800">{order.address}</span></p>
            <p><span className="font-semibold text-neutral-700">Total:</span> <span className="text-neutral-955 font-bold">₹{order.total.toLocaleString("en-IN")}</span></p>
          </div>

          {/* Visual Tracker Controller */}
          <div className="space-y-3">
            <p className={labelCls}>Delivery Tracking Step</p>
            <div className="relative w-full flex items-center justify-between font-display text-[9px] font-bold tracking-wider uppercase text-neutral-400 py-2">

              {/* Step 1 */}
              <button
                type="button"
                onClick={() => handleStepChange(1)}
                className="flex flex-col items-center gap-1.5 z-10 focus:outline-none hover:scale-105 active:scale-95 transition-transform"
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border font-black transition-all ${step >= 1 ? "bg-[#FF4D6D] border-[#FF4D6D] text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"
                  }`}>
                  1
                </span>
                <span className={step === 1 ? "text-[#FF4D6D] font-black" : ""}>Placed</span>
              </button>

              <div className={`h-0.5 flex-grow mx-1 -translate-y-3.5 transition-colors duration-300 ${step >= 2 ? "bg-[#FF4D6D]" : "bg-neutral-200"}`} />

              {/* Step 2 */}
              <button
                type="button"
                onClick={() => handleStepChange(2)}
                className="flex flex-col items-center gap-1.5 z-10 focus:outline-none hover:scale-105 active:scale-95 transition-transform"
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border font-black transition-all ${step >= 2 ? "bg-[#FF4D6D] border-[#FF4D6D] text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"
                  }`}>
                  2
                </span>
                <span className={step === 2 ? "text-[#FF4D6D] font-black" : ""}>Shipped</span>
              </button>

              <div className={`h-0.5 flex-grow mx-1 -translate-y-3.5 transition-colors duration-300 ${step >= 3 ? "bg-[#FF4D6D]" : "bg-neutral-200"}`} />

              {/* Step 3 */}
              <button
                type="button"
                onClick={() => handleStepChange(3)}
                className="flex flex-col items-center gap-1.5 z-10 focus:outline-none hover:scale-105 active:scale-95 transition-transform"
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border font-black transition-all ${step >= 3 ? "bg-[#FF4D6D] border-[#FF4D6D] text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"
                  }`}>
                  3
                </span>
                <span className={step === 3 ? "text-[#FF4D6D] font-black" : ""}>In Transit</span>
              </button>

              <div className={`h-0.5 flex-grow mx-1 -translate-y-3.5 transition-colors duration-300 ${step >= 4 ? "bg-[#FF4D6D]" : "bg-neutral-200"}`} />

              {/* Step 4 */}
              <button
                type="button"
                onClick={() => handleStepChange(4)}
                className="flex flex-col items-center gap-1.5 z-10 focus:outline-none hover:scale-105 active:scale-95 transition-transform"
              >
                <span className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] border font-black transition-all ${step >= 4 ? "bg-[#FF4D6D] border-[#FF4D6D] text-white shadow-xs" : "bg-white border-neutral-200 text-neutral-400"
                  }`}>
                  4
                </span>
                <span className={step === 4 ? "text-[#FF4D6D] font-black" : ""}>Delivered</span>
              </button>

            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Status Label</label>
              <select
                value={status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className={inputCls}
              >
                <option value="Processing">Processing</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Tracking Step Number</label>
              <select
                disabled={status === "Cancelled"}
                value={step}
                onChange={(e) => setStep(Number(e.target.value))}
                className={inputCls}
              >
                <option value={1}>Step 1 (Placed)</option>
                <option value={2}>Step 2 (Shipped)</option>
                <option value={3}>Step 3 (Out for Delivery / In Transit)</option>
                <option value={4}>Step 4 (Delivered)</option>
              </select>
            </div>
          </div>

          {status === "Cancelled" && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-red-800 text-[10.5px] leading-relaxed text-left animate-pulse">
              <p className="font-bold mb-0.5">⚠️ Order Cancellation Alert</p>
              <p className="font-light">Setting this order to Cancelled will invalidate the delivery progress tracking and label the order history as Cancelled on the storefront.</p>
            </div>
          )}

          <div className="flex gap-3 pt-3 border-t border-neutral-100">
            <button type="submit" className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-1.5 shadow-xs font-sans">
              <Check size={13} /> Update Status
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
// DELETE ORDER CONFIRMATION MODAL
// ═══════════════════════════════════════════════════════════════════
function DeleteOrderModal({ order, onConfirm, onClose }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 space-y-4 border border-neutral-200">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-red-50 text-red-500">
            <AlertTriangle size={18} />
          </div>
          <h2 className="text-sm font-bold text-neutral-900 font-display">Delete Order Record?</h2>
        </div>
        <p className="text-xs text-neutral-500 font-light leading-relaxed font-sans text-left">
          Are you sure you want to permanently delete order <strong className="text-neutral-800 font-bold">{order.id}</strong>?
          This will wipe this order's history completely, and it will no longer be visible in the user's dashboard.
          <br /><br />
          Order Value: <strong className="text-neutral-800 font-bold">₹{order.total.toLocaleString("en-IN")}</strong>
        </p>
        <div className="flex gap-3 pt-1 font-sans">
          <button onClick={onConfirm} className="flex-grow py-2.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold tracking-widest uppercase rounded transition-colors focus:outline-none font-sans">
            Delete Permanently
          </button>
          <button onClick={onClose} className="px-5 py-2.5 border border-neutral-200 text-neutral-700 text-xs font-bold tracking-widest uppercase rounded hover:bg-neutral-50 transition-colors focus:outline-none">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════
// ORDER TRACKING TAB - MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════
function ManualOrderModal({ onSave, onClose }) {
  const [form, setForm] = useState({
    orderId: "",
    date: new Date().toISOString().split("T")[0],
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    address: "",
    paymentMethod: "COD",
    status: "Processing",
    itemName: "",
    itemPrice: "",
    quantity: "1",
    size: "M",
    color: "Default",
    itemImage: ""
  });

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] transition-all font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  const getTrackingStep = (status) => {
    if (status === "Processing") return 1;
    if (status === "Shipped" || status === "In Transit") return 2;
    if (status === "Out for Delivery") return 3;
    if (status === "Delivered") return 4;
    return 1;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const price = Number(form.itemPrice);
    const quantity = Number(form.quantity);
    if (!form.customerName || !form.customerEmail || !form.address || !form.itemName || !price || quantity < 1) {
      return;
    }

    const payload = {
      id: form.orderId.trim() || undefined,
      date: form.date,
      status: form.status,
      trackingStep: getTrackingStep(form.status),
      address: form.address.trim(),
      paymentMethod: form.paymentMethod,
      total: price * quantity,
      customerName: form.customerName.trim(),
      customerEmail: form.customerEmail.trim(),
      customerPhone: form.customerPhone.trim(),
      items: [
        {
          id: `manual-item-${Date.now()}`,
          name: form.itemName.trim(),
          price,
          quantity,
          size: form.size.trim() || "M",
          color: form.color.trim() || "Default",
          image: form.itemImage.trim() || "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=300&q=80"
        }
      ]
    };
    onSave(payload);
  };

  const total = (Number(form.itemPrice) || 0) * (Number(form.quantity) || 0);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in font-sans">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-6 font-sans border border-neutral-200 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 font-display flex items-center gap-2">
            <Plus size={16} className="text-[#FF4D6D]" />
            Add Manual Order
          </h2>
          <button onClick={onClose} className="text-neutral-400 hover:text-black focus:outline-none">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelCls}>Order ID (Optional)</label>
              <input value={form.orderId} onChange={(e) => set("orderId", e.target.value)} className={inputCls} placeholder="Auto-generate if empty" />
            </div>
            <div>
              <label className={labelCls}>Order Date</label>
              <input type="date" value={form.date} onChange={(e) => set("date", e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Customer Name</label>
              <input value={form.customerName} onChange={(e) => set("customerName", e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Customer Email</label>
              <input type="email" value={form.customerEmail} onChange={(e) => set("customerEmail", e.target.value)} className={inputCls} required />
            </div>
            <div>
              <label className={labelCls}>Customer Phone</label>
              <input value={form.customerPhone} onChange={(e) => set("customerPhone", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Payment Method</label>
              <select value={form.paymentMethod} onChange={(e) => set("paymentMethod", e.target.value)} className={inputCls}>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="UPI">UPI</option>
                <option value="Card">Card</option>
                <option value="Net Banking">Net Banking</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className={labelCls}>Shipping Address</label>
              <textarea value={form.address} onChange={(e) => set("address", e.target.value)} className={`${inputCls} min-h-[76px] resize-y`} required />
            </div>
            <div>
              <label className={labelCls}>Order Status</label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="In Transit">In Transit</option>
                <option value="Out for Delivery">Out for Delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-3">Item Details</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Item Name</label>
                <input value={form.itemName} onChange={(e) => set("itemName", e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Image URL (Optional)</label>
                <input value={form.itemImage} onChange={(e) => set("itemImage", e.target.value)} className={inputCls} placeholder="https://..." />
              </div>
              <div>
                <label className={labelCls}>Unit Price</label>
                <input type="number" min="1" step="1" value={form.itemPrice} onChange={(e) => set("itemPrice", e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Quantity</label>
                <input type="number" min="1" step="1" value={form.quantity} onChange={(e) => set("quantity", e.target.value)} className={inputCls} required />
              </div>
              <div>
                <label className={labelCls}>Size</label>
                <input value={form.size} onChange={(e) => set("size", e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Color</label>
                <input value={form.color} onChange={(e) => set("color", e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          <div className="bg-neutral-50 border border-neutral-100 rounded-lg p-3 text-xs text-neutral-700">
            Estimated Order Total: <span className="font-black text-[#FF4D6D]">₹{total.toLocaleString("en-IN")}</span>
          </div>

          <div className="flex gap-3 pt-2 border-t border-neutral-100">
            <button type="submit" className="flex-1 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded focus:outline-none flex items-center justify-center gap-1.5 shadow-xs font-sans">
              <Check size={13} /> Save Manual Order
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

export default function OrderTracking() {
  const { orders, adminUpdateOrderStatus, adminDeleteOrder, adminAddOrder, payments, addToast } = useApp();
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [activeUpdateStatus, setActiveUpdateStatus] = useState(null);
  const [activeDeleteOrder, setActiveDeleteOrder] = useState(null);
  const [activeCreateOrder, setActiveCreateOrder] = useState(false);

  // Helper: Retrieve customer details using payments ledger
  const getCustomerInfo = (orderId) => {
    const payment = payments.find(p => p.orderId === orderId);
    if (payment) {
      return {
        name: payment.customerName,
        email: payment.customerEmail,
        phone: payment.customerPhone
      };
    }
    return {
      name: "Ajeet Kumar",
      email: "ajeet@example.com",
      phone: "+91 98765 43210"
    };
  };

  // Stats calculation
  const totalOrders = orders.length;
  const activeOrdersCount = orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length;
  const completedOrdersCount = orders.filter(o => o.status === "Delivered").length;
  const totalRevenue = orders.filter(o => o.status !== "Cancelled").reduce((s, o) => s + o.total, 0);

  // Filtering logic
  const filtered = orders.filter(o => {
    const term = search.toLowerCase();
    const customer = getCustomerInfo(o.id);
    const matchesSearch =
      o.id.toLowerCase().includes(term) ||
      o.address.toLowerCase().includes(term) ||
      customer.name.toLowerCase().includes(term) ||
      customer.email.toLowerCase().includes(term) ||
      o.items.some(item => item.name.toLowerCase().includes(term));

    const matchesStatus = selectedStatus === "" || o.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesMethod = selectedMethod === "" || o.paymentMethod.toLowerCase() === selectedMethod.toLowerCase();

    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Sorting logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date) - new Date(a.date) || b.id.localeCompare(a.id);
    } else if (sortBy === "oldest") {
      return new Date(a.date) - new Date(b.date) || a.id.localeCompare(b.id);
    } else if (sortBy === "value-high") {
      return b.total - a.total;
    } else if (sortBy === "value-low") {
      return a.total - b.total;
    }
    return 0;
  });

  const handleExportCSV = () => {
    addToast("Exporting order ledger as CSV...", "success");
    setTimeout(() => {
      addToast("Order ledger CSV saved successfully.", "success");
    }, 1500);
  };

  return (
    <>
      {/* Stats Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6 font-sans">
        <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString("en-IN")}`} color="#22c55e" />
        <StatCard label="Total Orders" value={totalOrders} color="#111111" />
        <StatCard label="Active / Shipped" value={activeOrdersCount} color="#c9860a" />
        <StatCard label="Delivered" value={completedOrdersCount} color="#FF4D6D" />
      </div>

      {/* Control & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-neutral-200/60 p-4 mb-6 rounded-xl font-sans">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order, Customer, Items..."
              className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded pl-9 pr-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] transition-colors"
            />
          </div>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] font-sans"
          >
            <option value="">All Statuses</option>
            <option value="Processing">Processing</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] font-sans"
          >
            <option value="newest">Newest Placed</option>
            <option value="oldest">Oldest Placed</option>
            <option value="value-high">Order Value: High to Low</option>
            <option value="value-low">Order Value: Low to High</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => setActiveCreateOrder(true)}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold uppercase rounded-lg transition-colors focus:outline-none"
            title="Add Manual Order"
          >
            <Plus size={13} /> <span className="hidden sm:inline">Add Order</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="flex items-center justify-center gap-1.5 px-4 py-2.5 border border-neutral-200 hover:bg-neutral-50 text-neutral-700 text-xs font-bold uppercase rounded-lg transition-colors focus:outline-none"
            title="Export Orders Ledger"
          >
            <Download size={13} /> <span className="hidden sm:inline">Export Ledger</span>
          </button>
        </div>
      </div>

      {/* Title section */}
      <div className="flex items-center gap-2 mb-4 font-sans">
        <FileText size={16} className="text-[#FF4D6D]" />
        <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-800 font-display">Orders Registry ({sorted.length})</h2>
      </div>

      {/* Main List */}
      {sorted.length === 0 ? (
        <div className="bg-white border border-dashed border-neutral-200 rounded-xl py-16 text-center font-sans">
          <FileText size={32} className="mx-auto text-neutral-200 mb-3" />
          <p className="text-xs text-neutral-400 font-light font-sans">No orders match your filters.</p>
        </div>
      ) : (
        <>
          {/* DESKTOP TABLE VIEW */}
          <div className="hidden md:block bg-white border border-neutral-200/60 rounded-xl overflow-hidden shadow-xs font-sans">
            <div className="overflow-x-auto overflow-y-visible">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-100 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-display">
                    <th className="py-3 px-4 w-10"></th>
                    <th className="py-3 px-4">Order ID</th>
                    <th className="py-3 px-4">Customer Details</th>
                    <th className="py-3 px-4">Purchased Items</th>
                    <th className="py-3 px-4">Placed Date</th>
                    <th className="py-3 px-4 text-right">Total Amount</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                  {sorted.map(o => {
                    const cust = getCustomerInfo(o.id);
                    const isExpanded = expandedOrderId === o.id;
                    return (
                      <React.Fragment key={o.id}>
                        <tr
                          onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                          className="hover:bg-neutral-50/30 transition-colors cursor-pointer"
                        >
                          {/* Chevron Toggle */}
                          <td className="py-4 px-4 text-center">
                            {isExpanded ? <ChevronUp size={14} className="text-[#FF4D6D]" /> : <ChevronDown size={14} className="text-neutral-400" />}
                          </td>
                          {/* Order ID */}
                          <td className="py-4 px-4 font-mono font-bold text-neutral-750">{o.id}</td>
                          {/* Customer */}
                          <td className="py-4 px-4 text-left">
                            <div className="font-bold text-neutral-850">{cust.name}</div>
                            <div className="text-[9.5px] text-neutral-400 font-light font-sans">{cust.email}</div>
                          </td>
                          {/* Purchased Items summary */}
                          <td className="py-4 px-4 text-left">
                            <span className="font-medium text-neutral-800">
                              {o.items.length} {o.items.length === 1 ? "item" : "items"}
                            </span>
                            <span className="text-[10px] text-neutral-400 font-light ml-1.5">
                              ({o.items.map(i => `${i.quantity}x ${i.size}`).join(", ")})
                            </span>
                          </td>
                          {/* Placed Date */}
                          <td className="py-4 px-4 text-neutral-500 font-light font-sans">{o.date}</td>
                          {/* Total Amount */}
                          <td className="py-4 px-4 text-right font-sans font-bold text-neutral-900">
                            ₹{o.total.toLocaleString("en-IN")}
                          </td>
                          {/* Status badge pill */}
                          <td className="py-4 px-4 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${o.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                                o.status === "In Transit" ? "bg-blue-50 text-blue-650 border-blue-200" :
                                  o.status === "Out for Delivery" ? "bg-indigo-50 text-indigo-650 border-indigo-200" :
                                    o.status === "Cancelled" ? "bg-red-50 text-red-650 border-red-200" :
                                      "bg-amber-50 text-amber-600 border-amber-200"
                              }`}>
                              {o.status}
                            </span>
                          </td>
                          {/* Contextual Actions */}
                          <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-center gap-1.5">
                              {/* View invoice */}
                              <button
                                onClick={() => {
                                  const matchedPayment = payments.find(p => p.orderId === o.id) || {
                                    id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                                    orderId: o.id,
                                    customerName: cust.name,
                                    customerEmail: cust.email,
                                    customerPhone: cust.phone,
                                    amount: o.total,
                                    paymentMethod: o.paymentMethod,
                                    date: o.date,
                                    time: "12:00",
                                    status: o.status === "Delivered" ? "Success" : o.status === "Cancelled" ? "Failed" : "Pending"
                                  };
                                  setActiveInvoice(matchedPayment);
                                }}
                                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors focus:outline-none"
                                title="View Invoice Receipt"
                              >
                                <FileText size={14} />
                              </button>
                              {/* Update Status */}
                              <button
                                onClick={() => setActiveUpdateStatus(o)}
                                className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors focus:outline-none"
                                title="Update Delivery Track Step"
                              >
                                <Pencil size={14} />
                              </button>
                              {/* Delete */}
                              <button
                                onClick={() => setActiveDeleteOrder(o)}
                                className="p-1.5 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors focus:outline-none"
                                title="Delete Order Record"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded details row */}
                        {isExpanded && (
                          <tr className="bg-neutral-50/40">
                            <td colSpan={8} className="p-6 border-b border-neutral-100">
                              <div className="space-y-6 max-w-4xl animate-fade-in text-left">

                                {/* Real-Time Tracking Progress Bar */}
                                <div>
                                  <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-4">Real-Time Delivery Tracker</p>
                                  <div className="max-w-xl py-2 px-1">
                                    <div className="relative w-full flex items-center justify-between font-display text-[8.5px] sm:text-[9.5px] font-bold tracking-wider uppercase text-neutral-400">

                                      <div className="flex flex-col items-center gap-1.5 z-10">
                                        <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] border font-black ${o.trackingStep >= 1 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                          }`}>
                                          {o.trackingStep > 1 ? "✓" : "1"}
                                        </span>
                                        <span className={o.trackingStep === 1 ? "text-emerald-600 font-bold" : ""}>Placed</span>
                                      </div>

                                      <div className={`h-0.5 flex-grow mx-1 -translate-y-3.5 transition-colors duration-300 ${o.trackingStep >= 2 ? "bg-emerald-500" : "bg-neutral-200"}`} />

                                      <div className="flex flex-col items-center gap-1.5 z-10">
                                        <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] border font-black ${o.trackingStep >= 2 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                          }`}>
                                          {o.trackingStep > 2 ? "✓" : "2"}
                                        </span>
                                        <span className={o.trackingStep === 2 ? "text-emerald-600 font-bold" : ""}>Shipped</span>
                                      </div>

                                      <div className={`h-0.5 flex-grow mx-1 -translate-y-3.5 transition-colors duration-300 ${o.trackingStep >= 3 ? "bg-emerald-500" : "bg-neutral-200"}`} />

                                      <div className="flex flex-col items-center gap-1.5 z-10">
                                        <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] border font-black ${o.trackingStep >= 3 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                          }`}>
                                          {o.trackingStep > 3 ? "✓" : "3"}
                                        </span>
                                        <span className={o.trackingStep === 3 ? "text-emerald-600 font-bold" : ""}>Out for Delivery</span>
                                      </div>

                                      <div className={`h-0.5 flex-grow mx-1 -translate-y-3.5 transition-colors duration-300 ${o.trackingStep >= 4 ? "bg-emerald-500" : "bg-neutral-200"}`} />

                                      <div className="flex flex-col items-center gap-1.5 z-10">
                                        <span className={`h-5.5 w-5.5 rounded-full flex items-center justify-center text-[10px] border font-black ${o.trackingStep >= 4 ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-neutral-200"
                                          }`}>
                                          {o.trackingStep >= 4 ? "✓" : "4"}
                                        </span>
                                        <span className={o.trackingStep === 4 ? "text-emerald-600 font-bold" : ""}>Delivered</span>
                                      </div>

                                    </div>
                                  </div>
                                </div>

                                {/* Summary details grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-neutral-100">
                                  {/* Delivery & Customer details */}
                                  <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mb-2">Delivery & Customer Details</p>
                                    <div className="bg-white p-4 rounded-xl border border-neutral-200/60 space-y-2 text-xs text-neutral-600">
                                      <p><span className="font-semibold text-neutral-800">Customer Name:</span> {cust.name}</p>
                                      <p><span className="font-semibold text-neutral-800">Contact Email:</span> {cust.email}</p>
                                      <p><span className="font-semibold text-neutral-800">Contact Phone:</span> {cust.phone || "N/A"}</p>
                                      <p><span className="font-semibold text-neutral-800">Shipping Address:</span> <span className="font-light">{o.address}</span></p>
                                      <p><span className="font-semibold text-neutral-800">Payment Details:</span> {o.paymentMethod}</p>
                                    </div>
                                  </div>

                                  {/* Purchased itemsized summary */}
                                  <div className="text-left">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-450 mb-2">Order Summary Breakdown</p>
                                    <div className="bg-white p-4 rounded-xl border border-neutral-200/60 space-y-3.5 text-xs text-neutral-600">
                                      <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                                        {o.items.map((item, idx) => (
                                          <div key={idx} className="flex justify-between items-center text-[11px] border-b border-neutral-50 pb-1.5">
                                            <div className="flex items-center gap-2">
                                              <img src={item.image} alt={item.name} className="w-5 h-6.5 object-cover rounded border border-neutral-100" />
                                              <div>
                                                <span className="font-semibold text-neutral-800 truncate max-w-[150px] inline-block">{item.name}</span>
                                                <span className="text-[9px] text-neutral-400 ml-1">Size {item.size} • Qty {item.quantity}</span>
                                              </div>
                                            </div>
                                            <span className="font-medium text-neutral-700">₹{(item.price * item.quantity).toLocaleString("en-IN")}</span>
                                          </div>
                                        ))}
                                      </div>

                                      <div className="space-y-1.5 border-t border-neutral-100 pt-2 text-[10.5px]">
                                        <div className="flex justify-between">
                                          <span>Subtotal</span>
                                          <span className="font-semibold text-neutral-800">₹{o.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString("en-IN")}</span>
                                        </div>
                                        <div className="flex justify-between">
                                          <span>Shipping & Handling</span>
                                          <span>{o.total > 1500 ? "Free" : "₹150"}</span>
                                        </div>
                                        <div className="flex justify-between font-bold text-neutral-900 border-t border-neutral-50 pt-2 text-xs">
                                          <span>Total Charged</span>
                                          <span className="text-[#FF4D6D]">₹{o.total.toLocaleString("en-IN")}</span>
                                        </div>
                                      </div>

                                      {/* Quick status transition actions */}
                                      <div className="pt-2 border-t border-neutral-100 flex gap-2">
                                        {o.trackingStep === 1 && (
                                          <button
                                            onClick={() => adminUpdateOrderStatus(o.id, "In Transit", 2)}
                                            className="px-3 py-1.5 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-[9px] font-bold uppercase tracking-widest rounded transition-all focus:outline-none flex-grow cursor-pointer"
                                          >
                                            Ship Order (Step 2)
                                          </button>
                                        )}
                                        {o.trackingStep === 2 && (
                                          <button
                                            onClick={() => adminUpdateOrderStatus(o.id, "Out for Delivery", 3)}
                                            className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-650 text-white text-[9px] font-bold uppercase tracking-widest rounded transition-all focus:outline-none flex-grow cursor-pointer"
                                          >
                                            Out for Delivery (Step 3)
                                          </button>
                                        )}
                                        {o.trackingStep === 3 && (
                                          <button
                                            onClick={() => adminUpdateOrderStatus(o.id, "Delivered", 4)}
                                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-widest rounded transition-all focus:outline-none flex-grow cursor-pointer"
                                          >
                                            Mark Delivered (Step 4)
                                          </button>
                                        )}
                                        {o.status !== "Cancelled" && o.status !== "Delivered" && (
                                          <button
                                            onClick={() => adminUpdateOrderStatus(o.id, "Cancelled", o.trackingStep)}
                                            className="px-3 py-1.5 border border-red-200 text-red-500 hover:bg-red-50 text-[9px] font-bold uppercase tracking-widest rounded transition-all focus:outline-none shrink-0 cursor-pointer"
                                          >
                                            Cancel
                                          </button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* MOBILE CARDS VIEW (fits perfectly between 320px and 425px) */}
          <div className="block md:hidden space-y-4 font-sans">
            {sorted.map(o => {
              const cust = getCustomerInfo(o.id);
              const isExpanded = expandedOrderId === o.id;
              return (
                <div key={o.id} className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200">
                  {/* Header */}
                  <div className="flex justify-between items-start">
                    <div className="text-left">
                      <p className="font-mono text-xs font-bold text-neutral-800">{o.id}</p>
                      <p className="text-[9.5px] text-neutral-400 font-light mt-0.5">{o.date}</p>
                    </div>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[8.5px] font-extrabold uppercase tracking-wider border ${o.status === "Delivered" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                        o.status === "In Transit" ? "bg-blue-50 text-blue-650 border-blue-100" :
                          o.status === "Out for Delivery" ? "bg-indigo-50 text-indigo-650 border-indigo-100" :
                            o.status === "Cancelled" ? "bg-red-50 text-red-650 border-red-100" :
                              "bg-amber-50 text-amber-600 border-amber-100"
                      }`}>
                      {o.status}
                    </span>
                  </div>

                  <hr className="border-neutral-100" />

                  {/* Customer Information */}
                  <div className="text-[11px] leading-relaxed text-left">
                    <p className="text-[9px] uppercase text-neutral-400 font-semibold">Customer</p>
                    <p className="font-bold text-neutral-800">{cust.name}</p>
                  </div>

                  {/* Purchased items list */}
                  <div className="space-y-2 border-t border-neutral-50 pt-2 text-left">
                    <p className="text-[9px] uppercase text-neutral-400 font-semibold">Purchased Items</p>
                    {o.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-[10.5px]">
                        <img src={item.image} alt={item.name} className="w-5 h-6 object-cover rounded border border-neutral-200/40 animate-fade-in" />
                        <span className="font-medium text-neutral-700 truncate flex-grow text-left">{item.name}</span>
                        <span className="text-neutral-400 shrink-0">Qty {item.quantity} ({item.size})</span>
                      </div>
                    ))}
                  </div>

                  {/* Expanded Section for Mobile card */}
                  {isExpanded && (
                    <div className="border-t border-neutral-100 pt-3 space-y-4 text-left animate-fade-in">
                      {/* Real-time Tracking progress */}
                      <div>
                        <p className="text-[9px] uppercase text-neutral-400 font-semibold mb-2">Real-Time Delivery Tracker</p>
                        <div className="w-full py-1 text-[8.5px] font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
                          <span className={o.trackingStep >= 1 ? "text-emerald-500 font-extrabold" : ""}>Placed</span>
                          <span className="text-neutral-300">›</span>
                          <span className={o.trackingStep >= 2 ? "text-emerald-500 font-extrabold" : ""}>Shipped</span>
                          <span className="text-neutral-300">›</span>
                          <span className={o.trackingStep >= 3 ? "text-emerald-500 font-extrabold" : ""}>Transit</span>
                          <span className="text-neutral-300">›</span>
                          <span className={o.trackingStep >= 4 ? "text-emerald-500 font-extrabold" : ""}>Delivered</span>
                        </div>
                      </div>

                      {/* Detailed billing info */}
                      <div className="bg-neutral-50 p-3 rounded-lg space-y-1.5 text-[10.5px] text-neutral-600 font-sans">
                        <p><span className="font-semibold text-neutral-800">Phone:</span> {cust.phone}</p>
                        <p><span className="font-semibold text-neutral-800">Email:</span> {cust.email}</p>
                        <p><span className="font-semibold text-neutral-800">Address:</span> <span className="font-light">{o.address}</span></p>
                        <p><span className="font-semibold text-neutral-800">Subtotal:</span> ₹{o.items.reduce((s, i) => s + i.price * i.quantity, 0).toLocaleString("en-IN")}</p>
                        <p><span className="font-semibold text-neutral-800">Shipping:</span> {o.total > 1500 ? "Free" : "₹150"}</p>
                      </div>

                      {/* Mobile quick actions */}
                      <div className="flex gap-2">
                        {o.trackingStep === 1 && (
                          <button
                            onClick={() => adminUpdateOrderStatus(o.id, "In Transit", 2)}
                            className="px-2 py-1.5 bg-[#FF4D6D] hover:bg-[#ff1e46] text-white text-[9px] font-bold uppercase tracking-wider rounded transition-all focus:outline-none flex-grow cursor-pointer"
                          >
                            Ship Order
                          </button>
                        )}
                        {o.trackingStep === 2 && (
                          <button
                            onClick={() => adminUpdateOrderStatus(o.id, "Out for Delivery", 3)}
                            className="px-2 py-1.5 bg-indigo-500 hover:bg-indigo-650 text-white text-[9px] font-bold uppercase tracking-wider rounded transition-all focus:outline-none flex-grow cursor-pointer"
                          >
                            Transit (Step 3)
                          </button>
                        )}
                        {o.trackingStep === 3 && (
                          <button
                            onClick={() => adminUpdateOrderStatus(o.id, "Delivered", 4)}
                            className="px-2 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold uppercase tracking-wider rounded transition-all focus:outline-none flex-grow cursor-pointer"
                          >
                            Deliver (Step 4)
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  <hr className="border-neutral-100" />

                  {/* Footer & Actions */}
                  <div className="flex justify-between items-center pt-1">
                    <div className="text-left">
                      <p className="text-[8.5px] uppercase text-neutral-400 font-semibold leading-none">Total Value</p>
                      <p className="font-black text-sm text-[#FF4D6D] font-sans mt-0.5">₹{o.total.toLocaleString("en-IN")}</p>
                    </div>

                    <div className="flex items-center gap-1">
                      {/* Toggle expandable mobile card */}
                      <button
                        onClick={() => setExpandedOrderId(isExpanded ? null : o.id)}
                        className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors focus:outline-none"
                        title={isExpanded ? "Hide Details" : "Show Tracking Details"}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>

                      {/* View Invoice */}
                      <button
                        onClick={() => {
                          const matchedPayment = payments.find(p => p.orderId === o.id) || {
                            id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
                            orderId: o.id,
                            customerName: cust.name,
                            customerEmail: cust.email,
                            customerPhone: cust.phone,
                            amount: o.total,
                            paymentMethod: o.paymentMethod,
                            date: o.date,
                            time: "12:00",
                            status: o.status === "Delivered" ? "Success" : o.status === "Cancelled" ? "Failed" : "Pending"
                          };
                          setActiveInvoice(matchedPayment);
                        }}
                        className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors focus:outline-none"
                        title="View Invoice"
                      >
                        <FileText size={14} />
                      </button>

                      {/* Edit status */}
                      <button
                        onClick={() => setActiveUpdateStatus(o)}
                        className="p-2 border border-neutral-200 rounded-lg hover:bg-neutral-50 text-neutral-600 transition-colors focus:outline-none"
                        title="Edit Status"
                      >
                        <Pencil size={14} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => setActiveDeleteOrder(o)}
                        className="p-2 border border-red-100 rounded-lg hover:bg-red-50 text-red-400 transition-colors focus:outline-none"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Portals to modals */}
      {activeInvoice && (
        <InvoiceModal
          payment={activeInvoice}
          onClose={() => setActiveInvoice(null)}
        />
      )}

      {activeUpdateStatus && (
        <OrderStatusModal
          order={activeUpdateStatus}
          onSave={(id, status, step) => {
            adminUpdateOrderStatus(id, status, step);
            setActiveUpdateStatus(null);
          }}
          onClose={() => setActiveUpdateStatus(null)}
        />
      )}

      {activeDeleteOrder && (
        <DeleteOrderModal
          order={activeDeleteOrder}
          onConfirm={() => {
            adminDeleteOrder(activeDeleteOrder.id);
            setActiveDeleteOrder(null);
          }}
          onClose={() => setActiveDeleteOrder(null)}
        />
      )}

      {activeCreateOrder && (
        <ManualOrderModal
          onSave={async (payload) => {
            const ok = await adminAddOrder(payload);
            if (ok) {
              setActiveCreateOrder(false);
            }
          }}
          onClose={() => setActiveCreateOrder(false)}
        />
      )}
    </>
  );
}
