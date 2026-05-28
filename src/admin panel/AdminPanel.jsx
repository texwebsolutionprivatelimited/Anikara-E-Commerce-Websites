import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { collection, doc, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import {
  Shield, Tag, Plus, Pencil, Trash2, X, Check,
  AlertTriangle, ChevronRight, Eye, EyeOff, Palette,
  Image as ImageIcon, ArrowUp, ArrowDown, LayoutTemplate,
  ChevronUp, ChevronDown, Monitor, FolderOpen, Package, Search, Heart, Star,
  Settings, CreditCard, FileText, Download, RotateCcw, CheckCircle, PlusCircle,
  Menu, Bell, User, MessageSquare
} from "lucide-react";

// Import from the admin panel folder
import OrderTracking from "./OrderTracking";
import SlidesTab from "./BannerSlides";
import CouponsTab from "./OffersCoupons";
import CategoriesTab from "./Categories";
import ProductsTab from "./ProductInventory";
import PaymentsTab from "./PaymentRecords";
import SettingsTab from "./SettingsPanel";

// ─── TABS ──────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "slides", label: "Banner Slides", icon: LayoutTemplate },
  { id: "categories", label: "Categories", icon: FolderOpen },
  { id: "coupons", label: "Offers & Coupons", icon: Tag },
  { id: "orders", label: "Orders Tracking", icon: FileText },
  { id: "payments", label: "Payment Records", icon: CreditCard },
  { id: "products", label: "Product Inventory", icon: Package },
  { id: "settings", label: "Settings", icon: Settings },
];

