import React, { useState, useEffect, useRef } from "react";
import { IKContext } from "@imagekit/react";
import { AppProvider } from "./context/AppContext";
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
import AdminPanel from "./pages/AdminPanel";

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentParams, setCurrentParams] = useState({});
  const navCountRef = useRef(0);

  useEffect(() => {
    // Save current state as the initial history state if not set
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
        return <Login navigate={navigate} goBack={goBack} />;
      case "checkout":
        return <Checkout navigate={navigate} goBack={goBack} />;
      case "profile":
        return <Profile navigate={navigate} goBack={goBack} />;
      case "order-success":
        return <OrderSuccess navigate={navigate} currentParams={currentParams} goBack={goBack} />;
      case "admin":
        return <AdminPanel navigate={navigate} />;
      default:
        return <Home navigate={navigate} />;
    }
  };

  const isAdmin = currentPage === "admin";
  const imageKitUrl = import.meta.env.VITE_IMAGEKIT_URL || "https://ik.imagekit.io/feu3swboqb";

  return (
    <IKContext urlEndpoint={imageKitUrl}>
      <AppProvider>
        <div className="min-h-screen flex flex-col bg-white text-[#111111] selection:bg-[#FF4D6D] selection:text-white">
          
          {/* Core Layout fixed nodes — hidden on admin */}
          {!isAdmin && <AnnouncementBar />}
          {!isAdmin && <Navbar currentPage={currentPage} navigate={navigate} currentParams={currentParams} />}
          
          {/* Page content window with sticky margins top offset */}
          <main className={`flex-grow ${!isAdmin ? "pt-[104px] md:pt-[116px] lg:pt-[120px]" : ""}`}>
            {renderPage()}
          </main>
          
          {!isAdmin && <Footer navigate={navigate} />}
          <Toast />

        </div>
      </AppProvider>
    </IKContext>
  );
}
