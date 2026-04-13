import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  const [shippingData, setShippingData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: ''
  });
  
  const orders = JSON.parse(localStorage.getItem('orders')) ? Object.values(JSON.parse(localStorage.getItem('orders'))) : [];
  const total = orders.reduce((sum, order) => sum + Number(order.price), 0).toFixed(2);
  const cart = localStorage.getItem('cart') || {};
  const ordersCount = JSON.parse(localStorage.getItem('ordersCount')) || 0;
  console.log('The orders', orders);
  console.log('The total', total);

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
          ordersCount
        })
      });
      const data = await response.json();

      if (data.success) {
        alert("Order placed successfully!");
        localStorage.removeItem('orders');
        localStorage.removeItem('ordersCount');
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
              <span style={{ color: 'var(--primary-color)' }}>1.</span> Shipping Address
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
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', fontWeight: 600 }}>Order Summary</h3>

            {/* Render Cart Items */}
            {orders.length > 0 ? (
              orders.map((order, index) => (
                <div className="summary-product" key={index}>
                  <div className="summary-img">📦</div>
                  <div className="summary-details">
                    <div className="summary-title">{order.name}</div>
                    <div className="summary-qty">Qty: 1</div>
                  </div>
                  <div className="summary-product-price">${Number(order.price).toFixed(2)}</div>
                </div>
              ))
            ) : (
              <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.7 }}>
                Your cart is empty
              </div>
            )}

            <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
                <span style={{ color: 'var(--primary-color)' }}>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>

            <button className="btn btn-primary" onClick={handleConfirmPay} style={{ width: '100%', marginTop: '1.5rem', padding: '1rem', fontSize: '1.1rem' }}>
              Confirm & Pay
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
