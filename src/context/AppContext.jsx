import React, { createContext, useContext, useState } from "react";
import { products as initialProducts } from "../data/products";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [products] = useState(initialProducts);
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
  const [promoDiscount, setPromoDiscount] = useState(null);
  const [toasts, setToasts] = useState([]);

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
        updateProfile
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
