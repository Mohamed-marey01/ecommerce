import React, { useState, useEffect } from 'react';
import '../style/Admin.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/admin/orders`, {
          credentials: 'include'
        });
        const data = await response.json();
        if (data.success) {
          setOrders(data.orders);
        }
      } catch (err) {
        console.error("Error fetching admin orders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id, currentStatus) => {
    const statuses = ['Pending', 'Shipped', 'Delivered'];
    const nextStatusIndex = (statuses.indexOf(currentStatus) + 1) % statuses.length;
    const newStatus = statuses[nextStatusIndex];

    try {
      const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/admin/orders/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setOrders(orders.map(order => order._id === id ? { ...order, status: newStatus } : order));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending': return 'badge badge-pending';
      case 'Shipped': return 'badge badge-shipped';
      case 'Delivered': return 'badge badge-delivered';
      default: return 'badge';
    }
  };

  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Order Management</h1>
      </div>

      <div className="glass-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Date</th>
                <th>Products</th>
                <th>Total Quantity</th>
                <th>Total Value</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No orders found.</td>
                </tr>
              ) : (
                orders.map(order => {
                  const customerName = order.costumerId?.profile
                    ? `${order.costumerId.profile.firstName || ''} ${order.costumerId.profile.lastName || ''}`.trim()
                    : order.shippingDetails
                      ? `${order.shippingDetails.firstName} ${order.shippingDetails.lastName}`
                      : 'Unknown Customer';

                  const dateString = new Date(order.orderDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  });

                  return (
                    <tr key={order._id}>
                      <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--primary-color)' }}>
                        #{order._id.substring(order._id.length - 6).toUpperCase()}
                      </td>
                      <td style={{ fontWeight: 500 }}>{customerName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{dateString}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                           {order.productsIdQuantities?.map((item, idx) => (
                             <div key={idx} style={{ fontSize: '0.85rem' }}>
                               <span style={{ fontWeight: 600 }}>{item.quantity}x</span> {item.prroduct_id?.name || 'Unknown Product'}
                             </div>
                           ))}
                        </div>
                      </td>
                      <td style={{ fontWeight: 500, textAlign: 'center' }}>{order.totalQuantity}</td>
                      <td style={{ fontWeight: 600 }}>${order.totalPrice?.toFixed(2) || '0.00'}</td>
                      <td>
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                            onClick={() => handleUpdateStatus(order._id, order.status)}
                          >
                            Update Status
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
