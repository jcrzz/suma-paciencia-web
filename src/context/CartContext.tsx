import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem } from '@/types';

const STORAGE_KEY = 'sp_cart_v2';

export type CartContextType = {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: CartItem) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  removeItem: (productId: string, size: string) => void;
  clearCart: () => void;
  quantityOf: (productId: string, size: string) => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider');
  return ctx;
};

function readStored(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(readStored);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      /* cuota excedida: el carrito sigue en memoria */
    }
  }, [items]);

  const addItem = useCallback((item: CartItem) => {
    setItems((current) => {
      const index = current.findIndex((i) => i.productId === item.productId && i.size === item.size);
      if (index === -1) return [...current, item];
      const copy = [...current];
      copy[index] = { ...copy[index], quantity: copy[index].quantity + item.quantity };
      return copy;
    });
    setIsOpen(true);
  }, []);

  const setQuantity = useCallback((productId: string, size: string, quantity: number) => {
    setItems((current) => {
      if (quantity <= 0) return current.filter((i) => !(i.productId === productId && i.size === size));
      return current.map((i) =>
        i.productId === productId && i.size === size ? { ...i, quantity } : i
      );
    });
  }, []);

  const removeItem = useCallback((productId: string, size: string) => {
    setItems((current) => current.filter((i) => !(i.productId === productId && i.size === size)));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const cartCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items]
  );
  const quantityOf = useCallback(
    (productId: string, size: string) =>
      items.find((i) => i.productId === productId && i.size === size)?.quantity ?? 0,
    [items]
  );

  const value = useMemo<CartContextType>(
    () => ({
      items,
      cartCount,
      subtotal,
      isOpen,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
      quantityOf,
    }),
    [items, cartCount, subtotal, isOpen, addItem, setQuantity, removeItem, clearCart, quantityOf]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
