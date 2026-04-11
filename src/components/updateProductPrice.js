import React from 'react';

const UpdateProductModal = ({ isOpen, onClose, onSave }) => {


    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (onSave) {
            onSave(data);
        } else {
            onClose();
        }
    };
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Change The Product Price</h2>
                    <button className="close-X" onClick={onClose}>&times;</button>
                </header>
                <form onSubmit={handleFormSubmit}>
                    <div className="input-group">
                        <label>Price ($)</label>
                        <input name="price" type="number" step="0.01" placeholder="24.99" required />
                    </div>
                    <button type="submit" className="save-btn">Update Price</button>
                </form>
            </div>
        </div>
    );
};

export default UpdateProductModal;