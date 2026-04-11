import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Registration from './pages/Registration';
import AdminProducts from './pages/AdminProducts';
import AdminOrders from './pages/AdminOrders';
import CustomerProducts from './pages/CustomerProducts';
import Checkout from './pages/Checkout';

function AppContent() {
  const { isLoggedIn, role } = useAuth();

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn && <Navbar />}
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Registration />} />

          {/* Protected Routes */}
          <Route path="/admin" element={role === 'admin' ? <AdminProducts /> : <Navigate to="/products" />} />
          <Route path="/admin/orders" element={role === 'admin' ? <AdminOrders /> : <Navigate to="/products" />} />
          <Route path="/products" element={<CustomerProducts />} />
          <Route path="/cart" element={<Checkout />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
