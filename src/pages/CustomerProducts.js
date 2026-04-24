import React from 'react';
import '../style/CustomerProducts.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

const CustomerProducts = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
  }

  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/products`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        const data = await response.json();
        setProducts(Object.values(data));
        console.log('Fetched products');
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);


  const filteredProducts = products.filter(product => {
    const searchLower = searchQuery.toLowerCase();
    return (
      (product.name && product.name.toLowerCase().includes(searchLower)) ||
      (product.category && product.category.toLowerCase().includes(searchLower)) ||
      (product.category_type && product.category_type.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {searchQuery ? `Search Results for "${searchQuery}"` : <>Featured <span>Products</span></>}
        </h1>
      </div>

      <div className="products-grid">
        {filteredProducts.length > 0 ? filteredProducts.map(product => {
          const productActions = (
            <div className="product-actions">
              <button className="btn btn-primary btn-add-cart" onClick={(e) => handleAddToCart(e, product)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cart-icon">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>

              {product.whatsappNumber && (
                <a
                  href={`https://wa.me/${product.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-whatsapp"
                  title="Chat on WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.621 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              )}
            </div>
          );

          return (
            <div key={product._id} className="glass-card product-card">
              <div className="product-image-wrapper">
                <img
                  src={product.imageUrl || product.image}
                  alt={product.name}
                  className="product-image-placeholder"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://picsum.photos/300/300?grayscale';
                  }}
                />
              </div>

              <div className="product-info">
                <span className="product-category">{product.category || product.category_type}</span>
                <h3 className="product-title">{product.name}</h3>
                <div className="product-price">${product.price?.toFixed(2) || '0.00'}</div>
                <span className="product-description">{product.qnt} in stock</span>
                {productActions}
              </div>

              {/* Hover Popup */}
              <div className="product-popup">
                <div className="popup-header">
                  <img
                    src={product.imageUrl || product.image}
                    alt="popup-img"
                    className="popup-img"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://picsum.photos/300/300?grayscale';
                    }}
                  />
                  <div>
                    <h4 className="popup-brand">{product.brand || 'Generic Brand'}</h4>
                    <h3 className="popup-title-text">{product.name}</h3>
                  </div>
                </div>
                <div className="popup-details">
                  <div className="popup-price-text">${product.price?.toFixed(2) || '0.00'}</div>
                  <div className="popup-qty">Available: {product.qnt}</div>
                </div>
                <p className="popup-desc">{product.description || 'No description available for this product.'}</p>
                <div className="popup-actions-wrapper">
                  {productActions}
                </div>
              </div>
            </div>
          );
        }) : (
          <div className="no-results">
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProducts;