// MAIN ADMIN PANEL
export default function AdminPanel({ navigate }) {
  const [activeTab, setActiveTab] = useState("orders");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { settings } = useApp();

  // Notification center states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Message center states
  const [messages, setMessages] = useState([]);
  const [showMessages, setShowMessages] = useState(false);

  // Search bar dropdown states
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const searchQuickLinks = [
    { label: "Manage Banner Slides", tab: "slides", icon: LayoutTemplate },
    { label: "Offers & Coupon Settings", tab: "coupons", icon: Tag },
    { label: "Product Categories", tab: "categories", icon: FolderOpen },
    { label: "Product Inventory", tab: "products", icon: Package },
    { label: "Log Payments & Financials", tab: "payments", icon: CreditCard },
    { label: "Orders Tracking & Status", tab: "orders", icon: FileText },
    { label: "Global System Settings", tab: "settings", icon: Settings },
  ];

  const filteredQuickLinks = searchQuickLinks.filter(link =>
    link.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close dropdowns on clicking outside
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (!e.target.closest(".admin-header-dropdown")) {
        setShowNotifications(false);
        setShowProfile(false);
        setShowSearchDropdown(false);
        setShowMessages(false);
        setShowMobileSearch(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const unsubNotifications = onSnapshot(collection(db, "admin_notifications"), (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(rows.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")));
    });
    const unsubMessages = onSnapshot(collection(db, "admin_messages"), (snap) => {
      const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setMessages(rows.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || "")));
    });
    return () => {
      unsubNotifications();
      unsubMessages();
    };
  }, []);

  const markAllNotificationsRead = async () => {
    await Promise.all(
      notifications.map((n) =>
        setDoc(doc(db, "admin_notifications", String(n.id)), { read: true }, { merge: true })
      )
    );
  };

  const markAllMessagesRead = async () => {
    await Promise.all(
      messages.map((m) =>
        setDoc(doc(db, "admin_messages", String(m.id)), { read: true }, { merge: true })
      )
    );
  };

  return (
    <div className="min-h-screen bg-neutral-50 font-sans flex flex-col md:flex-row">

      {/* Mobile Top Header */}
      <header className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm w-full">
        {showMobileSearch ? (
          <div className="flex items-center gap-2 w-full animate-fade-in admin-header-dropdown relative">
            <Search className="text-neutral-400 shrink-0" size={16} />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sections or actions..."
              className="flex-grow text-xs bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/15 font-sans"
            />
            <button
              onClick={() => {
                setSearchQuery("");
                setShowMobileSearch(false);
              }}
              className="p-1 rounded-lg text-neutral-400 hover:text-black focus:outline-none"
            >
              <X size={16} />
            </button>

            {searchQuery && (
              <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 py-2 animate-fade-in font-sans">
                <p className="px-4 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Quick Actions</p>
                {filteredQuickLinks.length === 0 ? (
                  <p className="px-4 py-2 text-xs text-neutral-400 italic">No actions found.</p>
                ) : (
                  filteredQuickLinks.map((link, idx) => {
                    const LinkIcon = link.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setActiveTab(link.tab);
                          setSearchQuery("");
                          setShowMobileSearch(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors"
                      >
                        <LinkIcon size={14} className="text-neutral-400" />
                        <span className="text-xs font-medium text-neutral-700">{link.label}</span>
                      </button>
                    );
                  })
                )}
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="p-1.5 rounded-lg hover:bg-neutral-100 text-neutral-700 focus:outline-none"
                aria-label="Toggle Sidebar"
              >
                <Menu size={20} />
              </button>
              <div>
                <h1 className="text-xs font-black tracking-wide text-neutral-900 font-display uppercase">
                  {settings?.businessName || "Anikara"} Admin
                </h1>
                <p className="text-[9px] text-[#FF4D6D] font-bold uppercase tracking-wider">
                  {TABS.find(t => t.id === activeTab)?.label || "Dashboard"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setShowMobileSearch(true);
                  setShowNotifications(false);
                  setShowProfile(false);
                  setShowMessages(false);
                }}
                className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none"
              >
                <Search size={16} />
              </button>

              <div className="relative admin-header-dropdown">
                <button
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowProfile(false);
                    setShowMessages(false);
                  }}
                  className="relative p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none"
                >
                  <Bell size={16} />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#FF4D6D] rounded-full ring-2 ring-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-[-96px] mt-2.5 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-sans">
                    <div className="px-3 py-2 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800">Notifications</span>
                      <button
                        onClick={() => {
                          markAllNotificationsRead();
                        }}
                        className="text-[9px] font-bold text-[#FF4D6D] hover:underline focus:outline-none"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto">
                      {notifications.map((n) => (
                        <div key={n.id} className={`p-3 transition-colors hover:bg-neutral-50/50 ${!n.read ? "bg-[#FF4D6D]/5" : ""}`}>
                          <div className="flex justify-between items-start gap-1">
                            <p className={`text-[11px] ${!n.read ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{n.title}</p>
                            <span className="text-[8px] text-neutral-400 whitespace-nowrap shrink-0">{n.time}</span>
                          </div>
                          <p className="text-[9px] text-neutral-400 font-light mt-0.5">{n.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative admin-header-dropdown">
                <button
                  onClick={() => {
                    setShowMessages(!showMessages);
                    setShowNotifications(false);
                    setShowProfile(false);
                  }}
                  className="relative p-1.5 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none"
                >
                  <MessageSquare size={16} />
                  {messages.filter(m => !m.read).length > 0 && (
                    <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#FF4D6D] rounded-full ring-2 ring-white" />
                  )}
                </button>

                {showMessages && (
                  <div className="absolute right-[-48px] mt-2.5 w-72 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-sans">
                    <div className="px-3 py-2 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-neutral-800">Messages</span>
                      <button
                        onClick={() => {
                          markAllMessagesRead();
                        }}
                        className="text-[9px] font-bold text-[#FF4D6D] hover:underline focus:outline-none"
                      >
                        Mark all as read
                      </button>
                    </div>
                    <div className="divide-y divide-neutral-100 max-h-56 overflow-y-auto">
                      {messages.map((m) => (
                        <div key={m.id} className={`p-3 transition-colors hover:bg-neutral-50/50 ${!m.read ? "bg-[#FF4D6D]/5" : ""}`}>
                          <div className="flex justify-between items-start gap-1">
                            <p className={`text-[11px] ${!m.read ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{m.sender}</p>
                            <span className="text-[8px] text-neutral-400 whitespace-nowrap shrink-0">{m.time}</span>
                          </div>
                          <p className="text-[9px] text-neutral-400 font-light mt-0.5 line-clamp-2">{m.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative admin-header-dropdown">
                <button
                  onClick={() => {
                    setShowProfile(!showProfile);
                    setShowNotifications(false);
                    setShowMessages(false);
                  }}
                  className="flex items-center gap-1.5 p-1 hover:bg-neutral-50 rounded-full transition-colors focus:outline-none border border-neutral-200/40"
                >
                  <div className="w-5 h-5 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-[10px] font-display">
                    A
                  </div>
                </button>

                {showProfile && (
                  <div className="absolute right-0 mt-2.5 w-48 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-sans">
                    <div className="p-3 border-b border-neutral-100 bg-neutral-50/30">
                      <p className="text-[11px] font-bold text-neutral-800">Admin User</p>
                      <p className="text-[9px] text-neutral-400 mt-0.5">admin@anikara.com</p>
                    </div>
                    <div className="py-1 text-[11px]">
                      <button
                        onClick={() => {
                          setActiveTab("settings");
                          setShowProfile(false);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center gap-2"
                      >
                        <Settings size={12} className="text-neutral-400" />
                        <span>System Settings</span>
                      </button>
                      <button
                        onClick={() => {
                          setShowProfile(false);
                          navigate("home");
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-neutral-50 text-red-500 transition-colors border-t border-neutral-100/50 flex items-center gap-2"
                      >
                        <User size={12} className="text-red-400" />
                        <span>Storefront View</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </header>

      {/* Sidebar Overlay Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-50 md:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Component */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 flex flex-col justify-between
        transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-neutral-900 text-white shadow-sm"><Shield size={16} /></div>
            <div>
              <h1 className="text-sm font-black tracking-wide text-neutral-900 font-display uppercase leading-none">
                {settings?.businessName || "Anikara"}
              </h1>
              <p className="text-[10px] text-neutral-400 font-light mt-1">Admin Panel</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="md:hidden p-1 rounded-lg hover:bg-neutral-100 text-neutral-400 hover:text-black focus:outline-none"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsMobileOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-wider rounded-lg transition-all focus:outline-none group
                  ${isActive
                    ? "bg-[#FF4D6D]/5 text-[#FF4D6D] border-l-4 border-[#FF4D6D] pl-3"
                    : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 border-l-4 border-transparent"
                  }
                `}
              >
                <Icon size={16} className={`transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-[#FF4D6D]" : "text-neutral-400 group-hover:text-neutral-700"}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50/50">
          <button
            onClick={() => navigate("home")}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neutral-900 hover:bg-[#FF4D6D] text-white text-xs font-bold uppercase tracking-widest rounded-lg transition-all duration-300 shadow-xs focus:outline-none group"
          >
            <span>View Storefront</span>
            <ChevronRight size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </button>
          <div className="text-center mt-3 text-[9px] text-neutral-400 font-light">
            © {new Date().getFullYear()} {settings?.businessName || "Anikara"}.
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:h-screen md:overflow-y-auto">

        {/* Desktop Admin Header */}
        <header className="hidden md:flex bg-white border-b border-neutral-200 px-8 py-4 items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="w-1/3 flex justify-start items-center">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 font-sans">
              <span>Admin</span>
              <span className="text-neutral-300">/</span>
              <span className="text-[#FF4D6D]">{TABS.find(t => t.id === activeTab)?.label || "Overview"}</span>
            </div>
          </div>

          <div className="w-1/3 flex justify-center items-center">
            <div className="relative w-80 admin-header-dropdown">
              <Search className="absolute left-3 top-2.5 text-neutral-400" size={16} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder="Search sections or quick actions..."
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/15 transition-all font-sans"
              />
              {showSearchDropdown && searchQuery && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 py-2 animate-fade-in font-sans">
                  <p className="px-4 py-1 text-[9px] font-bold uppercase tracking-wider text-neutral-400">Quick Actions</p>
                  {filteredQuickLinks.length === 0 ? (
                    <p className="px-4 py-2 text-xs text-neutral-400 italic">No actions found.</p>
                  ) : (
                    filteredQuickLinks.map((link, idx) => {
                      const LinkIcon = link.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTab(link.tab);
                            setSearchQuery("");
                            setShowSearchDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-neutral-50 flex items-center gap-2.5 transition-colors"
                        >
                          <LinkIcon size={14} className="text-neutral-400" />
                          <span className="text-xs font-medium text-neutral-700">{link.label}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="w-1/3 flex justify-end items-center gap-4">
            <div className="relative admin-header-dropdown">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowProfile(false);
                  setShowMessages(false);
                }}
                className="relative p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none"
              >
                <Bell size={18} />
                {notifications.filter(n => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D6D] rounded-full ring-2 ring-white" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-sans">
                  <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">Notifications</span>
                    <button
                      onClick={() => {
                        markAllNotificationsRead();
                      }}
                      className="text-[10px] font-bold text-[#FF4D6D] hover:underline focus:outline-none"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div key={n.id} className={`p-4 transition-colors hover:bg-neutral-50/50 ${!n.read ? "bg-[#FF4D6D]/2" : ""}`}>
                        <div className="flex justify-between items-start gap-1">
                          <p className={`text-xs ${!n.read ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{n.title}</p>
                          <span className="text-[9px] text-neutral-400 whitespace-nowrap shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-light mt-0.5">{n.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative admin-header-dropdown">
              <button
                onClick={() => {
                  setShowMessages(!showMessages);
                  setShowNotifications(false);
                  setShowProfile(false);
                }}
                className="relative p-2 text-neutral-500 hover:text-neutral-900 rounded-full hover:bg-neutral-50 transition-colors focus:outline-none"
              >
                <MessageSquare size={18} />
                {messages.filter(m => !m.read).length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF4D6D] rounded-full ring-2 ring-white" />
                )}
              </button>

              {showMessages && (
                <div className="absolute right-0 mt-2.5 w-80 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-sans">
                  <div className="px-4 py-3 bg-neutral-50/80 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-800">Messages Center</span>
                    <button
                      onClick={() => {
                        markAllMessagesRead();
                      }}
                      className="text-[10px] font-bold text-[#FF4D6D] hover:underline focus:outline-none"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="divide-y divide-neutral-100 max-h-72 overflow-y-auto">
                    {messages.map((m) => (
                      <div key={m.id} className={`p-4 transition-colors hover:bg-neutral-50/50 ${!m.read ? "bg-[#FF4D6D]/2" : ""}`}>
                        <div className="flex justify-between items-start gap-1">
                          <p className={`text-xs ${!m.read ? "font-bold text-neutral-900" : "text-neutral-700"}`}>{m.sender}</p>
                          <span className="text-[9px] text-neutral-400 whitespace-nowrap shrink-0">{m.time}</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-light mt-0.5 leading-relaxed">{m.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="relative admin-header-dropdown">
              <button
                onClick={() => {
                  setShowProfile(!showProfile);
                  setShowNotifications(false);
                  setShowMessages(false);
                }}
                className="flex items-center gap-2 p-1.5 hover:bg-neutral-50 rounded-full transition-colors focus:outline-none border border-neutral-200/40"
              >
                <div className="w-7 h-7 rounded-full bg-neutral-900 text-white flex items-center justify-center font-bold text-xs font-display">
                  A
                </div>
              </button>

              {showProfile && (
                <div className="absolute right-0 mt-2.5 w-56 bg-white border border-neutral-200 rounded-xl shadow-xl z-50 overflow-hidden animate-fade-in font-sans">
                  <div className="p-4 border-b border-neutral-100 bg-neutral-50/30">
                    <p className="text-xs font-bold text-neutral-800">Admin User</p>
                    <p className="text-[10px] text-neutral-400 mt-0.5">admin@anikara.com</p>
                  </div>
                  <div className="py-1 text-xs">
                    <button
                      onClick={() => {
                        setActiveTab("settings");
                        setShowProfile(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-neutral-700 transition-colors flex items-center gap-2"
                    >
                      <Settings size={13} className="text-neutral-400" />
                      <span>System Settings</span>
                    </button>
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("home");
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-neutral-50 text-red-500 transition-colors border-t border-neutral-100/50 flex items-center gap-2"
                    >
                      <User size={13} className="text-red-400" />
                      <span>Storefront View</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {activeTab === "slides" && <SlidesTab />}
          {activeTab === "coupons" && <CouponsTab />}
          {activeTab === "categories" && <CategoriesTab />}
          {activeTab === "products" && <ProductsTab />}
          {activeTab === "payments" && <PaymentsTab />}
          {activeTab === "orders" && <OrderTracking />}
          {activeTab === "settings" && <SettingsTab />}
        </main>
      </div>

    </div>
  );
}

