import { createContext, useState, useContext, useEffect } from "react";
import api from "../api/axios"; 


const CartContext = createContext();


export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartCount, setCartCount] = useState(0); 
  const [cartItems, setCartItems] = useState([]); 

  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.id) {
      fetchCart(user.id);
    }
  }, [user]);

  const fetchCart = async (id) => {
    try {
      const res = await api.get(`/cart/${id}`);
      setCartItems(res.data);
      setCartCount(res.data.length);
    } catch (err) {
      console.error("Failed to load cart:", err);
    }
  };

  const addItemToCart = async (item, quantity) => {
    try {
      await api.post("/cart/add", {
        user: { id: user.id },
        product: { id: item.product.id },
        quantity: quantity,
      });
      fetchCart(user.id);
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const removeItemFromCart = async (itemId) => {
    try {
      await api.delete(`/cart/item/${itemId}`);
      fetchCart(user.id); 
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const getTotal = () => {
    return cartItems.reduce((total, item) => {
      if (!item.product || typeof item.product.price !== "number") return total;
      return total + item.product.price * item.quantity;
    }, 0);
  };
  

  const clearCart = async () => {
    try {
      await api.delete(`/cart/${user.id}`); 
      setCartItems([]);
      setCartCount(0);
    } catch (err) {
      console.error("Failed to clear cart:", err);
    }
  };
  

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        addItemToCart,
        removeItemFromCart,
        getTotal,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
