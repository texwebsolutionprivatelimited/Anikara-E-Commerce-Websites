import React, { createContext, useContext, useState } from "react";
import { products as initialProducts } from "../data/products";

const INITIAL_COUPONS = [
  {
    id: 1,
    label: "1ST ORDER",
    headline: "FLAT ₹300 OFF",
    subtext: "On your 1st purchase",
    code: "ANIKARA300",
    condition: "Min. order ₹999 • New users only",
    accent: "#FF4D6D",
    bg: "from-[#fff5f7] to-[#fff0f3]",
    badgeBg: "#FF4D6D",
    active: true,
  },
  {
    id: 2,
    label: "APP EXCLUSIVE",
    headline: "FLAT 20% OFF",
    subtext: "Sitewide — limited time",
    code: "ANIKARA20",
    condition: "All categories • No min. order",
    accent: "#111111",
    bg: "from-[#f5f5f5] to-[#f0f0f0]",
    badgeBg: "#111111",
    active: true,
  },
  {
    id: 3,
    label: "FESTIVE SPECIAL",
    headline: "BUY 2 GET 1 FREE",
    subtext: "On selected ethnic wear",
    code: "NIKFEST3",
    condition: "Applies on Ethnic Wear category",
    accent: "#c9860a",
    bg: "from-[#fffbf0] to-[#fff8e6]",
    badgeBg: "#c9860a",
    active: true,
  },
];

