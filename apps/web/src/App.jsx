import React from 'react';
import { Route, Routes, BrowserRouter as Router, Navigate } from 'react-router-dom';
import ScrollToTop from '@/components/ScrollToTop.jsx';
import DashboardPage from '@/pages/DashboardPage.jsx';
import ClientPortalPage from '@/pages/ClientPortalPage.jsx';
import SuccessPage from '@/pages/SuccessPage.jsx';
import PaymentCancelPage from '@/pages/PaymentCancelPage.jsx';
import LoginPage from '@/pages/LoginPage.jsx';
import SignupPage from '@/pages/SignupPage.jsx';
import PasswordResetPage from '@/pages/PasswordResetPage.jsx';
import HomePage from '@/pages/HomePage.jsx';
import ProductDetailPage from '@/pages/ProductDetailPage.jsx';
import { ClientManagementProvider } from '@/context/ClientManagementContext.jsx';
import { AuthProvider, useAuth } from '@/context/AuthContext.jsx';
import { CartProvider } from '@/hooks/useCart.jsx';
import ProtectedRoute from '@/components/ProtectedRoute.jsx';
import { Toaster } from 'sonner';

const AuthRedirect = ({ children }) => {
  const { isAuthenticated, initialLoading } = useAuth();
  if (initialLoading) return null;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <CartProvider>
        <AuthProvider>
          <ClientManagementProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={
                <AuthRedirect>
                  <LoginPage />
                </AuthRedirect>
              } />
              <Route path="/signup" element={
                <AuthRedirect>
                  <SignupPage />
                </AuthRedirect>
              } />
              <Route path="/password-reset" element={
                <AuthRedirect>
                  <PasswordResetPage />
                </AuthRedirect>
              } />
              
              {/* PUBLIC Routes for Clients & E-commerce */}
              <Route path="/client-portal/:clientId" element={<ClientPortalPage />} />
              <Route path="/client-portal/:clientId/product/:id" element={<ProductDetailPage />} />
              <Route path="/client-portal/:clientId/success" element={<SuccessPage />} />
              <Route path="/cancel" element={<PaymentCancelPage />} />
              
              {/* PROTECTED Routes for Studio Owners */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ClientManagementProvider>
        </AuthProvider>
      </CartProvider>
      <Toaster position="bottom-right" richColors />
    </Router>
  );
}

export default App;