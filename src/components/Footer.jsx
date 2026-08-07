import React from "react";
import { Mail, Phone, MapPin, Truck, RotateCcw, Lock, Award, CheckCircle } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Footer({ navigate }) {
  const { addToast, settings, categories = [], user } = useApp();
  const supportAddress = settings?.supportAddress || "Address not configured";
  const supportPhone = settings?.supportPhone || "+91 00000 00000";
  const supportEmail = settings?.supportEmail || "support@example.com";
  const shippingThreshold = Number(settings?.shippingThreshold) || 1500;
  const footerCategories = categories.filter(Boolean).slice(0, 5);

  const rawAdminEmails =
    import.meta.env.VITE_ADMIN_EMAILS ||
    import.meta.env.VITE_ADMIN_EMAIL ||
    settings?.adminEmail ||
    "";
  const adminEmails = String(rawAdminEmails)
    .split(",")
    .map((email) => email.toLowerCase().trim())
    .filter(Boolean);
  const userEmail = (user?.email || "").toLowerCase().trim();
  const isAdminUser = !!userEmail && adminEmails.includes(userEmail);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.newsletterEmail.value;
    if (emailInput) {
      addToast("Welcome! Your 10% OFF coupon code has been sent to your email.", "success");
      e.target.reset();
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#080808] text-white pt-8 sm:pt-10 pb-6 border-t border-white/5 font-sans shadow-[0_0_120px_rgba(255,105,180,0.06)]">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-[#FF4D6D]/4 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[120px] pointer-events-none z-0" />

      <div className="relative z-10 max-w-[1720px] mx-auto px-3.5 sm:px-8 lg:px-10 space-y-6 sm:space-y-8">

        {/* 1 & 5. EDITORIAL BRAND QUOTE (Compact section height & 40px gap before newsletter) */}
        <div className="py-5 sm:py-6 text-center max-w-3xl mx-auto border-b border-white/10 mb-8 sm:mb-10">
          <span className="text-3xl text-[#FF4D6D] font-serif block mb-1 opacity-80 leading-none">“</span>
          <blockquote className="text-sm sm:text-lg md:text-xl font-light italic text-neutral-200 font-display leading-relaxed">
            Luxury isn't about excess—it's about thoughtful design, premium craftsmanship, and confidence in every outfit.
          </blockquote>
          <p className="text-[9.5px] sm:text-xs uppercase tracking-[0.25em] text-[#FF4D6D] font-extrabold mt-3 font-sans">
            — ANIKARA EDITORIAL
          </p>
        </div>
        
        {/* 2 & 6 & 10. LUXURY NEWSLETTER BANNER (210-220px height, folded garments texture, vertically centered) */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/15 p-5 sm:p-7 md:p-8 shadow-[0_12px_40px_0_rgba(0,0,0,0.6)] group">
          {/* Folded Luxury Garments / Satin Fabric Background Image Overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-105"
            style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1400&auto=format&fit=crop')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/88 to-black/80 backdrop-blur-xs" />
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[350px] h-[350px] bg-[#FF4D6D]/15 rounded-full blur-[100px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8 items-center relative z-10">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D6D]/20 border border-[#FF4D6D]/40 text-[#FF4D6D] text-[10px] min-[360px]:text-xs font-extrabold uppercase tracking-wider shadow-sm">
                <span className="w-2 h-2 rounded-full bg-[#FF4D6D] animate-pulse" />
                Join 20,000+ Members
              </div>
              <h2 className="text-xl min-[360px]:text-2xl md:text-3xl font-black tracking-tight text-white font-display">
                Get <span className="text-[#FF4D6D] underline decoration-[#FF4D6D]/50">10% OFF</span> Your First Order
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-xl leading-snug">
                Subscribe to get your instant 10% discount code, VIP drop notifications, and insider lookbooks.
              </p>

              {/* Newsletter Social Proof Bullet Points */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[10.5px] sm:text-xs text-neutral-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-[#FF4D6D] shrink-0" />
                  <span>20,000+ fashion lovers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-[#FF4D6D] shrink-0" />
                  <span>Early collection access</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={13} className="text-[#FF4D6D] shrink-0" />
                  <span>Exclusive VIP discounts</span>
                </div>
              </div>
            </div>
            
            {/* Right Form Column (Vertically Centered with 48px Touch Buttons) */}
            <div className="lg:col-span-5 w-full flex items-center justify-center lg:justify-end">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2.5 w-full">
                <div className="relative flex-grow w-full">
                  <input
                    type="email"
                    name="newsletterEmail"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-white/10 border border-white/20 text-white text-xs sm:text-sm px-5 h-12 min-h-[48px] rounded-full backdrop-blur-md focus:outline-none focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/50 placeholder:text-neutral-400 font-light transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-auto bg-[#FF4D6D] hover:bg-[#FF1E46] active:scale-95 text-white text-xs sm:text-sm font-black tracking-widest uppercase px-6 sm:px-8 h-12 min-h-[48px] rounded-full transition-all duration-300 shrink-0 font-display cursor-pointer shadow-lg hover:shadow-[0_0_25px_rgba(255,77,109,0.5)] focus:outline-none flex items-center justify-center"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* 3 & 7. FOOTER NAVIGATION COLUMNS (Increased horizontal spacing: gap-8 sm:gap-10 lg:gap-14) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-14 pt-4 sm:pt-6">
          
          {/* About Column */}
          <div className="space-y-4">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Anikara Logo"
                className="h-9 w-auto object-contain invert"
              />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Dedicated to offering high-fashion, minimal silhouettes. From comfortable lounge suits and pajamas to rich handloom sarees and tailored power suits.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-1">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/20 hover:shadow-[0_0_20px_rgba(255,77,109,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer" 
                aria-label="Instagram link"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/20 hover:shadow-[0_0_20px_rgba(255,77,109,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer" 
                aria-label="Facebook link"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/20 hover:shadow-[0_0_20px_rgba(255,77,109,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer" 
                aria-label="Twitter link"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-full bg-white/5 border border-white/15 text-neutral-200 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/20 hover:shadow-[0_0_20px_rgba(255,77,109,0.5)] hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer" 
                aria-label="Youtube link"
              >
                <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                  <polygon points="10 15 15 12 10 9"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display border-l-2 border-[#FF4D6D] pl-3">
              Collections
            </h4>
            <ul className="space-y-2 text-xs font-light">
              {footerCategories.length > 0 ? (
                footerCategories.map((category) => (
                  <li key={category}>
                    <button onClick={() => navigate("products", { category })} className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none text-neutral-400 inline-block">{category}</button>
                  </li>
                ))
              ) : (
                <li className="text-neutral-500">No collections found.</li>
              )}
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display border-l-2 border-[#FF4D6D] pl-3">
              Help & Info
            </h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <a href="#" className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 inline-block text-neutral-400">Shipping & Delivery</a>
              </li>
              <li>
                <a href="#" className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 inline-block text-neutral-400">15-Day Easy Returns</a>
              </li>
              <li>
                <a href="#" className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 inline-block text-neutral-400">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 inline-block text-neutral-400">Terms & Conditions</a>
              </li>
              <li>
                <a href="#" className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 inline-block text-neutral-400">FAQs</a>
              </li>
              {isAdminUser && (
                <li className="pt-1 border-t border-white/5">
                  <button
                    onClick={() => navigate("admin")}
                    className="footer-link-underline text-[#FF4D6D] hover:text-[#FF758F] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none font-bold inline-block bg-transparent border-none p-0"
                  >
                    Admin Dashboard
                  </button>
                </li>
              )}
            </ul>
          </div>

          {/* Contacts Column */}
          <div className="space-y-3.5">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display border-l-2 border-[#FF4D6D] pl-3">
              Contact Us
            </h4>
            <ul className="space-y-3 text-xs font-light text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin size={15} strokeWidth={1.8} className="text-[#FF4D6D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{supportAddress}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} strokeWidth={1.8} className="text-[#FF4D6D] shrink-0" />
                <a href={`tel:${supportPhone.replace(/\s+/g, "")}`} className="hover:text-[#FF4D6D] transition-colors duration-300">{supportPhone}</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} strokeWidth={1.8} className="text-[#FF4D6D] shrink-0" />
                <a href={`mailto:${supportEmail}`} className="hover:text-[#FF4D6D] transition-colors duration-300">{supportEmail}</a>
              </li>
            </ul>
          </div>

        </div>

        {/* 4 & 9. THIN DIVIDER WITH SSL SECURITY BADGE & ENLARGED PAYMENT BADGES (25px gap) */}
        <div className="pt-6 mt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3.5 text-xs font-light">
          <div className="flex items-center gap-2 text-neutral-300 font-medium">
            <Lock size={14} className="text-emerald-400 shrink-0" />
            <span className="text-white font-bold">100% SSL Secure Checkout</span>
            <span className="text-neutral-600">|</span>
            <span className="text-neutral-400 font-light">256-Bit Encrypted Payments</span>
          </div>

          {/* Enlarged +12% Payment Badges with Light Hover Glow */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap justify-center text-xs sm:text-[13px] font-extrabold text-neutral-200 tracking-wider">
            <span className="bg-white/5 border border-white/15 rounded-xl px-4 py-1.5 hover:border-[#FF4D6D] hover:text-[#FF4D6D] hover:shadow-[0_0_18px_rgba(255,77,109,0.45)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">VISA</span>
            <span className="bg-white/5 border border-white/15 rounded-xl px-4 py-1.5 hover:border-[#FF4D6D] hover:text-[#FF4D6D] hover:shadow-[0_0_18px_rgba(255,77,109,0.45)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">MasterCard</span>
            <span className="bg-white/5 border border-white/15 rounded-xl px-4 py-1.5 hover:border-[#FF4D6D] hover:text-[#FF4D6D] hover:shadow-[0_0_18px_rgba(255,77,109,0.45)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">RuPay</span>
            <span className="bg-white/5 border border-white/15 rounded-xl px-4 py-1.5 hover:border-[#FF4D6D] hover:text-[#FF4D6D] hover:shadow-[0_0_18px_rgba(255,77,109,0.45)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">UPI</span>
            <span className="bg-white/5 border border-white/15 rounded-xl px-4 py-1.5 hover:border-[#FF4D6D] hover:text-[#FF4D6D] hover:shadow-[0_0_18px_rgba(255,77,109,0.45)] hover:-translate-y-0.5 transition-all duration-300 cursor-default">Paytm</span>
          </div>
        </div>

        {/* 4. COPYRIGHT ROW (20px gap) */}
        <div className="relative z-10 pt-4 mt-4 border-t border-white/5 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-neutral-400 text-xs font-light gap-2">
          <p>© {new Date().getFullYear()} {(settings?.businessName || "Anikara").toUpperCase()}. All Rights Reserved.</p>
          <p className="tracking-wide text-[10px] text-neutral-500">Designed for the Modern Minimalist.</p>
        </div>

      </div>

      {/* 8. SUBTLE BRAND WATERMARK (Subtle opacity ~6%) */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none z-0 h-[7vw] flex items-end justify-center">
        <div className="footer-text-outline font-display font-extrabold text-[12vw] leading-none tracking-[0.18em] opacity-6 select-none uppercase translate-y-[20%] text-white/10">
          {settings?.businessName || "ANIKARA"}
        </div>
      </div>
    </footer>
  );
}
