import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

const CART_KEY = "havenhaus_cart";
const WISH_KEY = "havenhaus_wishlist";

const UserDataContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  // Load saved cart and wishlist
  useEffect(() => {
    try {
      const savedCart = JSON.parse(
        localStorage.getItem(CART_KEY) || "[]"
      );

      const savedWishlist = JSON.parse(
        localStorage.getItem(WISH_KEY) || "[]"
      );

      setCart(Array.isArray(savedCart) ? savedCart : []);
      setWishlist(
        Array.isArray(savedWishlist) ? savedWishlist : []
      );
    } catch (error) {
      console.error("Error loading user data:", error);
      setCart([]);
      setWishlist([]);
    }
  }, []);

  // Save cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }, [cart]);

  // Save wishlist
  useEffect(() => {
    try {
      localStorage.setItem(
        WISH_KEY,
        JSON.stringify(wishlist)
      );
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }, [wishlist]);

  // ---------------- CART ----------------

  const addToCart = useCallback((product, qty = 1) => {
    if (!product) return;

    const quantity = Math.max(1, Number(qty) || 1);

    setCart((prev) => {
      const productId = product.id || product._id;

      const index = prev.findIndex(
        (item) =>
          (item.id || item._id) === productId
      );

      if (index !== -1) {
        const next = [...prev];

        next[index] = {
          ...next[index],
          quantity:
            (Number(next[index].quantity) || 0) +
            quantity,
        };

        return next;
      }

      return [
        ...prev,
        {
          ...product,
          id: product.id || product._id,
          quantity,
        },
      ];
    });
  }, []);

  // Decrease quantity by 1
  const removeFromCart = useCallback((id) => {
    setCart((prev) =>
      prev
        .map((item) => {
          const itemId = item.id || item._id;

          if (itemId === id) {
            return {
              ...item,
              quantity:
                (Number(item.quantity) || 1) - 1,
            };
          }

          return item;
        })
        .filter(
          (item) => Number(item.quantity) > 0
        )
    );
  }, []);

  // Remove item completely
  const deleteFromCart = useCallback((id) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          (item.id || item._id) !== id
      )
    );
  }, []);

  // Set exact quantity
  const updateQuantity = useCallback(
    (id, qty) => {
      const quantity = Number(qty);

      if (!Number.isFinite(quantity) || quantity < 1) {
        deleteFromCart(id);
        return;
      }

      setCart((prev) =>
        prev.map((item) => {
          const itemId = item.id || item._id;

          return itemId === id
            ? {
                ...item,
                quantity: Math.floor(quantity),
              }
            : item;
        })
      );
    },
    [deleteFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  // ---------------- WISHLIST ----------------

  const addToWishlist = useCallback((product) => {
    if (!product) return;

    setWishlist((prev) => {
      const productId = product.id || product._id;

      const exists = prev.some(
        (item) =>
          (item.id || item._id) === productId
      );

      if (exists) {
        return prev;
      }

      return [
        ...prev,
        {
          ...product,
          id: product.id || product._id,
        },
      ];
    });
  }, []);

  const removeFromWishlist = useCallback((id) => {
    setWishlist((prev) =>
      prev.filter(
        (item) =>
          (item.id || item._id) !== id
      )
    );
  }, []);

  const clearWishlist = useCallback(() => {
    setWishlist([]);
  }, []);

  // ---------------- CALCULATIONS ----------------

  const totalItems = useMemo(() => {
    return cart.reduce(
      (sum, item) =>
        sum + (Number(item.quantity) || 0),
      0
    );
  }, [cart]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      const price =
        Number(
          String(item.price || "")
            .replace(/[₹,\s]/g, "")
        ) || 0;

      const quantity =
        Number(item.quantity) || 0;

      return sum + price * quantity;
    }, 0);
  }, [cart]);

  const value = {
    cart,
    wishlist,

    totalItems,
    subtotal,

    addToCart,
    removeFromCart,
    deleteFromCart,
    updateQuantity,
    clearCart,

    addToWishlist,
    removeFromWishlist,
    clearWishlist,
  };

  return (
    <UserDataContext.Provider value={value}>
      {children}
    </UserDataContext.Provider>
  );
};

export const useUserData = () => {
  const context = useContext(UserDataContext);

  if (!context) {
    throw new Error(
      "useUserData must be used inside a UserProvider"
    );
  }

  return context;
};

export default UserDataContext;