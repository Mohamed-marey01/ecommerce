import React from 'react';
import './CustomerProducts.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';


const CustomerProducts = () => {
  
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('search') || '';

  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [ordersCount, setOrdersCount] = useState(0);

  const handleClick = (e, product) => {
    e.preventDefault();
    const newOrders = [...orders, product];
    setOrders(newOrders);
    localStorage.setItem('orders', JSON.stringify(newOrders));
    setOrdersCount(ordersCount + 1);
    localStorage.setItem('ordersCount', JSON.stringify(ordersCount + 1));

    const cart = newOrders.reduce((acc, current) => {
                const id = current._id; 
                acc[id] = (acc[id] || 0 ) + 1;
                return acc;
            },{});
            localStorage.setItem('cart' , cart);
            console.log(cart);
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
        {filteredProducts.length > 0 ? filteredProducts.map(product => (
          <div key={product._id} className="glass-card product-card">
            <div className="product-image-wrapper">
              <img src={product.image} alt={product.name} className="product-image-placeholder" />
            </div>

            <div className="product-info">
              <span className="product-category">{product.category_type}</span>
              <h3 className="product-title">{product.name}</h3>
              <div className="product-price">${product.price.toFixed(2)}</div>
              <span className="product-description">{product.qnt} in stock</span>

              <button className="btn btn-primary btn-add-cart" onClick={(e) => handleClick(e, product)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '8px' }}>
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                Add to Cart
              </button>
            </div>
          </div>
        )) : (
          <div style={{ padding: '2rem', textAlign: 'center', gridColumn: '1 / -1', opacity: 0.7 }}>
            No products match your search.
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerProducts;
