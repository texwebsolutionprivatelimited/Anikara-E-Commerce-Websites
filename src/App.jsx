import React, { useState, useEffect, useRef } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import AnnouncementBar from "./components/AnnouncementBar";
import Navbar from "./components/Navbar";
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


function AppContent() {
  const { settings, user, authLoading } = useApp();
  const [currentPage, setCurrentPage] = useState("home");
  const [currentParams, setCurrentParams] = useState({});
  const navCountRef = useRef(0);

  useEffect(() => {
    if (!window.history.state) {
      window.history.replaceState({ page: "home", params: {} }, "");
    }

    const handlePopState = (event) => {
      if (event.state) {
        setCurrentPage(event.state.page || "home");
        setCurrentParams(event.state.params || {});
      } else {
        setCurrentPage("home");
        setCurrentParams({});
      }
      navCountRef.current = Math.max(0, navCountRef.current - 1);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (page, params = {}, replace = false) => {
    setCurrentPage(page);
    setCurrentParams(params);
    if (replace) {
      window.history.replaceState({ page, params }, "");
    } else {
      window.history.pushState({ page, params }, "");
      navCountRef.current += 1;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
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
      case "admin":
        {
          if (authLoading) {
            return (
              <div className="min-h-[60vh] flex items-center justify-center text-xs text-neutral-500 font-sans">
                Verifying admin access...
              </div>
            );
          }

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
          if (!isAuthorizedAdmin) {
            return <Login navigate={navigate} goBack={goBack} currentParams={{ redirectTo: "admin" }} />;
          }
          return <AdminPanel navigate={navigate} />;
        }
      default:
        return <Home navigate={navigate} />;
    }
  };

  const isAdmin = currentPage === "admin";
  const isMaintenance = settings?.maintenanceMode && !isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-white text-[#111111] selection:bg-[#FF4D6D] selection:text-white">
      {/* Core Layout fixed nodes — hidden on admin or maintenance mode */}
      {!isAdmin && !isMaintenance && <AnnouncementBar />}
      {!isAdmin && !isMaintenance && <Navbar currentPage={currentPage} navigate={navigate} currentParams={currentParams} />}

      {/* Page content window with sticky margins top offset */}
      <main className={`flex-grow ${!isAdmin && !isMaintenance ? "pt-[104px] md:pt-[116px] lg:pt-[120px]" : ""}`}>
        {renderPage()}
      </main>

      {!isAdmin && !isMaintenance && <Footer navigate={navigate} />}
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
