import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/admin/ProtectedRoute';
import PublicLayout from '@/components/layout/PublicLayout';
import HomePage from '@/pages/HomePage';
import ShowsPage from '@/pages/ShowsPage';
import MusicPage from '@/pages/MusicPage';
import GalleryPage from '@/pages/GalleryPage';
import EpkPage from '@/pages/EpkPage';
import ShopPage from '@/pages/ShopPage';
import ProductPage from '@/pages/ProductPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import NotFoundPage from '@/pages/NotFoundPage';
import AdminLoginPage from '@/pages/admin/AdminLoginPage';
import AdminLayout from '@/components/admin/AdminLayout';
import DashboardPage from '@/pages/admin/DashboardPage';
import ShowsAdminPage from '@/pages/admin/ShowsAdminPage';
import GalleryAdminPage from '@/pages/admin/GalleryAdminPage';
import EpkAdminPage from '@/pages/admin/EpkAdminPage';
import ProductsAdminPage from '@/pages/admin/ProductsAdminPage';
import ProductEditPage from '@/pages/admin/ProductEditPage';
import OrdersAdminPage from '@/pages/admin/OrdersAdminPage';
import OrderDetailPage from '@/pages/admin/OrderDetailPage';

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/shows" element={<ShowsPage />} />
        <Route path="/musica" element={<MusicPage />} />
        <Route path="/galeria" element={<GalleryPage />} />
        <Route path="/epk" element={<EpkPage />} />
        <Route path="/tienda" element={<ShopPage />} />
        <Route path="/tienda/:slug" element={<ProductPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/pedido/confirmacion" element={<OrderConfirmationPage />} />
      </Route>
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="shows" element={<ShowsAdminPage />} />
        <Route path="galeria" element={<GalleryAdminPage />} />
        <Route path="epk" element={<EpkAdminPage />} />
        <Route path="tienda" element={<ProductsAdminPage />} />
        <Route path="tienda/nuevo" element={<ProductEditPage />} />
        <Route path="tienda/:id" element={<ProductEditPage />} />
        <Route path="pedidos" element={<OrdersAdminPage />} />
        <Route path="pedidos/:id" element={<OrderDetailPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRouter;
