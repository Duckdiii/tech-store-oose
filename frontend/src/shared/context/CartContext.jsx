import { createContext, useContext, useState, useEffect } from 'react';
import { httpClient } from '../../api/httpClient';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useTheme } from './ThemeContext';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { t } = useTheme();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ts_cart') || '[]'); }
    catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('ts_cart', JSON.stringify(items));
  }, [items]);

  const updateCartState = (cartData) => {
    if (!cartData || !cartData.items) return;
    const mappedItems = cartData.items.map(item => ({
      id: item.cartItemId, // backend cartItemId
      variantId: item.productVariantId, // keep the variant ID for synchronization
      name: item.productName,
      variantDisplay: item.variantDisplay,
      price: item.unitPrice,
      qty: item.quantity,
      brand: item.brandName || '',
      brandName: item.brandName || '',
      thumbnailUrl: item.thumbnailUrl || '',
      bundleServices: item.bundleServices || [],
      screenSize: item.screenSize,
      screenResolution: item.screenResolution,
      chipset: item.chipset,
      rearCamera: item.rearCamera,
      frontCamera: item.frontCamera,
      batteryCapacity: item.batteryCapacity,
      simType: item.simType,
      operatingSystem: item.operatingSystem,
      nfcSupported: item.nfcSupported,
      ramGb: item.ramGb,
      storageGb: item.storageGb,
      color: item.color
    }));
    setItems(mappedItems);
  };

  const syncCartWithBackend = (currentItems) => {
    if (!user) return;
    const payload = {
      items: currentItems.map(item => ({
        productVariantId: item.variantId || item.id,
        quantity: item.qty,
        bundleServiceIds: (item.bundleServices || []).map(b => b.id)
      }))
    };
    httpClient.post('/cart/sync', payload)
      .then(response => {
        updateCartState(response.data);
      })
      .catch(error => {
        console.error('Error syncing cart:', error);
      });
  };

  // Sync cart with backend on mount/login
  useEffect(() => {
    if (user) {
      httpClient.get('/cart')
        .then(response => {
          const backendCart = response.data;
          if (backendCart.items && backendCart.items.length > 0) {
            updateCartState(backendCart);
          } else if (items.length > 0) {
            syncCartWithBackend(items);
          }
        })
        .catch(error => {
          console.error('Error fetching backend cart:', error);
        });
    }
  }, [user]);

  const addItem = (product, qty = 1) => {
    const targetVariantId = product.variantId || product.id;
    const existing = items.find(i => i.id === product.id || i.variantId === targetVariantId);
    let updated;
    if (existing) {
      updated = items.map(i => i.id === existing.id ? { ...i, qty: i.qty + qty } : i);
    } else {
      updated = [...items, { ...product, variantId: targetVariantId, qty }];
    }
    setItems(updated);
    if (user) {
      syncCartWithBackend(updated);
    }
  };

  const removeItem = (id) => {
    const updated = items.filter(i => i.id !== id);
    setItems(updated);
    if (user) {
      syncCartWithBackend(updated);
    }
  };

  const updateQty = (id, qty) => {
    if (qty <= 0) { removeItem(id); return; }
    const updated = items.map(i => i.id === id ? { ...i, qty } : i);
    setItems(updated);
    if (user) {
      syncCartWithBackend(updated);
    }
  };

  const clearCart = () => {
    setItems([]);
    if (user) {
      syncCartWithBackend([]);
    }
  };

  const addBundleServiceToItem = (cartItemId, bundleServiceId) => {
    httpClient.post(`/cart/items/${cartItemId}/bundle-services/${bundleServiceId}`)
      .then(response => {
        updateCartState(response.data);
      })
      .catch(error => {
        console.error('Error adding bundle service:', error);
        const rawMsg = error.response?.data?.message || 'Unable to add bundle service. Please try again later.';
        showToast(t(rawMsg), 'error');
      });
  };

  const removeBundleServiceFromItem = (cartItemId, bundleServiceId) => {
    httpClient.delete(`/cart/items/${cartItemId}/bundle-services/${bundleServiceId}`)
      .then(response => {
        updateCartState(response.data);
      })
      .catch(error => {
        console.error('Error removing bundle service:', error);
        const rawMsg = error.response?.data?.message || 'Unable to remove bundle service. Please try again later.';
        showToast(t(rawMsg), 'error');
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
