import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Checkout.css';

import { useCart } from '../contexts/CartContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart, cartCount, removeFromCart } = useCart();
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: ''
  });
  
  const orders = cartItems;
  const total = orders.reduce((sum, order) => sum + Number(order.price), 0).toFixed(2);
  
  // Calculate cart object for backend legacy support if needed
  const cart = orders.reduce((acc, current) => {
    const id = current._id; 
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleConfirmPay = async (e) => {
    e.preventDefault();
    if (orders.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    if (!shippingData.firstName || !shippingData.lastName || !shippingData.address || !shippingData.city) {
      alert("Please fill in all shipping details.");
      return;
    }

    try {
      const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          cart, 
          orders,
          shippingDetails: shippingData,
          total, 
          ordersCount: cartCount
        })
      });
      const data = await response.json();

      if (data.success) {
        alert("Order placed successfully!");
        clearCart();
        navigate('/products');
      } else {
        alert(data.message || "Failed to place order.");
      }
    } catch (err) {
      console.error(err);
      alert("Server is offline or an error occurred.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Secure <span>Checkout</span></h1>
      </div>

      <div className="checkout-container">

        {/* Forms Container */}
        <div className="checkout-forms">

          <div className="glass-card checkout-section">
            <h3>
              <span className="step-number">1.</span> Shipping Address
            </h3>

            <form onSubmit={handleConfirmPay}>
              <div className="form-row">
                <div className="input-group">
                  <label>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    value={shippingData.firstName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    value={shippingData.lastName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Street Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="123 Main St"
                  value={shippingData.address}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="input-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    placeholder="New York"
                    value={shippingData.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        <div>
          <div className="glass-card order-summary-card">
            <h3 className="order-summary-header">Order Summary</h3>

            {/* Render Cart Items */}
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div className="summary-product item-relative" key={index}>
                  <div className="summary-img">📦</div>
                  <div className="summary-details">
                    <div className="summary-title">{order.name}</div>
                    <div className="summary-qty">Qty: 1</div>
                  </div>
                  <div className="summary-product-price">${Number(order.price).toFixed(2)}</div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="btn-remove-item"
                    title="Remove item"
                  >
                    ×
                  </button>
                </div>
              ))
            ) : (
              <div className="empty-cart-message">
                Your cart is empty
              </div>
            )}

            <div className="summary-divider">
              <div className="summary-item">
                <span>Subtotal</span>
                <span>${total}</span>
              </div>
              <div className="summary-item">
                <span>Shipping</span>
                <span>$0.00</span>
              </div>
              <div className="summary-item">
                <span>Taxes (8%)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>

              <div className="summary-item total">
                <span>Total</span>
                <span className="total-value">${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-confirm-pay" onClick={handleConfirmPay}>
              Confirm & Pay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
