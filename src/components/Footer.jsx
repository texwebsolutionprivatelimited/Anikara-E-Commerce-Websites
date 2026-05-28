import React from "react";
import { Mail, Phone, MapPin, Shield, Truck, RotateCcw, Lock, Award } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Footer({ navigate }) {
  const { addToast, settings } = useApp();

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    const emailInput = e.target.elements.newsletterEmail.value;
    if (emailInput) {
      addToast("Thank you for subscribing to our Newsletter!", "success");
      e.target.reset();
    }
  };

  return (
    <footer className="relative overflow-hidden bg-[#080808] text-white pt-16 pb-8 border-t border-white/5 font-sans shadow-[0_0_120px_rgba(255,105,180,0.06)]">
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/4 w-[350px] h-[350px] bg-[#FF4D6D]/4 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-purple-500/3 rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/2 rounded-full blur-[150px] pointer-events-none z-0" />


      <div className="relative z-10 max-w-[1450px] mx-auto px-4 sm:px-8 lg:px-10 space-y-16">
        
        {/* Row 1: USP Trust Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-md hover:bg-white/[0.03] hover:border-[#FF4D6D]/20 hover:shadow-[0_8px_30px_rgba(255,77,109,0.04)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#FF4D6D] group-hover:bg-[#FF4D6D]/10 group-hover:border-[#FF4D6D]/30 transition-all duration-300">
              <Truck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide group-hover:text-[#FF4D6D] transition-colors duration-300">Free Shipping</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">Complimentary shipping on all orders above ₹999.</p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-md hover:bg-white/[0.03] hover:border-[#FF4D6D]/20 hover:shadow-[0_8px_30px_rgba(255,77,109,0.04)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#FF4D6D] group-hover:bg-[#FF4D6D]/10 group-hover:border-[#FF4D6D]/30 transition-all duration-300">
              <RotateCcw size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide group-hover:text-[#FF4D6D] transition-colors duration-300">15-Day Returns</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">Hassle-free, no-questions-asked exchanges.</p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-md hover:bg-white/[0.03] hover:border-[#FF4D6D]/20 hover:shadow-[0_8px_30px_rgba(255,77,109,0.04)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#FF4D6D] group-hover:bg-[#FF4D6D]/10 group-hover:border-[#FF4D6D]/30 transition-all duration-300">
              <Lock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide group-hover:text-[#FF4D6D] transition-colors duration-300">Secure Payments</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">100% secure encrypted gateway protection.</p>
            </div>
          </div>

          <div className="group flex items-start gap-4 p-5 rounded-2xl bg-white/[0.01] border border-white/[0.03] backdrop-blur-md hover:bg-white/[0.03] hover:border-[#FF4D6D]/20 hover:shadow-[0_8px_30px_rgba(255,77,109,0.04)] transition-all duration-300">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[#FF4D6D] group-hover:bg-[#FF4D6D]/10 group-hover:border-[#FF4D6D]/30 transition-all duration-300">
              <Award size={20} />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white tracking-wide group-hover:text-[#FF4D6D] transition-colors duration-300">Premium Quality</h4>
              <p className="text-xs text-neutral-400 mt-1 font-light leading-relaxed">Handpicked fabrics and high-fashion silhouettes.</p>
            </div>
          </div>
        </div>

        {/* Row 2: Premium Newsletter Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white/[0.02] to-white/[0.01] border border-white/5 p-8 md:p-10 backdrop-blur-md shadow-[0_8px_32px_0_rgba(0,0,0,0.37)]">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[250px] h-[250px] bg-[#FF4D6D]/5 rounded-full blur-[80px] pointer-events-none" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 text-[#FF4D6D] text-[10px] font-bold uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FF4D6D] animate-pulse" /> Exclusive Access
              </div>
              <h2 className="text-xl md:text-3xl font-extrabold tracking-tight text-white font-display">
                JOIN THE {(settings?.businessName || "Anikara").toUpperCase()} CLUB
              </h2>
              <p className="text-xs md:text-sm text-neutral-400 font-light max-w-xl leading-relaxed">
                Subscribe to get exclusive early access to drop collections, limited-edition codes, and premium lookbooks.
              </p>
            </div>
            
            <div className="lg:col-span-5 w-full">
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    name="newsletterEmail"
                    required
                    placeholder="Enter your email address"
                    className="w-full bg-white/5 border border-white/10 text-white text-xs px-6 py-4 rounded-full backdrop-blur-md focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] placeholder:text-neutral-500 font-light transition-all duration-300"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-white hover:bg-[#FF4D6D] border border-transparent text-[#111111] hover:text-white text-xs font-bold tracking-widest uppercase px-8 py-4 rounded-full transition-all duration-300 shrink-0 font-display cursor-pointer hover:shadow-[0_0_20px_rgba(255,77,109,0.3)] focus:outline-none"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Row 3: Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pt-4">
          
          {/* About Column */}
          <div className="space-y-5">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Anikara Logo"
                className="h-10 w-auto object-contain invert"
              />
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              Dedicated to offering high-fashion, minimal silhouettes. From comfortable lounge suits and pajamas to rich handloom sarees and tailored power suits.
            </p>
            <div className="flex space-x-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 hover:shadow-[0_0_15px_rgba(255,77,109,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center" aria-label="Instagram link">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" y2="6.5"/>
                </svg>
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 hover:shadow-[0_0_15px_rgba(255,77,109,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center" aria-label="Facebook link">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 hover:shadow-[0_0_15px_rgba(255,77,109,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center" aria-label="Twitter link">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 text-neutral-400 hover:text-white hover:border-[#FF4D6D] hover:bg-[#FF4D6D]/10 hover:shadow-[0_0_15px_rgba(255,77,109,0.2)] hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center" aria-label="Youtube link">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                  <polygon points="10 15 15 12 10 9"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display border-l-2 border-[#FF4D6D] pl-3">
              Collections
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              <li>
                <button onClick={() => navigate("products", { category: "Night Suit" })} className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none text-neutral-400 inline-block">Night Suits</button>
              </li>
              <li>
                <button onClick={() => navigate("products", { category: "Lounge Suit" })} className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none text-neutral-400 inline-block">Lounge Suits</button>
              </li>
              <li>
                <button onClick={() => navigate("products", { category: "Dress" })} className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none text-neutral-400 inline-block">Dresses</button>
              </li>
              <li>
                <button onClick={() => navigate("products", { category: "Co-ords" })} className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none text-neutral-400 inline-block">Co-ord Sets</button>
              </li>
              <li>
                <button onClick={() => navigate("products", { category: "Ethnic Wear" })} className="footer-link-underline hover:text-[#FF4D6D] hover:translate-x-1.5 transition-all duration-300 cursor-pointer text-left focus:outline-none text-neutral-400 inline-block">Ethnic Wear</button>
              </li>
            </ul>
          </div>

          {/* Help Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display border-l-2 border-[#FF4D6D] pl-3">
              Help & Info
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
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
            </ul>
          </div>

          {/* Contacts Column */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display border-l-2 border-[#FF4D6D] pl-3">
              Contact Us
            </h4>
            <ul className="space-y-3.5 text-xs font-light text-neutral-400">
              <li className="flex items-start gap-3">
                <MapPin size={16} strokeWidth={1.8} className="text-[#FF4D6D] shrink-0 mt-0.5" />
                <span className="leading-relaxed">Flat 405, Rosewood Apartments, Linking Road, Mumbai, MH, 400054</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} strokeWidth={1.8} className="text-[#FF4D6D] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#FF4D6D] transition-colors duration-300">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} strokeWidth={1.8} className="text-[#FF4D6D] shrink-0" />
                <a href="mailto:support@anikarafashion.com" className="hover:text-[#FF4D6D] transition-colors duration-300">support@anikarafashion.com</a>
              </li>
            </ul>
          </div>


        </div>

        {/* Row 4: Trust Icons and Copyright Info */}
        <div className="relative z-10 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-neutral-500 text-xs font-light gap-6">
          <div className="space-y-1">
            <p>© {new Date().getFullYear()} {(settings?.businessName || "Anikara").toUpperCase()}. All Rights Reserved.</p>
            <p className="tracking-wide text-[10px] text-neutral-600">Designed for the Modern Minimalist.</p>
          </div>

          {/* Minimalist Payment Badges */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="bg-white/[0.02] border border-white/10 rounded px-2.5 py-1 text-[9px] font-bold text-neutral-400 tracking-wider hover:border-emerald-500 hover:text-emerald-400 transition-all cursor-default">UPI</span>
            <span className="bg-white/[0.02] border border-white/10 rounded px-2.5 py-1 text-[9px] font-bold text-neutral-400 tracking-wider hover:border-blue-500 hover:text-blue-400 transition-all cursor-default">VISA</span>
            <span className="bg-white/[0.02] border border-white/10 rounded px-2.5 py-1 text-[9px] font-bold text-neutral-400 tracking-wider hover:border-amber-500 hover:text-amber-400 transition-all cursor-default">MC</span>
            <span className="bg-white/[0.02] border border-white/10 rounded px-2.5 py-1 text-[9px] font-bold text-neutral-400 tracking-wider hover:border-orange-500 hover:text-orange-400 transition-all cursor-default">RUPAY</span>
          </div>

          <button
            onClick={() => navigate("admin")}
            className="flex items-center gap-1.5 text-neutral-500 hover:text-[#FF4D6D] hover:shadow-[0_0_10px_rgba(255,77,109,0.1)] transition-colors focus:outline-none text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full bg-white/5 border border-white/10 cursor-pointer"
          >
            <Shield size={12} /> Admin Panel
          </button>
        </div>

      </div>

      {/* Unique Watermark Brand Typography Background */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden pointer-events-none select-none z-0 h-[10vw] flex items-end justify-center">
        <div className="footer-text-outline font-display font-extrabold text-[12vw] leading-none tracking-[0.18em] opacity-100 select-none uppercase translate-y-[20%]">
          {settings?.businessName || "ANIKARA"}
        </div>
      </div>
    </footer>
  );
}
