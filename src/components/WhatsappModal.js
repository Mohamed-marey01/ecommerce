import React, { useState, useEffect } from 'react';
import '../style/Auth.css'; // Reusing auth styles for glassmorphism consistency

const WhatsappModal = ({ isOpen, onClose }) => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (isOpen) {
            fetchWhatsapp();
        }
    }, [isOpen]);

    const fetchWhatsapp = async () => {
        try {
            const response = await fetch('https://ecommerce-backend-theta-nine.vercel.app/api/whatsapp', {
                credentials: 'include'
            });
            const data = await response.json();
            if (data.success) {
                setPhoneNumber(data.phoneNumber || '');
            }
        } catch (error) {
            console.error('Error fetching WhatsApp:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await fetch('https://ecommerce-backend-theta-nine.vercel.app/api/whatsapp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ phoneNumber })
            });

            const data = await response.json();
            if (data.success) {
                setMessage({ type: 'success', text: 'WhatsApp number updated!' });
                setTimeout(() => onClose(), 1500);
            } else {
                setMessage({ type: 'error', text: data.message || 'Failed to update' });
            }
        } catch (error) {
            setMessage({ type: 'error', text: 'An error occurred' });
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-card auth-card" style={{ maxWidth: '400px', width: '90%', padding: '2rem' }}>
                <div className="auth-header">
                    <h2>WhatsApp Link</h2>
                    <p>Enter your WhatsApp number for 24/7 customer support</p>
                </div>

                {message.text && (
                    <div style={{
                        color: message.type === 'success' ? '#4ade80' : '#f87171',
                        textAlign: 'center',
                        marginBottom: '1rem',
                        padding: '0.5rem',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px'
                    }}>
                        {message.text}
                    </div>
                )}

                <form className="auth-form" onSubmit={handleSave}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            required
                        />
                        <label>WhatsApp Number</label>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Number'}
                        </button>
                        <button type="button" onClick={onClose} className="btn btn-secondary btn-block">
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default WhatsappModal;
