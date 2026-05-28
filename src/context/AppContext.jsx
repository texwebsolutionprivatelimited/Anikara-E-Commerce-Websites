import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, getDocs, doc, setDoc, getDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
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
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError(null);
        const querySnapshot = await getDocs(collection(db, "products"));
        
        if (querySnapshot.empty) {
          // Fallback to initial products if firestore is empty for demonstration
          setProducts(initialProducts);
        } else {
          const productsList = querySnapshot.docs.map(doc => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "Unknown Product",
              price: data.price || 0,
              category: data.category || "Uncategorized",
              image: data.image || "https://via.placeholder.com/400x500",
              stock: data.stock || 0,
              // Fallbacks to ensure UI components don't break
              oldPrice: data.oldPrice || data.price || 0,
              rating: data.rating || 4.5,
              ratingCount: data.ratingCount || 0,
              description: data.description || "",
              sizes: data.sizes || ["S", "M", "L", "XL"],
              colors: data.colors || [{ name: "Default", hex: "#000000" }]
            };
          });
          setProducts(productsList);
        }
      } catch (err) {
        console.error("Error fetching products from Firestore:", err);
        setProductsError(err.message);
        // Fallback to static products on error so app doesn't completely break
        setProducts(initialProducts);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Monitor Auth State
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            setUser({ uid: currentUser.uid, email: currentUser.email, ...userDocSnap.data() });
          } else {
            // Fallback if no doc exists
            setUser({ uid: currentUser.uid, email: currentUser.email });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({ uid: currentUser.uid, email: currentUser.email });
        }
      } else {
        setUser(null);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);
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
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [coupons, setCoupons] = useState(INITIAL_COUPONS);
  const [slides, setSlides] = useState(INITIAL_SLIDES);

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

  // Checkout and orders
  const placeOrder = (addressDetails, paymentMethod) => {
    if (cart.length === 0) return null;

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discountAmount = promoDiscount ? (subtotal * promoDiscount.discountPercent) / 100 : 0;
    const shipping = subtotal > 1500 ? 0 : 150;
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
    setCart([]);
    setPromoDiscount(null);
    addToast("Order Placed Successfully!", "success");
    return newOrder;
  };

  // Real Firebase Auth
  const loginUser = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      addToast("Logged In Successfully!", "success");
      return { success: true };
    } catch (error) {
      console.error(error);
      addToast(error.message.replace("Firebase: ", ""), "error");
      return { success: false, error: error.message };
    }
  };

  const registerUser = async (name, email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      const userData = {
        name: name,
        phone: "",
        address: {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: ""
        },
        createdAt: new Date().toISOString()
      };
      
      await setDoc(doc(db, "users", newUser.uid), userData);
      addToast("Registered Successfully!", "success");
      return { success: true };
    } catch (error) {
      console.error(error);
      addToast(error.message.replace("Firebase: ", ""), "error");
      return { success: false, error: error.message };
    }
  };

  const logoutUser = async () => {
    try {
      await signOut(auth);
      addToast("Logged Out Successfully", "info");
    } catch (error) {
      console.error(error);
    }
  };

  const updateProfile = async (updatedUser) => {
    try {
      if (!user || !user.uid) throw new Error("No active user");
      // Remove email/uid from update payload as they shouldn't change
      const { uid, email, ...updatePayload } = updatedUser; 
      await setDoc(doc(db, "users", user.uid), updatePayload, { merge: true });
      setUser(updatedUser);
      addToast("Profile Updated", "success");
    } catch (error) {
      console.error(error);
      addToast("Failed to update profile", "error");
    }
  };

  return (
    <AppContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
