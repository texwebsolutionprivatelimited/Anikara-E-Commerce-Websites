import React, { createContext, useContext, useState, useEffect } from "react";
import { collection, doc, setDoc, getDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { db, auth } from "../firebase";
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { DEFAULT_CATEGORY_IMAGES, DEFAULT_CATEGORY_NAMES } from "../data/categories";

export const uploadToImageKit = async (file) => {
  const publicKey = import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY;
  if (!publicKey) {
    throw new Error("ImageKit public key missing. Set VITE_IMAGEKIT_PUBLIC_KEY.");
  }

  const authResponse = await fetch("/api/imagekit-auth");
  if (!authResponse.ok) {
    const errText = await authResponse.text();
    throw new Error(`ImageKit auth failed: ${errText}`);
  }

  const { signature, token, expire } = await authResponse.json();
  if (!signature || !token || !expire) {
    throw new Error("ImageKit auth failed: signature response is incomplete.");
  }
  
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name || "upload.png");
  formData.append("publicKey", publicKey);
  formData.append("signature", signature);
  formData.append("expire", expire.toString());
  formData.append("token", token);

  const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
    method: "POST",
    body: formData
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`ImageKit Upload failed: ${errText}`);
  }

  const result = await response.json();
  return result.url; // Returns the full secure CDN image URL
};

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
  
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [orders, setOrders] = useState([]);
  const [payments, setPayments] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [slides, setSlides] = useState([]);
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [toasts, setToasts] = useState([]);
  
  const [settings, setSettings] = useState({
    businessName: "Anikara",
    gstPercent: 5,
    shippingThreshold: 1500,
    shippingFee: 150,
    maintenanceMode: false
  });

  const [categories, setCategories] = useState([]);

  const [categoryImages, setCategoryImages] = useState({});

  // central realtime syncing logic
  useEffect(() => {
    // 1. Sync Products
    const unsubscribeProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          name: data.name || "Unknown Product",
          price: data.price || 0,
          category: data.category || "Uncategorized",
          image: data.image || "",
          altImage: data.altImage || null,
          images: data.images || [],
          stock: data.stock || 0,
          oldPrice: data.oldPrice || data.price || 0,
          rating: data.rating || 4.5,
          ratingCount: data.ratingCount || 0,
          description: data.description || "",
          sizes: data.sizes || ["S", "M", "L", "XL"],
          colors: data.colors || [{ name: "Default", hex: "#000000" }],
          details: data.details || [],
          reviews: data.reviews || [],
          displaySection: data.displaySection || "deals",
          badge: data.badge || null
        };
      });
      setProducts(list);
      setProductsLoading(false);
    }, (err) => {
      console.error(err);
      setProductsError(err.message);
      setProductsLoading(false);
    });

    // 2. Sync Coupons
    const unsubscribeCoupons = onSnapshot(collection(db, "coupons"), (snapshot) => {
      setCoupons(snapshot.docs.map((docSnap) => docSnap.data()));
    });

    // 3. Sync Slides
    const unsubscribeSlides = onSnapshot(collection(db, "slides"), (snapshot) => {
      setSlides(snapshot.docs.map((docSnap) => docSnap.data()));
    });

    // 4. Sync Orders
    const unsubscribeOrders = onSnapshot(collection(db, "orders"), (snapshot) => {
      setOrders(snapshot.docs.map((docSnap) => docSnap.data()));
    });

    // 5. Sync Payments
    const unsubscribePayments = onSnapshot(collection(db, "payments"), (snapshot) => {
      setPayments(snapshot.docs.map((docSnap) => docSnap.data()));
    });

    // 6. Sync Settings
    const unsubscribeSettings = onSnapshot(doc(db, "settings", "general"), async (docSnap) => {
      if (!docSnap.exists()) {
        const defaultSettings = {
          businessName: "Anikara",
          gstPercent: 5,
          shippingThreshold: 1500,
          shippingFee: 150,
          maintenanceMode: false
        };
        await setDoc(doc(db, "settings", "general"), defaultSettings);
      } else {
        setSettings(docSnap.data());
      }
    });

    // 7. Sync Categories
    const unsubscribeCategories = onSnapshot(collection(db, "categories"), (snapshot) => {
      const rows = snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }));
      const sorted = rows.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
      const categoryNames = [
        ...DEFAULT_CATEGORY_NAMES,
        ...sorted.map((row) => row.name).filter(Boolean)
      ];
      const uniqueCategories = Array.from(
        new Map(categoryNames.map((name) => [name.toLowerCase(), name])).values()
      ).sort((a, b) => a.localeCompare(b));
      setCategories(uniqueCategories);
      const imageMap = { ...DEFAULT_CATEGORY_IMAGES };
      sorted.forEach((row) => {
        if (row.name && row.image) imageMap[row.name] = row.image;
      });
      setCategoryImages(imageMap);
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCoupons();
      unsubscribeSlides();
      unsubscribeOrders();
      unsubscribePayments();
      unsubscribeSettings();
      unsubscribeCategories();
    };
  }, []);

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
    const found = coupons.find((c) => c.code.toUpperCase() === upperCode && c.active);
    if (found) {
      const pct = Number(found.discountPercent) || 10;
      setPromoDiscount({ code: upperCode, discountPercent: pct });
      addToast(`${pct}% Coupon Applied Successfully!`, "success");
      return true;
    }
    addToast("Invalid or Inactive Coupon Code", "error");
    return false;
  };

  const removeCoupon = () => {
    setPromoDiscount(null);
    addToast("Coupon Removed", "info");
  };

  // Admin: Coupon CRUD
  const adminAddCoupon = async (coupon) => {
    try {
      const newCoupon = {
        ...coupon,
        id: Date.now(),
        active: true,
      };
      await setDoc(doc(db, "coupons", newCoupon.id.toString()), newCoupon);
      addToast("Coupon added successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to add coupon", "error");
    }
  };

  const adminUpdateCoupon = async (id, updated) => {
    try {
      await setDoc(doc(db, "coupons", id.toString()), updated, { merge: true });
      addToast("Coupon updated!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update coupon", "error");
    }
  };

  const adminDeleteCoupon = async (id) => {
    try {
      await deleteDoc(doc(db, "coupons", id.toString()));
      addToast("Coupon deleted.", "info");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete coupon", "error");
    }
  };

  const adminToggleCoupon = async (id) => {
    try {
      const couponRef = doc(db, "coupons", id.toString());
      const snap = await getDoc(couponRef);
      if (snap.exists()) {
        await setDoc(couponRef, { active: !snap.data().active }, { merge: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Slide CRUD
  const adminAddSlide = async (slide) => {
    try {
      const newSlide = { ...slide, id: Date.now(), active: true };
      await setDoc(doc(db, "slides", newSlide.id.toString()), newSlide);
      addToast("Slide added!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to add slide", "error");
    }
  };

  const adminUpdateSlide = async (id, updated) => {
    try {
      await setDoc(doc(db, "slides", id.toString()), updated, { merge: true });
      addToast("Slide updated!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update slide", "error");
    }
  };

  const adminDeleteSlide = async (id) => {
    try {
      await deleteDoc(doc(db, "slides", id.toString()));
      addToast("Slide deleted.", "info");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete slide", "error");
    }
  };

  const adminToggleSlide = async (id) => {
    try {
      const slideRef = doc(db, "slides", id.toString());
      const snap = await getDoc(slideRef);
      if (snap.exists()) {
        await setDoc(slideRef, { active: !snap.data().active }, { merge: true });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const adminMoveSlide = async (id, direction) => {
    const idx = slides.findIndex((s) => s.id === id);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= slides.length) return;
    
    const arr = [...slides];
    [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
    
    try {
      const batch = writeBatch(db);
      arr.forEach((slide) => {
        batch.set(doc(db, "slides", slide.id.toString()), slide);
      });
      await batch.commit();
    } catch (err) {
      console.error(err);
    }
  };

  // Admin: Category CRUD
  const adminAddCategory = async (categoryName, imageUrl) => {
    const trimmed = categoryName.trim();
    if (!trimmed) return false;
    if (categories.some((cat) => cat.toLowerCase() === trimmed.toLowerCase())) {
      addToast("Category already exists!", "error");
      return false;
    }
    try {
      const id = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await setDoc(doc(db, "categories", id), {
        name: trimmed,
        image: imageUrl?.trim() || "",
        updatedAt: new Date().toISOString()
      });
      addToast("Category added successfully!", "success");
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to add category", "error");
      return false;
    }
  };

  const adminDeleteCategory = async (categoryName) => {
    const hasProducts = products.some(
      (p) => p.category.toLowerCase() === categoryName.toLowerCase()
    );
    if (hasProducts) {
      addToast("Cannot delete: Products exist in this category!", "error");
      return false;
    }
    try {
      const id = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      await deleteDoc(doc(db, "categories", id));
      addToast("Category deleted.", "info");
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to delete category", "error");
      return false;
    }
  };

  const adminUpdateCategory = async (oldCategoryName, updatedCategoryName, imageUrl) => {
    const oldName = oldCategoryName?.trim();
    const newName = updatedCategoryName?.trim();
    if (!oldName || !newName) return false;
    const duplicate =
      oldName.toLowerCase() !== newName.toLowerCase() &&
      categories.some((cat) => cat.toLowerCase() === newName.toLowerCase());
    if (duplicate) {
      addToast("Category with same name already exists!", "error");
      return false;
    }
    try {
      const oldId = oldName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newId = newName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const batch = writeBatch(db);
      batch.set(doc(db, "categories", newId), {
        name: newName,
        image: imageUrl?.trim() || "",
        updatedAt: new Date().toISOString()
      });
      if (oldId !== newId) {
        batch.delete(doc(db, "categories", oldId));
      }
      products
        .filter((p) => p.category?.toLowerCase() === oldName.toLowerCase())
        .forEach((p) => {
          batch.set(doc(db, "products", p.id), { category: newName }, { merge: true });
        });
      await batch.commit();
      addToast("Category updated successfully!", "success");
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to update category", "error");
      return false;
    }
  };

  // Admin: Product CRUD
  const adminAddProduct = async (product) => {
    try {
      const newProduct = {
        ...product,
        id: product.id || `p-${Date.now()}`,
        rating: product.rating || 5.0,
        ratingCount: product.ratingCount || 0,
        reviews: product.reviews || []
      };
      await setDoc(doc(db, "products", newProduct.id), newProduct);
      addToast("Product updated successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to save product", "error");
    }
  };

  const adminDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      addToast("Product deleted.", "info");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete product", "error");
    }
  };

  // Checkout and orders
  const placeOrder = async (addressDetails, paymentMethod) => {
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

    try {
      await setDoc(doc(db, "orders", newOrder.id), newOrder);
      await setDoc(doc(db, "payments", newPayment.id), newPayment);
      setCart([]);
      setPromoDiscount(null);
      addToast("Order Placed Successfully!", "success");
      return newOrder;
    } catch (err) {
      console.error(err);
      addToast("Failed to place order", "error");
      return null;
    }
  };

  const adminUpdateSettings = async (updated) => {
    try {
      await setDoc(doc(db, "settings", "general"), updated, { merge: true });
      addToast("Settings updated successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update settings", "error");
    }
  };

  const adminUpdatePaymentStatus = async (id, status, extraFields = {}) => {
    try {
      await setDoc(doc(db, "payments", id), { status, ...extraFields }, { merge: true });
      if (status === "Refunded") {
        addToast(`Payment ${id} has been refunded.`, "info");
      } else if (status === "Success") {
        addToast(`Payment ${id} completed successfully!`, "success");
      } else {
        addToast(`Payment status updated to ${status}.`, "success");
      }
    } catch (err) {
      console.error(err);
      addToast("Failed to update payment status", "error");
    }
  };

  const adminAddPayment = async (payment) => {
    const newPayment = {
      ...payment,
      id: payment.id || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      date: payment.date || new Date().toISOString().split("T")[0],
      time: payment.time || new Date().toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
    };
    try {
      await setDoc(doc(db, "payments", newPayment.id), newPayment);
      addToast("Payment record logged successfully!", "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to log payment record", "error");
    }
  };

  const adminDeletePayment = async (id) => {
    try {
      await deleteDoc(doc(db, "payments", id));
      addToast("Payment record deleted.", "info");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete payment record", "error");
    }
  };

  const adminUpdateOrderStatus = async (id, status, trackingStep) => {
    try {
      const updatePayload = { status };
      if (trackingStep !== undefined) {
        updatePayload.trackingStep = trackingStep;
      } else {
        // Keep tracking step consistent even when admin updates only status.
        if (status === "Processing") updatePayload.trackingStep = 1;
        else if (status === "Shipped") updatePayload.trackingStep = 2;
        else if (status === "In Transit" || status === "Out for Delivery") updatePayload.trackingStep = 3;
        else if (status === "Delivered") updatePayload.trackingStep = 4;
      }
      await setDoc(doc(db, "orders", id), updatePayload, { merge: true });
      addToast(`Order ${id} status updated to ${status}`, "success");
    } catch (err) {
      console.error(err);
      addToast("Failed to update order status", "error");
    }
  };

  const adminDeleteOrder = async (id) => {
    try {
      await deleteDoc(doc(db, "orders", id));
      addToast(`Order ${id} has been deleted.`, "info");
    } catch (err) {
      console.error(err);
      addToast("Failed to delete order", "error");
    }
  };

  const adminAddOrder = async (orderPayload) => {
    try {
      const now = new Date();
      const status = orderPayload.status || "Processing";
      const trackingStep =
        orderPayload.trackingStep ||
        (status === "Processing"
          ? 1
          : status === "Shipped"
            ? 2
            : status === "In Transit" || status === "Out for Delivery"
              ? 3
              : status === "Delivered"
                ? 4
                : 1);

      const newOrder = {
        id: orderPayload.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}-2026`,
        date: orderPayload.date || now.toISOString().split("T")[0],
        total: Number(orderPayload.total) || 0,
        status,
        trackingStep,
        items: Array.isArray(orderPayload.items) ? orderPayload.items : [],
        address: orderPayload.address || "",
        paymentMethod: orderPayload.paymentMethod || "COD"
      };

      const paymentStatus =
        status === "Cancelled" ? "Failed" : status === "Delivered" ? "Success" : "Pending";

      const newPayment = {
        id: orderPayload.paymentId || `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
        orderId: newOrder.id,
        customerName: orderPayload.customerName || "Guest Customer",
        customerEmail: orderPayload.customerEmail || "guest@example.com",
        customerPhone: orderPayload.customerPhone || "",
        amount: newOrder.total,
        paymentMethod: newOrder.paymentMethod === "COD" ? "Cash on Delivery (COD)" : newOrder.paymentMethod,
        date: newOrder.date,
        time: orderPayload.time || now.toLocaleTimeString("en-US", { hour12: false, hour: "2-digit", minute: "2-digit" }),
        status: paymentStatus
      };

      await setDoc(doc(db, "orders", newOrder.id), newOrder);
      await setDoc(doc(db, "payments", newPayment.id), newPayment);
      addToast(`Order ${newOrder.id} added successfully.`, "success");
      return true;
    } catch (err) {
      console.error(err);
      addToast("Failed to add order", "error");
      return false;
    }
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
        authLoading,
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
        adminUpdateCategory,
        adminAddProduct,
        adminDeleteProduct,
        settings,
        adminUpdateSettings,
        payments,
        adminUpdatePaymentStatus,
        adminAddPayment,
        adminDeletePayment,
        adminAddOrder,
        adminUpdateOrderStatus,
        adminDeleteOrder,
        uploadToImageKit
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