const INITIAL_SLIDES = [
  {
    id: 1,
    title: "Summer Sale 50% OFF",
    subtitle: "SEASONAL EDIT",
    desc: "Luxe silhouettes for warmer days. Woven in French linen, soft organic cottons, and breezy satin silk fits.",
    navigatePage: "products",
    navigateParams: { badge: "50% OFF" },
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80",
    active: true,
  },
  {
    id: 2,
    title: "Trending Co-word Sets",
    subtitle: "MINIMAL MODERNIST",
    desc: "Effortless coordinating sets crafted to transition seamlessly from morning lounge to sunset styling.",
    navigatePage: "products",
    navigateParams: { category: "Co-ords" },
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1600&q=80",
    active: true,
  },
  {
    id: 3,
    title: "New Ethnic Collection",
    subtitle: "FESTIVE BLOCKPRINT",
    desc: "Intricate handloom Chanderi silk sarees and detailed blockprint embroidered kurta sets.",
    navigatePage: "products",
    navigateParams: { category: "Ethnic Wear" },
    image: "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=1600&q=80",
    active: true,
  },
  {
    id: 4,
    title: "Cozy Sleepwear Deals",
    subtitle: "NIGHT SUIT ESSENTIALS",
    desc: "Indulge in nightly luxury. Liquid satin pajama sets and organic cotton sleep shirts starting from ₹1,899.",
    navigatePage: "products",
    navigateParams: { category: "Night Suit" },
    image: "https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?auto=format&fit=crop&w=1600&q=80",
    active: true,
  },
];

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState([
    "Night Suit",
    "Lounge Suit",
    "Dress",
    "T-Shirt",
    "Top & Blouse",
    "Bottom Wear",
    "Lingerie",
    "Co-ords",
    "Suit",
    "Denim",
    "Ethnic Wear",
    "Sports Wear",
    "Footwear",
    "Bags",
    "Cosmetics",
    "Accessories"
  ]);
  const [categoryImages, setCategoryImages] = useState({
    "Dress": "https://images.unsplash.com/photo-1618932260643-eee4a2f6c9d6?auto=format&fit=crop&w=600&q=80",
    "Top & Blouse": "https://images.unsplash.com/photo-1564227901-6b1d20bebe9d?auto=format&fit=crop&w=600&q=80",
    "T-Shirt": "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=600&q=80",
    "Denim": "https://images.unsplash.com/photo-1604176354204-9268737828e4?auto=format&fit=crop&w=600&q=80",
    "Co-ords": "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=80",
    "Bottom Wear": "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=600&q=80",
    "Night Suit": "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80",
    "Lounge Suit": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80",
    "Lingerie": "https://images.unsplash.com/photo-1569591159212-b02ea8a9f239?auto=format&fit=crop&w=600&q=80",
    "Suit": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
    "Sports Wear": "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?auto=format&fit=crop&w=600&q=80",
    "Footwear": "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=600&q=80",
    "Bags": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
    "Cosmetics": "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    "Accessories": "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=600&q=80",
    "Ethnic Wear": "https://images.unsplash.com/photo-1610030469668-93535c17b6b3?auto=format&fit=crop&w=600&q=80",
  });
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState({
    name: "Ajeet Kumar",
    email: "ajeet@example.com",
    phone: "+91 9876543210",
    address: {
      street: "Flat 405, Rosewood Apartments, Linking Road",
      city: "Mumbai",
      state: "Maharashtra",
      zip: "400054",
      country: "India"
    }
  });
  const [orders, setOrders] = useState([
    {
      id: "ORD-9281-2026",
      date: "2026-05-12",
      total: 6298,
      status: "Delivered",
      items: [
        {
          id: "ns1",
          name: "Luxe Silk Satin Pajama Set",
          price: 2499,
          quantity: 1,
          size: "M",
          color: "Emerald Green",
          image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=600&q=80"
        },
        {
          id: "ls1",
          name: "Premium Ribbed Knit Lounge Set",
          price: 3799,
          quantity: 1,
          size: "S",
          color: "Oatmeal Heather",
          image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=600&q=80"
        }
      ],
      address: "Flat 405, Rosewood Apartments, Linking Road, Mumbai, Maharashtra - 400054",
      paymentMethod: "UPI"
    },
    {
      id: "ORD-1102-2026",
      date: "2026-05-24",
      total: 3299,
      status: "In Transit",
      trackingStep: 2,
      items: [
        {
          id: "bw1",
          name: "Tailored High-Waist Pleated Pants",
          price: 3299,
          quantity: 1,
          size: "28",
          color: "Classic Beige",
          image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=600&q=80"
        }
      ],
      address: "Flat 405, Rosewood Apartments, Linking Road, Mumbai, Maharashtra - 400054",
      paymentMethod: "Credit Card"
    }
  ]);
  const [payments, setPayments] = useState([
    {
      id: "TXN-839201",
      orderId: "ORD-9281-2026",
      customerName: "Ajeet Kumar",
      customerEmail: "ajeet@example.com",
      customerPhone: "+91 98765 43210",
      amount: 6298,
      paymentMethod: "UPI",
      date: "2026-05-12",
      time: "14:32",
      status: "Success"
    },
    {
      id: "TXN-482019",
      orderId: "ORD-1102-2026",
      customerName: "Ajeet Kumar",
      customerEmail: "ajeet@example.com",
      customerPhone: "+91 98765 43210",
      amount: 3299,
      paymentMethod: "Credit Card",
      date: "2026-05-24",
      time: "10:15",
      status: "Success"
    },
    {
      id: "TXN-102938",
      orderId: "ORD-5832-2026",
      customerName: "Priyanka Sharma",
      customerEmail: "priyanka@example.com",
      customerPhone: "+91 99887 76655",
      amount: 4500,
      paymentMethod: "Net Banking",
      date: "2026-05-25",
      time: "18:40",
      status: "Failed",
      errorMessage: "Authentication failed / Timeout"
    },
    {
      id: "TXN-293847",
      orderId: "ORD-2049-2026",
      customerName: "Rahul Verma",
      customerEmail: "rahul@example.com",
      customerPhone: "+91 91234 56789",
      amount: 1899,
      paymentMethod: "UPI",
      date: "2026-05-26",
      time: "11:22",
      status: "Refunded",
      refundReason: "Customer cancelled before shipment"
    },
    {
      id: "TXN-902834",
      orderId: "ORD-3048-2026",
      customerName: "Sneha Patel",
      customerEmail: "sneha@example.com",
      customerPhone: "+91 98989 89898",
      amount: 2799,
      paymentMethod: "Cash on Delivery (COD)",
      date: "2026-05-27",
      time: "09:05",
      status: "Pending"
    }
  ]);
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [slides, setSlides] = useState(INITIAL_SLIDES);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem("anikara_settings");
    return saved ? JSON.parse(saved) : {
      businessName: "Anikara",
      gstPercent: 5,
      shippingThreshold: 1500,
      shippingFee: 150,
      maintenanceMode: false
    };
  });

  const adminUpdateSettings = (updated) => {
    setSettings((prev) => {
      const next = { ...prev, ...updated };
      localStorage.setItem("anikara_settings", JSON.stringify(next));
      return next;
    });
    addToast("Settings updated successfully!", "success");
  };

  // Toast utilities
  const addToast = (message, type = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Cart operations
  const addToCart = (product, quantity = 1, size = "M", color = null) => {
    const selectedColor = color || (product.colors && product.colors[0]?.name) || "Default";
    const cartItemId = `${product.id}-${size}-${selectedColor}`;

    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.cartItemId === cartItemId);
      if (existingItem) {
        addToast(`Updated ${product.name} quantity in Cart`, "success");
        return prevCart.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      addToast(`Added ${product.name} to Cart`, "success");
      return [
        ...prevCart,
        {
          cartItemId,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          size,
          color: selectedColor,
          maxQuantity: 10
        }
      ];
    });
  };

  const removeFromCart = (cartItemId) => {
    setCart((prevCart) => {
      const item = prevCart.find((item) => item.cartItemId === cartItemId);
      if (item) {
        addToast(`Removed ${item.name} from Cart`, "info");
      }
      return prevCart.filter((item) => item.cartItemId !== cartItemId);
    });
  };

  const updateCartQuantity = (cartItemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  // Wishlist operations
  const toggleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const exists = prevWishlist.some((item) => item.id === product.id);
      if (exists) {
        addToast(`Removed ${product.name} from Wishlist`, "info");
        return prevWishlist.filter((item) => item.id !== product.id);
      } else {
        addToast(`Added ${product.name} to Wishlist`, "success");
        return [...prevWishlist, product];
      }
    });
  };

  const moveToCart = (wishlistItem, size = "M", color = null) => {
    addToCart(wishlistItem, 1, size, color);
    setWishlist((prev) => prev.filter((item) => item.id !== wishlistItem.id));
  };

  // Coupon management
  const applyCoupon = (code) => {
    const upperCode = code.toUpperCase();
    if (upperCode === "WELCOME10") {
      setPromoDiscount({ code: "WELCOME10", discountPercent: 10 });
      addToast("10% Coupon Applied Successfully!", "success");
      return true;
    } else if (upperCode === "ANIKARA20") {
      setPromoDiscount({ code: "ANIKARA20", discountPercent: 20 });
      addToast("20% Coupon Applied Successfully!", "success");
      return true;
    }
    addToast("Invalid Coupon Code", "error");
    return false;
  };

  const removeCoupon = () => {
    setPromoDiscount(null);
    addToast("Coupon Removed", "info");
  };

  // Admin: Coupon CRUD
  const adminAddCoupon = (coupon) => {
    const newCoupon = {
      ...coupon,
      id: Date.now(),
      active: true,
    };
    setCoupons((prev) => [...prev, newCoupon]);
    addToast("Coupon added successfully!", "success");
  };

  const adminUpdateCoupon = (id, updated) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updated } : c))
    );
    addToast("Coupon updated!", "success");
  };

  const adminDeleteCoupon = (id) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    addToast("Coupon deleted.", "info");
  };

  const adminToggleCoupon = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c))
    );
  };

  // Admin: Slide CRUD
  const adminAddSlide = (slide) => {
    const newSlide = { ...slide, id: Date.now(), active: true };
    setSlides((prev) => [...prev, newSlide]);
    addToast("Slide added!", "success");
  };

  const adminUpdateSlide = (id, updated) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, ...updated } : s)));
    addToast("Slide updated!", "success");
  };

  const adminDeleteSlide = (id) => {
    setSlides((prev) => prev.filter((s) => s.id !== id));
    addToast("Slide deleted.", "info");
  };

  const adminToggleSlide = (id) => {
    setSlides((prev) => prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
  };

  const adminMoveSlide = (id, direction) => {
    setSlides((prev) => {
      const idx = prev.findIndex((s) => s.id === id);
      if (idx < 0) return prev;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const arr = [...prev];
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  // Admin: Category CRUD
  const adminAddCategory = (categoryName, imageUrl) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    if (categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
      addToast("Category already exists!", "error");
      return false;
    }
    setCategories((prev) => [...prev, trimmed]);
    if (imageUrl && imageUrl.trim()) {
      setCategoryImages((prev) => ({
        ...prev,
        [trimmed]: imageUrl.trim()
      }));
    }
    addToast("Category added successfully!", "success");
    return true;
  };

  const adminDeleteCategory = (categoryName) => {
    const hasProducts = products.some(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    if (hasProducts) {
      addToast("Cannot delete: Products exist in this category!", "error");
      return false;
    }
    setCategories((prev) => prev.filter((cat) => cat.toLowerCase() !== categoryName.toLowerCase()));
    setCategoryImages((prev) => {
      const copy = { ...prev };
      delete copy[categoryName];
      return copy;
    });
    addToast("Category deleted.", "info");
    return true;
  };

  // Admin: Product CRUD
  const adminAddProduct = (product) => {
    const newProduct = {
      ...product,
      id: `p-${Date.now()}`,
      rating: 5.0,
      ratingCount: 0,
      reviews: []
    };
    setProducts((prev) => [newProduct, ...prev]);
    addToast("Product added successfully!", "success");
  };

  const adminDeleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    addToast("Product deleted.", "info");
  };

  // Checkout and orders
  const placeOrder = (addressDetails, paymentMethod) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = promoDiscount ? (subtotal * promoDiscount.discountPercent) / 100 : 0;
    const shipping = subtotal > settings.shippingThreshold ? 0 : settings.shippingFee;
    const finalTotal = subtotal - discountAmount + shipping;

    const formattedAddress = `${addressDetails.street}, ${addressDetails.city}, ${addressDetails.state} - ${addressDetails.zip}`;

    const newOrder = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}-2026`,
      date: new Date().toISOString().split("T")[0],
      total: finalTotal,
      status: "Processing",
      trackingStep: 1,
      items: [...cart],
      address: formattedAddress,
      paymentMethod
    };

    setOrders((prev) => [newOrder, ...prev]);

    // Automatically generate a payment log record
    const newPayment = {
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      orderId: newOrder.id,
      customerName: user?.name || "Guest Customer",
      customerEmail: user?.email || "guest@example.com",
      customerPhone: user?.phone || "+91 99999 88888",
      amount: finalTotal,
      paymentMethod: paymentMethod === "COD" ? "Cash on Delivery (COD)" : paymentMethod,
      date: newOrder.date,
      time: new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
      status: paymentMethod === "COD" ? "Pending" : "Success"
    };
    setPayments((prev) => [newPayment, ...prev]);

    setCart([]);
    setPromoDiscount(null);
    addToast("Order Placed Successfully!", "success");
    return newOrder;
  };

  // Auth mockups
  const loginUser = (email, password) => {
    setUser({
      name: "Ajeet Kumar",
      email: email,
      phone: "+91 9876543210",
      address: {
        street: "Flat 405, Rosewood Apartments, Linking Road",
        city: "Mumbai",
        state: "Maharashtra",
        zip: "400054",
        country: "India"
      }
    });
    addToast("Logged In Successfully!", "success");
  };

  const registerUser = (name, email, password) => {
    setUser({
      name: name,
      email: email,
      phone: "+91 9999988888",
      address: {
        street: "Please Add Address",
        city: "",
        state: "",
        zip: "",
        country: ""
      }
    });
    addToast("Registered Successfully!", "success");
  };

  const logoutUser = () => {
    setUser(null);
    addToast("Logged Out Successfully", "info");
  };

  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    addToast("Profile Updated", "success");
  };

  const adminUpdatePaymentStatus = (id, status, extraFields = {}) => {
    setPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status, ...extraFields } : p))
    );
    if (status === "Refunded") {
      addToast(`Payment ${id} has been refunded.`, "info");
    } else if (status === "Success") {
      addToast(`Payment ${id} completed successfully!`, "success");
    } else {
      addToast(`Payment status updated to ${status}.`, "success");
    }
  };

  const adminAddPayment = (payment) => {
    const newPayment = {
      ...payment,
      id: payment.id || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: payment.date || new Date().toISOString().split("T")[0],
      time: payment.time || new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    };
    setPayments((prev) => [newPayment, ...prev]);
    addToast("Payment record logged successfully!", "success");
  };

  const adminUpdateOrderStatus = (id, status, trackingStep) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status, trackingStep: trackingStep || o.trackingStep } : o))
    );
    addToast(`Order ${id} status updated to ${status}`, "success");
  };

  const adminDeleteOrder = (id) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    addToast(`Order ${id} has been deleted.`, "info");
  };

  return (
    <AppContext.Provider
      value={{
        products,
        cart,
        wishlist,
        user,
        orders,
        promoDiscount,
        toasts,
        coupons,
        slides,
        addToast,
        removeToast,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        moveToCart,
        applyCoupon,
        removeCoupon,
        placeOrder,
        loginUser,
        registerUser,
        logoutUser,
        updateProfile,
        adminAddCoupon,
        adminUpdateCoupon,
        adminDeleteCoupon,
        adminToggleCoupon,
        adminAddSlide,
        adminUpdateSlide,
        adminDeleteSlide,
        adminToggleSlide,
        adminMoveSlide,
        categories,
        categoryImages,
        adminAddCategory,
        adminDeleteCategory,
        adminAddProduct,
        adminDeleteProduct,
        settings,
        adminUpdateSettings,
        payments,
        adminUpdatePaymentStatus,
        adminAddPayment,
        adminUpdateOrderStatus,
        adminDeleteOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
