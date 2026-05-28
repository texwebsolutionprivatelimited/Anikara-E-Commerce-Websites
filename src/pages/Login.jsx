import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

export default function Login({ navigate }) {
  const { loginUser, registerUser, settings } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoginView) {
      if (email.trim() && password.trim()) {
        loginUser(email, password);
        navigate("profile");
      }
    } else {
      if (name.trim() && email.trim() && password.trim()) {
        registerUser(name, email, password);
        navigate("profile");
      }
    }
  };

  const handleGoogleLogin = () => {
    loginUser("google.user@gmail.com", "google-oauth");
    navigate("profile");
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/50 font-sans">
      <div className="max-w-md w-full bg-white border border-neutral-200/50 p-5 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] rounded-md space-y-6">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <h2 className="text-lg font-bold tracking-[0.2em] font-display text-neutral-900 uppercase">
            {(settings?.businessName || "Anikara").toUpperCase()} FASHION
          </h2>
          <p className="text-xs text-neutral-400 font-light leading-normal">
            {isLoginView
              ? "Access your account, orders, and wishlist history."
              : "Create an account to track delivery progress."}
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-400 font-display">
          <button
            onClick={() => setIsLoginView(true)}
            className={`flex-1 pb-3 text-center border-b-2 focus:outline-none cursor-pointer ${
              isLoginView ? "border-[#FF4D6D] text-neutral-900" : "border-transparent hover:text-neutral-600"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLoginView(false)}
            className={`flex-1 pb-3 text-center border-b-2 focus:outline-none cursor-pointer ${
              !isLoginView ? "border-[#FF4D6D] text-neutral-900" : "border-transparent hover:text-neutral-600"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginView && (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="E.g., Ajeet Kumar"
                  className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:border-[#111111] placeholder:text-neutral-400 font-light"
                />
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ajeet@example.com"
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:border-[#111111] placeholder:text-neutral-400 font-light"
              />
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-baseline mb-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                Password
              </label>
              {isLoginView && (
                <a href="#" className="text-[10px] text-neutral-400 hover:text-black underline">
                  Forgot Password?
                </a>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs bg-neutral-50 border border-neutral-200 rounded-md py-3 pl-10 pr-4 focus:outline-none focus:border-[#111111] placeholder:text-neutral-400 font-light"
              />
              <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full h-12 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2 rounded-xs cursor-pointer focus:outline-none"
          >
            {isLoginView ? "Sign In" : "Create Account"}
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4 font-sans">
          <div className="border-t border-neutral-200 w-full" />
          <span className="absolute bg-white px-3 text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">
            Or Connect With
          </span>
        </div>

        {/* Google OAuth Mock */}
        <button
          onClick={handleGoogleLogin}
          type="button"
          className="w-full h-11 border border-neutral-200 hover:border-neutral-800 text-neutral-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors rounded-xs focus:outline-none cursor-pointer"
        >
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

      </div>
    </div>
  );
}
