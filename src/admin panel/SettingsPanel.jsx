import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { collection, doc, getDocs, setDoc, writeBatch } from "firebase/firestore";
import { db } from "../firebase";
import {
  Shield, Tag, Check, AlertTriangle, Package, Monitor, Clock
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════════
// SETTINGS TAB
// ═══════════════════════════════════════════════════════════════════
export default function SettingsTab() {
  const { settings, adminUpdateSettings, addToast } = useApp();
  const [form, setForm] = useState({ ...settings });
  const [seedingAdminFeed, setSeedingAdminFeed] = useState(false);

  const toDateTimeLocal = (value) => {
    if (!value) return "";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";
    const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
    return offsetDate.toISOString().slice(0, 16);
  };

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
      supportAddress: form.supportAddress?.trim() || "",
      supportPhone: form.supportPhone?.trim() || "",
      supportEmail: form.supportEmail?.trim() || "",
      dealEndsAt: form.dealEndsAt ? new Date(form.dealEndsAt).toISOString() : "",
    });
  };

  const inputCls = "w-full text-xs bg-neutral-50 border border-neutral-200 rounded px-3 py-2.5 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/20 transition-all font-sans";
  const labelCls = "block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5";

  const seedAdminFeeds = async () => {
    if (seedingAdminFeed) return;
    setSeedingAdminFeed(true);
    try {
      const [notificationsSnap, messagesSnap] = await Promise.all([
        getDocs(collection(db, "admin_notifications")),
        getDocs(collection(db, "admin_messages"))
      ]);

      if (!notificationsSnap.empty || !messagesSnap.empty) {
        addToast("Admin feeds already exist. Seed skipped.", "info");
        return;
      }

      const now = new Date();
      const iso = now.toISOString();
      const batch = writeBatch(db);
      const notificationDocs = [
        { id: "notif-1", title: "New payment received", desc: "Order payment completed successfully.", time: "Just now", read: false, createdAt: iso },
        { id: "notif-2", title: "Stock alert", desc: "Some products are running low in inventory.", time: "5 mins ago", read: false, createdAt: new Date(now.getTime() - 5 * 60 * 1000).toISOString() },
        { id: "notif-3", title: "Coupon updated", desc: "A coupon has been activated by admin.", time: "1 hour ago", read: true, createdAt: new Date(now.getTime() - 60 * 60 * 1000).toISOString() }
      ];
      const messageDocs = [
        { id: "msg-1", sender: "Customer A", text: "Can I exchange this product size?", time: "Just now", read: false, createdAt: iso },
        { id: "msg-2", sender: "Customer B", text: "When will my order be delivered?", time: "12 mins ago", read: false, createdAt: new Date(now.getTime() - 12 * 60 * 1000).toISOString() },
        { id: "msg-3", sender: "Customer C", text: "Thank you, the order arrived safely.", time: "Yesterday", read: true, createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString() }
      ];

      notificationDocs.forEach((item) => {
        batch.set(doc(db, "admin_notifications", item.id), item);
      });
      messageDocs.forEach((item) => {
        batch.set(doc(db, "admin_messages", item.id), item);
      });
      await batch.commit();
      addToast("Admin notifications/messages seeded successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to seed admin feeds", "error");
    } finally {
      setSeedingAdminFeed(false);
    }
  };

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

        {/* Deal timer settings */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <div className="p-1.5 bg-[#FF4D6D]/5 text-[#FF4D6D] rounded-lg"><Clock size={14} /></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-display">Deals of the Day Timer</h3>
          </div>
          <div>
            <label className={labelCls}>Deal Ends At</label>
            <input
              type="datetime-local"
              value={toDateTimeLocal(form.dealEndsAt)}
              onChange={(e) => set("dealEndsAt", e.target.value)}
              className={inputCls}
            />
            <p className="text-[9px] text-neutral-400 mt-1">Controls the live countdown shown in the Deals of the Day section.</p>
          </div>
        </div>

        {/* Support contact settings */}
        <div className="bg-white border border-neutral-200/60 rounded-xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center gap-2 border-b border-neutral-100 pb-3">
            <div className="p-1.5 bg-[#FF4D6D]/5 text-[#FF4D6D] rounded-lg"><Shield size={14} /></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-800 font-display">Support Contact Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className={labelCls}>Support Address</label>
              <input
                value={form.supportAddress || ""}
                onChange={(e) => set("supportAddress", e.target.value)}
                placeholder="e.g. Flat 405, Linking Road, Mumbai"
                className={inputCls}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Support Phone</label>
                <input
                  value={form.supportPhone || ""}
                  onChange={(e) => set("supportPhone", e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Support Email</label>
                <input
                  type="email"
                  value={form.supportEmail || ""}
                  onChange={(e) => set("supportEmail", e.target.value)}
                  placeholder="e.g. support@brand.com"
                  className={inputCls}
                />
              </div>
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
        <div className="space-y-3">
          <button
            type="button"
            onClick={seedAdminFeeds}
            disabled={seedingAdminFeed}
            className="w-full py-3 bg-neutral-100 hover:bg-neutral-200 disabled:opacity-60 text-neutral-800 text-xs font-bold tracking-widest uppercase transition-colors rounded-lg focus:outline-none flex items-center justify-center gap-2 shadow-sm font-sans"
          >
            <Shield size={14} /> {seedingAdminFeed ? "Seeding Admin Feed..." : "Seed Admin Inbox/Notifications"}
          </button>
          <button
            type="submit"
            className="w-full py-3 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors rounded-lg focus:outline-none flex items-center justify-center gap-2 shadow-sm font-sans"
          >
            <Check size={14} /> Save Configuration
          </button>
        </div>

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
