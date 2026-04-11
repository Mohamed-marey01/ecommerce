import React, { useEffect } from 'react';
import { useState } from 'react';
import './Admin.css';
import ProductModal from '../components/addProductModal';
import UpdateProductModal from '../components/updateProductPrice'

const AdminProducts = () => {

  const [mockProducts, setMockProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [productId, setProductId] = useState(null);

  const handleCreateProduct = async (productData) => {
    setShowModal(false);
  };

  const handleUpdateProduct = async (form) => {
    try {
      const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/updateProduct`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: productId, price: form.price })
      });
      const data = await response.json();

      if (response.ok || data.success) {
        setMockProducts(mockProducts.map(product =>
          product._id === productId ? { ...product, price: form.price } : product
        ));
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error('Error updating product:', error);
    }
    setShowUpdateModal(false);
  };


  const deleteProduct = async (id) => {
    try {
      const response = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/deleteProduct`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id })
      });
      const data = await response.json();
      console.log('Delete response:', data);
      setMockProducts(mockProducts.filter(product => product._id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };


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
        setMockProducts(Object.values(data));
        console.log('Fetched products');
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);



  return (
    <div className="page-container">
      <div className="admin-header">
        <h1>Products Management</h1>
        <button className="btn btn-primary" onClick={() => { setShowModal(true) }}>+ Add New Product</button>
      </div>
      <div className="glass-card">
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Product Info</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockProducts.map(product => (
                <tr key={product.id}>
                  <td className="flex-cell">
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(45deg, var(--primary-color), var(--secondary-color))', borderRadius: '8px', opacity: 0.8 }}></div>
                    <span style={{ fontWeight: 500 }}>{product.name}</span>
                  </td>
                  <td>{product.category_type}</td>
                  <td style={{ fontWeight: 600 }}>{product.price}</td>
                  <td>
                    <span className={product.qnt > 0 ? "badge badge-delivered" : "badge badge-pending"}>
                      {product.qnt > 0 ? `${product.qnt} in stock` : 'Out of Stock'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="btn btn-secondary btn-icon" onClick={() => {
                        setShowUpdateModal(true)
                        setProductId(product._id);
                      }
                      }>✎</button>
                      <button className="btn btn-danger btn-icon" onClick={() => deleteProduct(product._id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <UpdateProductModal
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onSave={handleUpdateProduct}
      />
      <ProductModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleCreateProduct}
      />
    </div>
  );
};

export default AdminProducts;
