import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import { EraProvider } from '@/context/EraContext';
import { ToastProvider } from '@/context/ToastContext';
import { AppRouter } from '@/router';

export default function App() {
  return (
    <EraProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <AppRouter />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </EraProvider>
  );
}
