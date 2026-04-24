import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../style/Navbar.css';



import WhatsappModal from './WhatsappModal';

import { useCart } from '../contexts/CartContext';
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, role } = useAuth();
  const { cartCount } = useCart();
  const currentPath = location.pathname;
  const [searchQuery, setSearchQuery] = useState('');
  const [isWhatsappModalOpen, setIsWhatsappModalOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="navbar glass-card">
      <div className="nav-brand">
        <Link to="/products" className="logo">
          <span className="logo-accent">NEXUS</span>MART
        </Link>
      </div>

      <div className="nav-search">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn">🔍</button>
        </form>
      </div>

      <div className="nav-links">
        {role !== 'admin' && role !== 'prime_admin' && (
          <>
            <Link to="/products" className={`nav-link ${currentPath === '/products' ? 'active' : ''}`}>Shop</Link>
            <Link to="/cart" className={`nav-link ${currentPath === '/cart' ? 'active' : ''}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <span className="cart-badge">{cartCount}</span>
            </Link>
          </>
        )}

        {role === 'admin' && (
          <>
            <Link to="/admin" className={`nav-link ${currentPath.startsWith('/admin') ? 'active' : ''}`}>Admin</Link>
            <Link to="/admin/orders" className={`nav-link ${currentPath === '/admin/orders' ? 'active' : ''}`}>Orders</Link>
            <button 
                onClick={() => setIsWhatsappModalOpen(true)} 
                className="nav-link btn-link" 
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', font: 'inherit' }}
            >
                Whatsapp Link
            </button>
          </>
        )}

        <div className="nav-actions">
          <button onClick={handleLogout} className="btn btn-secondary nav-btn">Logout</button>
        </div>
      </div>
      <WhatsappModal isOpen={isWhatsappModalOpen} onClose={() => setIsWhatsappModalOpen(false)} />
    </nav>
  );
};

export default Navbar;
