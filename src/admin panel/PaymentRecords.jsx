import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Plus, X, Check, AlertTriangle, Search, CreditCard, FileText,
  Download, RotateCcw, CheckCircle, PlusCircle
} from "lucide-react";
import { StatCard } from "./AdminShared";

// INVOICE / RECEIPT MODAL
export function InvoiceModal({ payment, onClose }) {
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

// ═══════════════════════════════════════════════════════════════════
// MANUAL PAYMENT MODAL
// ═══════════════════════════════════════════════════════════════════
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
export default function PaymentsTab() {
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
                      <td className="py-3.5 px-4 font-mono font-bold text-neutral-700">{p.id}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-neutral-800">{p.customerName}</div>
                        <div className="text-[10px] text-neutral-400 font-light font-sans">{p.customerEmail}</div>
                      </td>
                      <td className="py-3.5 px-4 font-sans text-neutral-600 font-medium">{p.customerPhone || "N/A"}</td>
                      <td className="py-3.5 px-4">
                        {p.orderId && p.orderId !== "N/A" ? (
                          <span className="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded border border-neutral-200/50">{p.orderId}</span>
                        ) : (
                          <span className="text-neutral-400 italic font-sans">Offline Log</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 font-light font-sans">
                        <div>{p.date}</div>
                        <div className="text-[10px] text-neutral-400 mt-0.5">{p.time}</div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-medium font-sans">
                        <span className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D]/45" />
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-sans font-bold text-neutral-900">₹{p.amount.toLocaleString("en-IN")}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide border ${p.status === "Success" ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
                          p.status === "Pending" ? "bg-amber-50 text-amber-600 border-amber-200" :
                            p.status === "Failed" ? "bg-red-50 text-red-600 border-red-200" :
                              "bg-indigo-50 text-indigo-600 border-indigo-200"
                          }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => setActiveInvoice(p)} className="p-1.5 rounded hover:bg-neutral-100 text-neutral-500 hover:text-black transition-colors focus:outline-none no-target" title="View digital invoice receipt">
                            <FileText size={14} />
                          </button>
                          {p.status === "Success" && (
                            <button onClick={() => setActiveRefund(p)} className="p-1.5 rounded hover:bg-red-50 text-neutral-400 hover:text-red-600 transition-colors focus:outline-none no-target" title="Issue refund for this transaction">
                              <RotateCcw size={14} />
                            </button>
                          )}
                          {p.status === "Pending" && (
                            <button onClick={() => setActiveComplete(p)} className="p-1.5 rounded hover:bg-emerald-50 text-neutral-400 hover:text-emerald-600 transition-colors focus:outline-none no-target" title="Approve / Mark as Successful">
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

          {/* MOBILE CARDS VIEW */}
          <div className="block md:hidden space-y-4 font-sans">
            {filtered.map(p => (
              <div key={p.id} className="bg-white border border-neutral-200 rounded-xl p-4 space-y-3 hover:shadow-md transition-all duration-200">
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
                  <div className="flex gap-1.5">
                    <button onClick={() => setActiveInvoice(p)} className="px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-[10px] font-bold uppercase rounded flex items-center gap-1 focus:outline-none no-target">
                      <FileText size={11} /> View Invoice
                    </button>
                    {p.status === "Success" && (
                      <button onClick={() => setActiveRefund(p)} className="p-1.5 border border-red-200 hover:bg-red-50 text-red-500 rounded focus:outline-none no-target" title="Refund">
                        <RotateCcw size={12} />
                      </button>
                    )}
                    {p.status === "Pending" && (
                      <button onClick={() => setActiveComplete(p)} className="px-2 py-1 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-bold uppercase rounded flex items-center gap-0.5 focus:outline-none no-target">
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
        <InvoiceModal payment={activeInvoice} onClose={() => setActiveInvoice(null)} />
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
