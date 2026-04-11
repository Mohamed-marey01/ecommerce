import React from 'react';

const ProductModal = ({ isOpen, onClose }) => {
    
    
    if (!isOpen) return null;

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        try{

            fetch(`https://ecommerce-backend-theta-nine.vercel.app/api/newProducts`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
        } catch (error) {
            console.error('Error adding product:', error);
        }
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>Add New Product</h2>
                    <button className="close-X" onClick={onClose}>&times;</button>
                </header>
                
                <form onSubmit={handleFormSubmit}>
                    <div className="input-group">
                        <label>Product Name</label>
                        <input name="name" type="text" placeholder="e.g. Wireless Mouse" required />
                    </div>
                    
                    <div className="input-group">
                        <label>description</label>
                        <textarea name="description" placeholder="Describe the product..." />
                    </div>
                    
                    <div className="input-group">
                        <label>Quantity</label>
                        <input name="quantity" type="number" placeholder="e.g. 10" min="1" />
                    </div>

                    <div className="input-group">
                        <label>Brand</label>
                        <input name="brand" type="text" placeholder="e.g. Apple"  />
                    </div>
                    
                    <div className="input-group">
                        <label>Price ($)</label>
                        <input name="price" type="number" step="0.01" placeholder="29.99" required />
                    </div>

                    <div className="input-group">
                        <label>Image URL</label>
                        <input name="imageUrl" type="text" placeholder="e.g. https://example.com/image.jpg" defaultValue={"https://picsum.photos/seed/13/400/400"} />
                    </div>

                    <div className="input-group">
                        <label>Category</label>
                        <select name="category">
                            <option value="laptop">Laptop</option>
                            <option value="smartphone">Smartphone</option>
                            <option value="audio">Audio</option>
                            <option value="wearables">Wearables</option>
                            <option value="cameras">Cameras</option>
                        </select>
                    </div>
                    <button type="submit" className="save-btn">Create Product</button>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;