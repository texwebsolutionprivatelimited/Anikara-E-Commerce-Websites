import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Sparkles, Mail, Check, Shield, Hourglass } from "lucide-react";

export default function MaintenanceMode({ navigate }) {
  const { settings, addToast } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      addToast("You've been added to our exclusive notification list!", "success");
      setSubscribed(true);
      setEmail("");
    }
  };

  const brandName = settings?.businessName || "Anikara";

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-between text-white relative overflow-hidden font-sans px-4 py-8 select-none">
      
      {/* ── Background Glow Effects ── */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] bg-gradient-to-tr from-[#FF4D6D]/10 to-transparent rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-gradient-to-br from-neutral-800/10 to-transparent rounded-full blur-[80px] pointer-events-none z-0" />

      {/* ── Top Bar / Logo ── */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex justify-center py-4 sm:py-6">
        <div className="flex items-center gap-2">
          <Hourglass className="text-[#FF4D6D] animate-spin" size={20} style={{ animationDuration: '4s' }} />
          <span className="text-sm font-black tracking-[0.25em] font-display text-white uppercase">{brandName}</span>
        </div>
      </header>

      {/* ── Main Message Card ── */}
      <main className="relative z-10 my-auto max-w-lg w-full text-center space-y-8 px-2 sm:px-6">
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black tracking-widest text-[#FF4D6D] bg-[#FF4D6D]/10 border border-[#FF4D6D]/20 uppercase">
            <Sparkles size={10} /> Crafting Luxury
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-none text-white font-display uppercase">
            Updating Our<br />Silhouettes
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed max-w-md mx-auto">
            We are currently tailoring a more premium, seamless fashion experience for you. We'll be back shortly with a stunning new drop and dynamic design enhancements.
          </p>
        </div>

        {/* Glassmorphic Signup Box */}
        <div className="backdrop-blur-md bg-white/5 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="space-y-1">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Be the First to Know</p>
            <p className="text-[10px] text-neutral-400 font-light">Enter your email to receive early access codes and dynamic launch alerts.</p>
          </div>

          {subscribed ? (
            <div className="flex items-center justify-center gap-2 text-[#22c55e] text-xs font-bold bg-[#22c55e]/10 border border-[#22c55e]/20 p-3.5 rounded-lg animate-pulse">
              <Check size={14} /> Subscription Activated!
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-11 text-xs bg-white/5 border border-white/10 text-white placeholder:text-neutral-500 rounded-lg px-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D]/30 transition-all font-light"
                />
              </div>
              <button
                type="submit"
                className="h-11 bg-white hover:bg-[#FF4D6D] hover:text-white text-black text-xs font-bold tracking-widest uppercase px-6 rounded-lg transition-all duration-300 flex items-center justify-center gap-1.5 shrink-0 focus:outline-none cursor-pointer"
              >
                <Mail size={13} /> Notify Me
              </button>
            </form>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between text-neutral-600 text-[10px] sm:text-xs font-light gap-4 pt-6 border-t border-white/5 mt-8">
        <p>© 2026 {brandName.toUpperCase()}. All Rights Reserved.</p>
        <p className="tracking-wide">Designed for the Modern Minimalist.</p>
        
        {/* Subtle back-door access for the Admin */}
        <button
          onClick={() => navigate("admin")}
          className="flex items-center gap-1 text-neutral-700 hover:text-[#FF4D6D] transition-colors focus:outline-none text-[10px] font-bold uppercase tracking-widest"
        >
          <Shield size={11} /> Admin Backdoor
        </button>
      </footer>

    </div>
  );
}
