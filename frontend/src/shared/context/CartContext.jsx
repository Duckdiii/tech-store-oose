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

  useEffect(() => {
    if (!user) return;
    httpClient.get('/cart')
      .then(response => updateCartState(response.data))
      .catch(error => {
        console.error('Error loading cart:', error);
      });
  }, [user]);

  const addItem = (product, qty = 1) => {
    const variantId = product.productVariantId || product.variantId || product.id;
    if (user && variantId) {
      return httpClient.post('/cart/items', { productVariantId: variantId, quantity: qty })
        .then(response => updateCartState(response.data))
        .catch(error => {
          console.error('Error adding cart item:', error);
          setItems(prev => {
            const existing = prev.find(i => i.id === product.id);
            if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
            return [...prev, { ...product, qty }];
          });
        });
    }

    setItems(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
    return Promise.resolve();
  };

  const removeItem = (id) => {
    if (user) {
      httpClient.delete(`/cart/items/${id}`)
        .then(response => updateCartState(response.data))
        .catch(error => {
          console.error('Error removing cart item:', error);
        });
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    if (user) {
      httpClient.patch(`/cart/items/${id}`, { quantity: qty })
        .then(response => updateCartState(response.data))
        .catch(error => {
          console.error('Error updating cart item:', error);
        });
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => {
    if (user) {
      httpClient.delete('/cart/items')
        .then(response => updateCartState(response.data))
        .catch(error => {
          console.error('Error clearing cart:', error);
        });
      return;
    }
    setItems([]);
  };

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
