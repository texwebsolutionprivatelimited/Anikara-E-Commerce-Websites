import React, { useState, useEffect, useRef } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import BrandStory from "./sections/BrandStory";
import Footer from "./components/Footer";
import Toast from "./components/Toast";

// Pages
import Home from "./pages/Home";
import Product from "./pages/Product";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile";
import OrderSuccess from "./pages/OrderSuccess";
import AdminPanel from "./admin panel/AdminPanel";
import MaintenanceMode from "./admin panel/MaintenanceMode";
import InfoPages from "./pages/InfoPages";


function AppContent() {
  const { settings, user, authLoading } = useApp();

  const rawAdminEmails =
    import.meta.env.VITE_ADMIN_EMAILS ||
    import.meta.env.VITE_ADMIN_EMAIL ||
    settings?.adminEmail ||
    "";
  const adminEmails = String(rawAdminEmails)
    .split(",")
    .map((e) => e.toLowerCase().trim())
    .filter(Boolean);
  const userEmail = (user?.email || "").toLowerCase().trim();
  const isAuthorizedAdmin = !!userEmail && adminEmails.includes(userEmail);

  // Initial page setup: On refresh, always open from the starting Hero/Landing page ("home")
  const getInitialPage = () => {
    const isLocalAdmin = localStorage.getItem("isAdmin") === "true";
    return isLocalAdmin ? "admin" : "home";
  };

  const [currentPage, setCurrentPage] = useState(getInitialPage);
  const [currentParams, setCurrentParams] = useState({});
  const navCountRef = useRef(0);

  const buildQueryString = (page, params = {}) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", page);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        searchParams.set(key, params[key]);
      }
    });
    return `?${searchParams.toString()}`;
  };

  useEffect(() => {
    // Disable automatic browser scroll restoration so refresh never lands in middle or footer
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const initial = getInitialPage();
    const url = buildQueryString(initial, {});
    window.history.replaceState({ page: initial, params: {} }, "", url);

    // Force scroll to absolute top hero landing page
    window.scrollTo(0, 0);
    const scrollTimer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 80);

    const handlePopState = (event) => {
      if (event.state && event.state.page) {
        setCurrentPage(event.state.page);
        setCurrentParams(event.state.params || {});
      } else {
        setCurrentPage("home");
        setCurrentParams({});
      }
      window.scrollTo(0, 0);
      navCountRef.current = Math.max(0, navCountRef.current - 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
      clearTimeout(scrollTimer);
    };
  }, []);

  // Force scroll to top hero section whenever page changes
  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      window.scrollTo(0, 0);
    }, 50);
    return () => clearTimeout(timer);
  }, [currentPage]);

  useEffect(() => {
    if (!authLoading) {
      if (isAuthorizedAdmin) {
        localStorage.setItem("isAdmin", "true");
        if (currentPage !== "admin") {
          setCurrentPage("admin");
          const url = buildQueryString("admin", {});
          window.history.replaceState({ page: "admin", params: {} }, "", url);
        }
      } else {
        localStorage.setItem("isAdmin", "false");
        if (currentPage === "admin") {
          setCurrentPage("home");
          const url = buildQueryString("home", {});
          window.history.replaceState({ page: "home", params: {} }, "", url);
        }
      }
    }
  }, [authLoading, isAuthorizedAdmin, currentPage]);

  const navigate = (page, params = {}, replace = false) => {
    const targetPage = isAuthorizedAdmin ? "admin" : page;
    setCurrentPage(targetPage);
    setCurrentParams(params);

    try {
      sessionStorage.setItem("anikara_active_route", JSON.stringify({ page: targetPage, params }));
    } catch (e) {}

    const url = buildQueryString(targetPage, params);
    if (replace) {
      window.history.replaceState({ page: targetPage, params }, "", url);
    } else {
      window.history.pushState({ page: targetPage, params }, "", url);
      navCountRef.current += 1;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (isAuthorizedAdmin) {
      navigate("admin", {}, true);
      return;
    }
    if (navCountRef.current > 0) {
      window.history.back();
    } else {
      navigate("home");
    }
  };

  const renderPage = () => {
    if (settings?.maintenanceMode && currentPage !== "admin") {
      return <MaintenanceMode navigate={navigate} />;
    }

    switch (currentPage) {
      case "home":
        return <Home navigate={navigate} />;
      case "products":
        return <Product navigate={navigate} currentParams={currentParams} goBack={goBack} />;
      case "product-details":
        return <ProductDetails navigate={navigate} currentParams={currentParams} goBack={goBack} />;
      case "cart":
        return <Cart navigate={navigate} goBack={goBack} />;
      case "wishlist":
        return <Wishlist navigate={navigate} goBack={goBack} />;
      case "login":
        return <Login navigate={navigate} goBack={goBack} currentParams={currentParams} />;
      case "checkout":
        return <Checkout navigate={navigate} goBack={goBack} />;
      case "profile":
        return <Profile navigate={navigate} goBack={goBack} />;
      case "order-success":
        return <OrderSuccess navigate={navigate} currentParams={currentParams} goBack={goBack} />;
      case "info":
      case "shipping":
      case "returns":
      case "privacy":
      case "terms":
      case "faqs":
        return <InfoPages navigate={navigate} currentParams={currentParams} />;
      case "admin":
        {
          if (authLoading) {
            return (
              <div className="min-h-[60vh] flex items-center justify-center text-xs text-neutral-500 font-sans">
                Verifying admin access...
              </div>
            );
          }

          if (!isAuthorizedAdmin) {
            return <Login navigate={navigate} goBack={goBack} currentParams={{ redirectTo: "admin" }} />;
          }
          return <AdminPanel navigate={navigate} />;
        }
      default:
        return <Home navigate={navigate} />;
    }
  };

  const isAdmin = currentPage === "admin" || isAuthorizedAdmin;
  const isMaintenance = settings?.maintenanceMode && !isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] selection:bg-[#FF4D6D] selection:text-white">
      {/* Core Layout fixed nodes — hidden on admin or maintenance mode */}
      {!isAdmin && !isMaintenance && <AnnouncementBar />}
      {!isAdmin && !isMaintenance && <Navbar currentPage={currentPage} navigate={navigate} currentParams={currentParams} />}

      {/* Page content window with sticky margins top offset and mobile bottom nav clearance */}
      <main className={`flex-grow ${!isAdmin && !isMaintenance ? "pt-[104px] md:pt-[116px] lg:pt-[120px] pb-16 md:pb-0" : ""}`}>
        {renderPage()}
      </main>

      {!isAdmin && !isMaintenance && <BrandStory navigate={navigate} />}
      {!isAdmin && !isMaintenance && <Footer navigate={navigate} />}
      {!isAdmin && !isMaintenance && <BottomNav currentPage={currentPage} navigate={navigate} />}
      <Toast />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
