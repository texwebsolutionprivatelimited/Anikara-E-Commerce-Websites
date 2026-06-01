import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from "lucide-react";

export default function Login({ navigate, currentParams = {} }) {
  const { loginUser, registerUser, loginWithGoogle, settings } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = currentParams?.redirectTo;
  const rawAdminEmails =
    import.meta.env.VITE_ADMIN_EMAILS ||
    import.meta.env.VITE_ADMIN_EMAIL ||
    settings?.adminEmail ||
    "";
  const adminEmails = String(rawAdminEmails)
    .split(",")
    .map((e) => e.toLowerCase().trim())
    .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (isLoginView) {
      if (email.trim() && password.trim()) {
        const res = await loginUser(email, password);
        if (res.success) {
          const isAdminLogin = adminEmails.includes(email.toLowerCase().trim());
          navigate(redirectTo === "admin" || isAdminLogin ? "admin" : "profile");
        }
      }
    } else {
      if (name.trim() && email.trim() && password.trim()) {
        const res = await registerUser(name, email, password);
        if (res.success) navigate("profile");
      }
    }
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      const userEmail = (res.user?.email || "").toLowerCase().trim();
      const isAdminLogin = adminEmails.includes(userEmail);
      navigate(redirectTo === "admin" || isAdminLogin ? "admin" : "profile");
    }
  };

  return (
    <div className="min-h-[60vh] sm:min-h-[85vh] flex items-start sm:items-center justify-center py-4 sm:py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/70 font-sans">
      <div className="max-w-5xl w-full bg-white border border-neutral-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px] transition-all duration-500">
        
        {/* Left Side: Editorial Banner */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-6 relative overflow-hidden bg-neutral-950 flex-col justify-between p-10 text-white select-none">
          {/* Background Image */}
          <img
            src="/login_banner.png"
            alt="Fashion Model Editorial"
            className="absolute inset-0 w-full h-full object-cover opacity-75 object-center transform scale-100 hover:scale-105 transition-transform duration-[4000ms]"
          />
          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 mix-blend-multiply z-10" />

          {/* Top Brand Tag */}
          <div className="relative z-20">
            <button 
              onClick={() => navigate("home")}
              className="flex items-center gap-1 hover:opacity-85 transition-opacity cursor-pointer focus:outline-none"
            >
              <img src="/logo.png" alt="Anikara Logo" className="h-9 w-auto object-contain invert" />
            </button>
          </div>

          {/* Bottom Editorial Content */}
          <div className="relative z-20 space-y-4">
            <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FF4D6D]">
              Atelier Collection
            </p>
            <h3 className="text-2xl lg:text-3.5xl font-extrabold tracking-tight leading-tight font-display">
              REDEFINE YOUR STYLE SILHOUETTE
            </h3>
            <p className="text-xs text-neutral-300 font-light leading-relaxed max-w-sm">
              Join the Anikara club to track premium orders, save minimal looks, and get early drop access.
            </p>
          </div>
        </div>

        {/* Right Side: Interactive Forms */}
        <div className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center p-8 sm:p-12 md:p-14 space-y-8 bg-white">
          {/* Header / Intro */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5 md:hidden">
              <img src="/logo.png" alt="Anikara Logo" className="h-7 w-auto object-contain" />
            </div>
            <h2 className="text-xl font-bold tracking-[0.1em] text-neutral-900 font-display uppercase mt-2">
              {isLoginView ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              {isLoginView
                ? "Access your minimal wardrobe collection and history."
                : "Sign up to start your premium tailoring experience."}
            </p>
          </div>

          {/* Tab Selection */}
          <div className="flex border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-400 font-display relative">
            <button
              onClick={() => setIsLoginView(true)}
              className={`flex-1 pb-3 text-center border-b-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                isLoginView
                  ? "border-[#FF4D6D] text-neutral-955 font-bold"
                  : "border-transparent hover:text-neutral-600 font-medium"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLoginView(false)}
              className={`flex-1 pb-3 text-center border-b-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                !isLoginView
                  ? "border-[#FF4D6D] text-neutral-955 font-bold"
                  : "border-transparent hover:text-neutral-600 font-medium"
              }`}
            >
              Register
            </button>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLoginView && (
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                  Full Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3.5 pl-10 pr-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                  />
                  <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="E.g., name@example.com"
                  className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3.5 pl-10 pr-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                />
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                  Password
                </label>
                {isLoginView && (
                  <a href="#" className="text-[10px] text-neutral-400 hover:text-[#FF4D6D] hover:underline font-light">
                    Forgot Password?
                  </a>
                )}
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3.5 pl-10 pr-12 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                />
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                
                {/* Password Visibility Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#FF4D6D] focus:outline-none cursor-pointer p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-lg cursor-pointer hover:shadow-[0_10px_20px_rgba(255,77,109,0.15)] focus:outline-none disabled:opacity-50 mt-2"
            >
              {isSubmitting ? "Processing..." : (isLoginView ? "Sign In" : "Create Account")}
              {!isSubmitting && <ArrowRight size={14} />}
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center justify-center font-sans">
            <div className="border-t border-neutral-100 w-full" />
            <span className="absolute bg-white px-4 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
              Or Connect With
            </span>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full h-11 border border-neutral-200 hover:border-neutral-800 text-neutral-700 hover:text-neutral-955 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors rounded-lg focus:outline-none cursor-pointer bg-white"
          >
            <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

      </div>
    </div>
  );
}
