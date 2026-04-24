import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
    return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const { isLoggedIn } = useAuth();

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('orders');
        localStorage.removeItem('cart');
        localStorage.removeItem('ordersCount');
    };

    const addToCart = (product) => {
        setCartItems((prevItems) => [...prevItems, product]);
    };

    const removeFromCart = (index) => {
        setCartItems((prevItems) => prevItems.filter((_, i) => i !== index));
    };

    useEffect(() => {
        // Clear cart on login or logout
        clearCart();
    }, [isLoggedIn]);

    const cartCount = cartItems.length;

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};
