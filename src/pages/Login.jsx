import React, { useState, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Phone, Check, AlertCircle, RefreshCw, Loader2 } from "lucide-react";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ navigate, currentParams = {} }) {
  const { loginUser, registerUser, loginWithGoogle, settings, addToast } = useApp();

  // Mode: isLoginView (true = Sign In, false = Register)
  const [isLoginView, setIsLoginView] = useState(true);

  // Method for Sign In: "email" | "mobile"
  const [authMethod, setAuthMethod] = useState("email");

  // Mobile Auth Step: "phone" | "otp"
  const [step, setStep] = useState("phone");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Form Input States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  // OTP State (6 boxes)
  const [otpBoxes, setOtpBoxes] = useState(["", "", "", "", "", ""]);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [resendTimer, setResendTimer] = useState(0);

  // Status States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [authError, setAuthError] = useState("");

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

  // Resend Timer Countdown Effect
  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  // Setup Firebase reCAPTCHA Verifier
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {},
        "expired-callback": () => {
          setAuthError("reCAPTCHA expired. Please try sending OTP again.");
        }
      });
    }
  };

  // Mobile Phone Validation (Exactly 10 Indian digits)
  const cleanPhone = phone.replace(/\D/g, "");
  const isPhoneValid = cleanPhone.length === 10;
  const isOtpComplete = otpBoxes.join("").length === 6;

  // Send Mobile OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setAuthError("");

    if (!isPhoneValid) {
      setAuthError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    setIsSendingOtp(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const fullPhoneNumber = `+91${cleanPhone}`;
      
      const confirmation = await signInWithPhoneNumber(auth, fullPhoneNumber, appVerifier);
      window.confirmationResult = confirmation;
      setConfirmationResult(confirmation);
      setStep("otp");
      setResendTimer(30);
      setOtpBoxes(["", "", "", "", "", ""]);
      addToast(`OTP sent to +91 ${cleanPhone}`, "success");
    } catch (err) {
      console.error("Firebase Phone Auth Error:", err);
      if (err.code === "auth/invalid-phone-number") {
        setAuthError("Invalid phone number format. Please check your 10-digit number.");
      } else if (err.code === "auth/too-many-requests") {
        setAuthError("Too many OTP attempts. Please wait a while before retrying.");
      } else {
        setAuthError(err.message || "Failed to send OTP. Please try again.");
      }
      addToast("Failed to send OTP", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // OTP 6-box input handlers
  const handleOtpChange = (index, value) => {
    const val = value.replace(/\D/g, "").slice(-1);
    const newOtp = [...otpBoxes];
    newOtp[index] = val;
    setOtpBoxes(newOtp);

    // Auto focus next box
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-box-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otpBoxes[index] && index > 0) {
      const prevInput = document.getElementById(`otp-box-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      const newOtp = ["", "", "", "", "", ""];
      pastedData.split("").forEach((char, idx) => {
        if (idx < 6) newOtp[idx] = char;
      });
      setOtpBoxes(newOtp);
      const focusIdx = Math.min(pastedData.length, 5);
      const targetInput = document.getElementById(`otp-box-${focusIdx}`);
      if (targetInput) targetInput.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const enteredOtp = otpBoxes.join("");
    setAuthError("");

    if (enteredOtp.length !== 6) {
      setAuthError("Please enter complete 6-digit OTP code.");
      return;
    }

    setIsVerifyingOtp(true);
    try {
      const conf = confirmationResult || window.confirmationResult;
      if (conf) {
        const result = await conf.confirm(enteredOtp);
        setIsSuccess(true);
        addToast("Phone verified successfully!", "success");
        setTimeout(() => {
          const userEmail = (result.user?.email || "").toLowerCase().trim();
          const isAdminLogin = adminEmails.includes(userEmail);
          navigate(redirectTo === "admin" || isAdminLogin ? "admin" : "profile");
        }, 1200);
      } else {
        setAuthError("Session expired. Please resend OTP.");
      }
    } catch (err) {
      console.error("OTP Verification Error:", err);
      setAuthError("Invalid OTP entered. Please check the code and try again.");
      addToast("Invalid OTP code", "error");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Email Submit
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    if (isLoginView) {
      if (email.trim() && password.trim()) {
        const res = await loginUser(email, password);
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => {
            const isAdminLogin = adminEmails.includes(email.toLowerCase().trim());
            navigate(redirectTo === "admin" || isAdminLogin ? "admin" : "profile");
          }, 1000);
        } else {
          setAuthError(res.error || "Invalid Email or Password. Please try again.");
        }
      }
    } else {
      if (name.trim() && email.trim() && password.trim()) {
        const res = await registerUser(name, email, password);
        if (res.success) {
          setIsSuccess(true);
          setTimeout(() => navigate("profile"), 1000);
        } else {
          setAuthError(res.error || "Registration failed. Please try again.");
        }
      }
    }
    setIsSubmitting(false);
  };

  // Google Submit
  const handleGoogleLogin = async () => {
    setAuthError("");
    setIsSubmitting(true);
    const res = await loginWithGoogle();
    setIsSubmitting(false);
    if (res.success) {
      setIsSuccess(true);
      const userEmail = (res.user?.email || "").toLowerCase().trim();
      const isAdminLogin = adminEmails.includes(userEmail);
      setTimeout(() => {
        navigate(redirectTo === "admin" || isAdminLogin ? "admin" : "profile");
      }, 1000);
    } else {
      setAuthError(res.error || "Google login failed.");
    }
  };

  return (
    <div className="min-h-[60vh] sm:min-h-[85vh] flex items-start sm:items-center justify-center py-4 sm:py-12 px-4 sm:px-6 lg:px-8 bg-neutral-50/70 font-sans">
      {/* Invisible Firebase reCAPTCHA Container */}
      <div id="recaptcha-container"></div>

      <div className="max-w-5xl w-full bg-white border border-neutral-200/50 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-2xl overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px] transition-all duration-500">
        
        {/* Left Side: Editorial Banner */}
        <div className="hidden md:flex md:col-span-5 lg:col-span-6 relative overflow-hidden bg-neutral-950 flex-col justify-between p-10 text-white select-none">
          <img
            src="/login_banner.png"
            alt="Fashion Model Editorial"
            className="absolute inset-0 w-full h-full object-cover opacity-75 object-center transform scale-100 hover:scale-105 transition-transform duration-[4000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/50 mix-blend-multiply z-10" />

          <div className="relative z-20">
            <button 
              onClick={() => navigate("home")}
              className="flex items-center gap-1 hover:opacity-85 transition-opacity cursor-pointer focus:outline-none"
            >
              <img src="/logo.png" alt="Anikara Logo" className="h-9 w-auto object-contain invert" />
            </button>
          </div>

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

        {/* Right Side: Interactive Authentication Forms */}
        <div className="col-span-1 md:col-span-7 lg:col-span-6 flex flex-col justify-center p-8 sm:p-12 md:p-14 space-y-6 bg-white">
          
          {/* Header */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 md:hidden">
              <img src="/logo.png" alt="Anikara Logo" className="h-7 w-auto object-contain" />
            </div>
            <h2 className="text-xl font-bold tracking-[0.1em] text-neutral-900 font-display uppercase mt-1">
              {isLoginView ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              {isLoginView
                ? "Access your minimal wardrobe collection and history."
                : "Sign up to start your premium tailoring experience."}
            </p>
          </div>

          {/* Top Main View Toggle Tabs: [ Sign In ] [ Register ] */}
          <div className="flex border-b border-neutral-100 text-xs font-bold uppercase tracking-wider text-neutral-400 font-display">
            <button
              onClick={() => { setIsLoginView(true); setStep("phone"); setAuthError(""); }}
              className={`flex-1 pb-3 text-center border-b-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                isLoginView
                  ? "border-[#FF4D6D] text-neutral-950 font-extrabold"
                  : "border-transparent hover:text-neutral-600 font-medium"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsLoginView(false); setStep("phone"); setAuthError(""); }}
              className={`flex-1 pb-3 text-center border-b-2 transition-all duration-300 focus:outline-none cursor-pointer ${
                !isLoginView
                  ? "border-[#FF4D6D] text-neutral-950 font-extrabold"
                  : "border-transparent hover:text-neutral-600 font-medium"
              }`}
            >
              Register
            </button>
          </div>

          {/* Success Screen Animation Overlay */}
          {isSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-3 py-10 animate-fade-in text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-100 border-2 border-emerald-500 text-emerald-600 flex items-center justify-center shadow-lg animate-bounce">
                <Check size={32} className="stroke-[3]" />
              </div>
              <h3 className="text-lg font-black text-neutral-900 font-display">✓ Welcome to Anikara</h3>
              <p className="text-xs text-neutral-500 font-light">Redirecting to your account dashboard...</p>
            </div>
          ) : (
            <>
              {/* Error Message Alert */}
              {authError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2 animate-fade-in">
                  <AlertCircle size={15} className="shrink-0 text-rose-600" />
                  <span className="flex-1">{authError}</span>
                </div>
              )}

              {/* -------------------- SIGN IN VIEW -------------------- */}
              {isLoginView && (
                <>
                  {/* Segmented Method Switch Pill: [ Email ] [ Mobile ] */}
                  <div className="bg-neutral-100 p-1 rounded-xl flex items-center border border-neutral-200/60 font-sans">
                    <button
                      type="button"
                      onClick={() => { setAuthMethod("email"); setStep("phone"); setAuthError(""); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                        authMethod === "email"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => { setAuthMethod("mobile"); setStep("phone"); setAuthError(""); }}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all duration-300 cursor-pointer ${
                        authMethod === "mobile"
                          ? "bg-white text-neutral-900 shadow-sm"
                          : "text-neutral-500 hover:text-neutral-800"
                      }`}
                    >
                      Mobile OTP
                    </button>
                  </div>

                  {/* A) EMAIL SIGN IN FORM */}
                  {authMethod === "email" && (
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
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
                          <a href="#" className="text-[10px] text-neutral-400 hover:text-[#FF4D6D] hover:underline font-light shrink-0">
                            Forgot Password?
                          </a>
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
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#FF4D6D] focus:outline-none cursor-pointer p-1"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-12 min-h-[48px] bg-[#111111] hover:bg-[#FF4D6D] active:scale-[0.98] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xl cursor-pointer hover:shadow-[0_10px_20px_rgba(255,77,109,0.2)] focus:outline-none disabled:opacity-50 mt-2 font-sans"
                      >
                        {isSubmitting ? (
                          <span className="flex items-center gap-2">
                            <Loader2 size={16} className="animate-spin" /> Processing...
                          </span>
                        ) : (
                          <>
                            <span>Sign In</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* B) MOBILE OTP SIGN IN FORM */}
                  {authMethod === "mobile" && (
                    <div className="space-y-4">
                      {step === "phone" ? (
                        <form onSubmit={handleSendOtp} className="space-y-4">
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                              Mobile Number
                            </label>
                            <div className="flex gap-2">
                              <div className="flex items-center justify-center px-3 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-extrabold text-neutral-800 shrink-0">
                                🇮🇳 +91
                              </div>
                              <div className="relative flex-1">
                                <input
                                  type="tel"
                                  required
                                  maxLength={10}
                                  value={phone}
                                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                  placeholder="9876543210"
                                  className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3.5 pl-10 pr-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                                />
                                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                              </div>
                            </div>
                            <p className="text-[9.5px] text-neutral-400 font-light">Enter 10-digit Indian mobile number for instant OTP authentication.</p>
                          </div>

                          <button
                            type="submit"
                            disabled={!isPhoneValid || isSendingOtp}
                            className={`w-full h-12 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-lg cursor-pointer focus:outline-none ${
                              isPhoneValid && !isSendingOtp
                                ? "bg-[#111111] hover:bg-[#FF4D6D] hover:shadow-[0_10px_20px_rgba(255,77,109,0.15)]"
                                : "bg-neutral-300 cursor-not-allowed"
                            }`}
                          >
                            {isSendingOtp ? (
                              <span className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Sending OTP...
                              </span>
                            ) : (
                              <>
                                <span>Send OTP</span>
                                <ArrowRight size={14} />
                              </>
                            )}
                          </button>
                        </form>
                      ) : (
                        /* OTP Verification Screen (6-box) */
                        <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                          <div className="text-center space-y-1">
                            <p className="text-xs font-bold text-neutral-800">
                              Enter 6-Digit OTP sent to <span className="text-[#FF4D6D]">+91 {cleanPhone}</span>
                            </p>
                            <button
                              type="button"
                              onClick={() => setStep("phone")}
                              className="text-[10px] text-neutral-400 hover:text-[#FF4D6D] underline"
                            >
                              Edit Phone Number
                            </button>
                          </div>

                          {/* 6 OTP Input Boxes */}
                          <div className="flex justify-center gap-2 py-2" onPaste={handleOtpPaste}>
                            {otpBoxes.map((digit, idx) => (
                              <input
                                key={idx}
                                id={`otp-box-${idx}`}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                className="w-10 h-12 text-center text-base font-extrabold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/30 focus:bg-white transition-all shadow-xs"
                              />
                            ))}
                          </div>

                          {/* Resend Timer */}
                          <div className="flex items-center justify-between text-xs pt-1">
                            <span className="text-neutral-400 font-light">Didn't receive code?</span>
                            {resendTimer > 0 ? (
                              <span className="font-extrabold text-[#FF4D6D]">
                                Resend OTP ({resendTimer}s)
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                className="font-bold text-neutral-900 hover:text-[#FF4D6D] flex items-center gap-1 cursor-pointer focus:outline-none"
                              >
                                <RefreshCw size={12} /> Resend OTP
                              </button>
                            )}
                          </div>

                          <button
                            type="submit"
                            disabled={!isOtpComplete || isVerifyingOtp}
                            className={`w-full h-12 text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-lg focus:outline-none ${
                              isOtpComplete && !isVerifyingOtp
                                ? "bg-[#111111] hover:bg-[#FF4D6D] hover:shadow-[0_10px_20px_rgba(255,77,109,0.15)] cursor-pointer"
                                : "bg-neutral-300 cursor-not-allowed"
                            }`}
                          >
                            {isVerifyingOtp ? (
                              <span className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" /> Verifying OTP...
                              </span>
                            ) : (
                              <span>Verify & Continue</span>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  )}
                </>
              )}

              {/* -------------------- REGISTER VIEW -------------------- */}
              {!isLoginView && (
                <div className="space-y-4">
                  {step === "phone" ? (
                    <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                      <div className="space-y-1">
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
                            className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                          />
                          <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                          Email Address
                        </label>
                        <div className="relative">
                          <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@example.com"
                            className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                          />
                          <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                          Mobile Number
                        </label>
                        <div className="flex gap-2">
                          <div className="flex items-center justify-center px-2.5 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-extrabold text-neutral-800 shrink-0">
                            +91
                          </div>
                          <div className="relative flex-1">
                            <input
                              type="tel"
                              maxLength={10}
                              value={phone}
                              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                              placeholder="9876543210"
                              className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3 pl-10 pr-4 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                            />
                            <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="block text-[9px] font-bold uppercase tracking-widest text-neutral-500">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full text-xs bg-neutral-50 border border-neutral-200/80 rounded-lg py-3 pl-10 pr-12 focus:outline-none focus:border-[#FF4D6D] focus:ring-1 focus:ring-[#FF4D6D] focus:bg-white placeholder:text-neutral-400 font-light transition-all duration-300"
                          />
                          <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#FF4D6D] focus:outline-none cursor-pointer p-1"
                          >
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-lg cursor-pointer hover:shadow-[0_10px_20px_rgba(255,77,109,0.15)] focus:outline-none disabled:opacity-50"
                      >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                        {!isSubmitting && <ArrowRight size={14} />}
                      </button>
                    </form>
                  ) : (
                    /* Mobile OTP Register Flow */
                    <form onSubmit={handleVerifyOtp} className="space-y-4 animate-fade-in">
                      <div className="text-center space-y-1">
                        <p className="text-xs font-bold text-neutral-800">
                          Enter 6-Digit OTP sent to <span className="text-[#FF4D6D]">+91 {cleanPhone}</span>
                        </p>
                      </div>

                      <div className="flex justify-center gap-2 py-2" onPaste={handleOtpPaste}>
                        {otpBoxes.map((digit, idx) => (
                          <input
                            key={idx}
                            id={`otp-box-${idx}`}
                            type="text"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                            className="w-10 h-12 text-center text-base font-extrabold bg-neutral-50 border border-neutral-300 rounded-xl focus:outline-none focus:border-[#FF4D6D] focus:ring-2 focus:ring-[#FF4D6D]/30 focus:bg-white transition-all shadow-xs"
                          />
                        ))}
                      </div>

                      <button
                        type="submit"
                        disabled={!isOtpComplete || isVerifyingOtp}
                        className="w-full h-11 bg-[#111111] hover:bg-[#FF4D6D] text-white text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-lg focus:outline-none"
                      >
                        {isVerifyingOtp ? "Creating Account..." : "Verify & Create Account"}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* Divider */}
              <div className="relative flex items-center justify-center font-sans my-2">
                <div className="border-t border-neutral-100 w-full" />
                <span className="absolute bg-white px-3 text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                  Or Connect With
                </span>
              </div>

              {/* Social Login Buttons: Google & Mobile OTP Switch */}
              <div className="space-y-2">
                {/* Google Login Button */}
                <button
                  onClick={handleGoogleLogin}
                  type="button"
                  className="w-full h-11 border border-neutral-200 hover:border-neutral-800 text-neutral-700 hover:text-neutral-955 text-xs font-semibold flex items-center justify-center gap-2.5 transition-colors rounded-lg focus:outline-none cursor-pointer bg-white shadow-xs"
                >
                  <svg className="w-4.5 h-4.5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
                  </svg>
                  <span>Continue with Google</span>
                </button>

                {/* Switch to Mobile OTP in Register mode */}
                {!isLoginView && authMethod !== "mobile" && (
                  <button
                    type="button"
                    onClick={() => { setAuthMethod("mobile"); setIsLoginView(true); setStep("phone"); }}
                    className="w-full h-11 border border-neutral-200 hover:border-[#FF4D6D] text-neutral-700 hover:text-[#FF4D6D] text-xs font-semibold flex items-center justify-center gap-2 transition-colors rounded-lg focus:outline-none cursor-pointer bg-white"
                  >
                    <Phone size={14} className="text-[#FF4D6D]" />
                    <span>Continue with Mobile OTP</span>
                  </button>
                )}
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
}
