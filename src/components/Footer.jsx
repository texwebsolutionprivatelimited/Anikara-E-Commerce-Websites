import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

export default function Footer({ navigate }) {
  return (
    <footer className="bg-[#111111] text-white pt-12 md:pt-16 pb-8 border-t border-white/5 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pb-10 md:pb-12 border-b border-white/5">
        
        {/* About column */}
        <div className="space-y-4">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Anikara Logo"
              className="h-10 w-auto object-contain invert"
            />
          </div>
          <p className="text-xs text-neutral-400 leading-relaxed font-light">
            A premium, modern fashion brand dedicated to offering high-fashion, minimal silhouettes. From comfortable lounge suits and pajamas to rich handloom sarees and tailored power suits.
          </p>
          <div className="flex space-x-4 pt-2">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FF4D6D] transition-colors" aria-label="Instagram link">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FF4D6D] transition-colors" aria-label="Facebook link">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FF4D6D] transition-colors" aria-label="Twitter link">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-neutral-400 hover:text-[#FF4D6D] transition-colors" aria-label="Youtube link">
              <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
                <polygon points="10 15 15 12 10 9"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Quick Links column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display">Collections</h4>
          <ul className="space-y-2 text-xs font-light text-neutral-400">
            <li>
              <button onClick={() => navigate("products", { category: "Night Suit" })} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Night Suits</button>
            </li>
            <li>
              <button onClick={() => navigate("products", { category: "Lounge Suit" })} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Lounge Suits</button>
            </li>
            <li>
              <button onClick={() => navigate("products", { category: "Dress" })} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Dresses</button>
            </li>
            <li>
              <button onClick={() => navigate("products", { category: "Co-ords" })} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Co-ord Sets</button>
            </li>
            <li>
              <button onClick={() => navigate("products", { category: "Ethnic Wear" })} className="hover:text-white transition-colors cursor-pointer text-left focus:outline-none">Ethnic Wear</button>
            </li>
          </ul>
        </div>

        {/* Policies / Information column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display">Help & Info</h4>
          <ul className="space-y-2 text-xs font-light text-neutral-400">
            <li>
              <a href="#" className="hover:text-white transition-colors">Shipping & Delivery</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">15-Day Easy Returns</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">Terms & Conditions</a>
            </li>
            <li>
              <a href="#" className="hover:text-white transition-colors">FAQs</a>
            </li>
          </ul>
        </div>

        {/* Contacts column */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold tracking-widest uppercase text-white/90 font-display">Contact Us</h4>
          <ul className="space-y-3 text-xs font-light text-neutral-400">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} strokeWidth={1.8} className="text-neutral-400 shrink-0 mt-0.5" />
              <span>Flat 405, Rosewood Apartments, Linking Road, Mumbai, MH, 400054</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} strokeWidth={1.8} className="text-neutral-400 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} strokeWidth={1.8} className="text-neutral-400 shrink-0" />
              <span>support@anikarafashion.com</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col md:flex-row items-center justify-between text-center md:text-left text-neutral-500 text-[10px] md:text-xs font-light gap-3 md:gap-6">
        <p>© {new Date().getFullYear()} Anikara Fashion. All Rights Reserved.</p>
        <p className="tracking-wide">Designed for the Modern Minimalist.</p>
      </div>
    </footer>
  );
}
