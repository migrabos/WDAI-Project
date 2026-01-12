import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await api.get('/cart');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await api.post('/cart', { productId, quantity });
      setItems(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error adding to cart' };
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await api.put(`/cart/${itemId}`, { quantity });
      setItems(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error updating cart' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await api.delete(`/cart/${itemId}`);
      setItems(response.data);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error removing from cart' };
    }
  };

  const clearCart = async () => {
    try {
      await api.delete('/cart');
      setItems([]);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error clearing cart' };
    }
  };

  const checkout = async () => {
    try {
      const response = await api.post('/orders');
      setItems([]);
      return { success: true, order: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error during checkout' };
    }
  };

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      items,
      loading,
      total,
      itemCount,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      checkout,
      fetchCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
