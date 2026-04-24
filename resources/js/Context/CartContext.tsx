import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
    id: number;
    name: string;
    price: number;
    qty: number;
    img: string;
    tag?: string;
    desc?: string;
}

interface DeliveryDetails {
    address: string;
    landmark: string;
    city: string;
    state: string;
    zip: string;
    receiverName: string;
    contactNumber: string;
    latitude?: number;
    longitude?: number;
}

interface CartContextType {
    cartItems: CartItem[];
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQty: (id: number, delta: number) => void;
    clearCart: () => void;
    cartCount: number;
    deliveryDetails: DeliveryDetails;
    updateDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode, initialItems?: CartItem[] }> = ({ children, initialItems = [] }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
        address: 'EastWest Unibank, North San Francisco Street, Humabon, Poblacion, Butuan, Caraga, 8600',
        landmark: 'EastWest Unibank',
        city: 'Butuan',
        state: 'Caraga',
        zip: '8600',
        receiverName: 'Xean Coral',
        contactNumber: '09272553458'
    });

    // Persistent Artisanal Cart Logic
    useEffect(() => {
        const saved = localStorage.getItem('artisanal_cart');
        if (saved) {
            try {
                setCartItems(JSON.parse(saved));
            } catch (e) {
                console.error("Cart retrieval failed:", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('artisanal_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: item.qty || 1 }];
        });
    };

    const removeFromCart = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => 
            item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
        ));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('artisanal_cart');
    };

    const updateDeliveryDetails = (details: Partial<DeliveryDetails>) => {
        setDeliveryDetails(prev => ({ ...prev, ...details }));
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setItems: setCartItems, 
            addToCart, 
            removeFromCart, 
            updateQty, 
            clearCart, 
            cartCount,
            deliveryDetails,
            updateDeliveryDetails
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
