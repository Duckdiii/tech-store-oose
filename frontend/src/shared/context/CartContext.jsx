import { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../../api/httpClient';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_cart') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ts_cart', JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeItem = (id) => setItems(prev => prev.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => setItems([]);

  const updateCartState = (cartData) => {
    if (!cartData || !cartData.items) return;
    const mappedItems = cartData.items.map(item => ({
      id: item.cartItemId, // backend cartItemId
      name: item.productName,
      variantDisplay: item.variantDisplay,
      price: item.unitPrice,
      qty: item.quantity,
      brand: '',
      bundleServices: item.bundleServices || []
    }));
    setItems(mappedItems);
  };

  const addBundleServiceToItem = (cartItemId, bundleServiceId) => {
    const customerId = user?.id || '1';
    httpClient.post(`/cart/items/${cartItemId}/bundle-services/${bundleServiceId}?customerId=${customerId}`)
      .then(response => {
        updateCartState(response.data);
      })
      .catch(error => {
        console.error('Error adding bundle service:', error);
      });
  };

  const removeBundleServiceFromItem = (cartItemId, bundleServiceId) => {
    const customerId = user?.id || '1';
    httpClient.delete(`/cart/items/${cartItemId}/bundle-services/${bundleServiceId}?customerId=${customerId}`)
      .then(response => {
        updateCartState(response.data);
      })
      .catch(error => {
        console.error('Error removing bundle service:', error);
      });
  };

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQty, clearCart, total, count, addBundleServiceToItem, removeBundleServiceFromItem }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
