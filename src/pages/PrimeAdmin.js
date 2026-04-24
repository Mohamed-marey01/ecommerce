import React, { useEffect, useState } from 'react';
import '../style/Admin.css';

const PrimeAdmin = () => {
    const [codes, setCodes] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [products, setProducts] = useState([]);
    const [activeTab, setActiveTab] = useState('codes');

    const generateCode = async () => {
        try {
            const res = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/prime/generateCode`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            if (res.ok) fetchCodes();
        } catch (e) {
            console.error(e);
        }
    };

    const fetchCodes = async () => {
        try {
            const res = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/prime/codes`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) setCodes(data.codes);
        } catch (e) { console.error(e); }
    };

    const fetchAdmins = async () => {
        try {
            const res = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/prime/admins`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            if (data.success) setAdmins(data.admins);
        } catch (e) { console.error(e); }
    };

    const fetchProducts = async () => {
        try {
            const res = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/admin/products`, {
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include'
            });
            const data = await res.json();
            if (Array.isArray(data)) setProducts(data);
        } catch (e) { console.error(e); }
    };

    const deleteAdmin = async (id) => {
        if (!window.confirm("Are you sure? This will delete the admin and their products.")) return;
        try {
            const res = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/prime/admin/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });
            if (res.ok) {
                fetchAdmins();
                fetchProducts();
            }
        } catch (e) { console.error(e); }
    };

    const deleteProduct = async (id) => {
        try {
            const res = await fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/deleteProduct`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
                credentials: 'include'
            });
            if (res.ok) fetchProducts();
        } catch (e) { console.error(e); }
    };

    useEffect(() => {
        fetchCodes();
        fetchAdmins();
        fetchProducts();
    }, []);

    return (
        <div className="page-container">
            <div className="admin-header">
                <h1>Prime Admin Dashboard</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button className={activeTab === 'codes' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setActiveTab('codes')}>Registration Codes</button>
                    <button className={activeTab === 'admins' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setActiveTab('admins')}>Manage Admins</button>
                    <button className={activeTab === 'products' ? 'btn btn-primary' : 'btn btn-secondary'} onClick={() => setActiveTab('products')}>All Products</button>
                </div>
            </div>

            <div className="glass-card">
                {activeTab === 'codes' && (
                    <div className="data-table-wrapper">
                        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem'}}>
                            <h2>Registration Codes</h2>
                            <button className="btn btn-primary" onClick={generateCode}>+ Generate Code</button>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Code</th>
                                    <th>Status</th>
                                    <th>Used By (Email)</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {codes.map(code => (
                                    <tr key={code._id}>
                                        <td style={{fontWeight: 'bold', fontFamily: 'monospace', letterSpacing: '2px'}}>{code.code}</td>
                                        <td>
                                            <span className={code.isUsed ? "badge badge-pending" : "badge badge-delivered"}>
                                                {code.isUsed ? 'Used' : 'Available'}
                                            </span>
                                        </td>
                                        <td>{code.usedBy ? code.usedBy.email : '-'}</td>
                                        <td>{new Date(code.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'admins' && (
                    <div className="data-table-wrapper">
                        <h2>Registered Admins</h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {admins.map(admin => (
                                    <tr key={admin._id}>
                                        <td>{admin.email}</td>
                                        <td>{admin.role}</td>
                                        <td>
                                            <button className="btn btn-danger btn-icon" onClick={() => deleteAdmin(admin._id)}>🗑</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="data-table-wrapper">
                        <h2>All Organization Products</h2>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Product Info</th>
                                    <th>Category</th>
                                    <th>Price</th>
                                    <th>Owner Admin</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product._id}>
                                        <td className="flex-cell">
                                            <span style={{ fontWeight: 500 }}>{product.name}</span>
                                        </td>
                                        <td>{product.category || product.category_type}</td>
                                        <td style={{ fontWeight: 600 }}>${product.price}</td>
                                        <td>{product.admin_id ? product.admin_id.email : 'Unknown'}</td>
                                        <td>
                                            <div className="action-btns">
                                                <button className="btn btn-danger btn-icon" onClick={() => deleteProduct(product._id)}>🗑</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrimeAdmin;
