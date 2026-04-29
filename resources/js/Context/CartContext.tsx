import React, { createContext, useContext, useState, useEffect } from 'react';



export interface CartItem {
    id: number | string;
    original_id: number | string;
    name: string;
    price: number;
    solo_price: number;
    package_price: number;
    qty: number;
    img?: string;
    tag?: string;
    desc?: string;
    category?: string;
    priceType?: 'Solo' | 'Package';
    isFixedQty?: boolean;
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

export interface Promotion {
    id: number;
    product_id: number | null;
    code: string;
    type: string;
    discount_value: number;
    title: string;
    end_date: string | null;
    is_used?: boolean;
}

interface CartContextType {
    cartItems: CartItem[];
    setItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number | string) => void;
    updateQty: (id: number | string, delta: number) => void;
    updateVariant: (id: number | string, type: 'Solo' | 'Package') => void;
    clearCart: () => void;
    cartCount: number;
    deliveryDetails: DeliveryDetails;
    updateDeliveryDetails: (details: Partial<DeliveryDetails>) => void;
    appliedVoucher: Promotion | null;
    applyVoucher: (voucher: Promotion) => void;
    removeVoucher: () => void;
    isDetectingLocation: boolean;
    setIsDetectingLocation: (value: boolean) => void;
    wishlistItems: any[];
    toggleWishlist: (product: any) => void;
    isInWishlist: (id: number | string) => boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode, initialItems?: CartItem[] }> = ({ children, initialItems = [] }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
    const [wishlistItems, setWishlistItems] = useState<any[]>([]);
    const [appliedVoucher, setAppliedVoucher] = useState<Promotion | null>(null);
    const [isDetectingLocation, setIsDetectingLocation] = useState(false);
    const [deliveryDetails, setDeliveryDetails] = useState<DeliveryDetails>({
        address: 'Select delivery point on map...',
        landmark: 'Unknown Location',
        city: 'Butuan City',
        state: 'Agusan del Norte',
        zip: '8600',
        receiverName: '',
        contactNumber: ''
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
        
        const savedVoucher = localStorage.getItem('artisanal_voucher');
        if (savedVoucher) {
            try {
                setAppliedVoucher(JSON.parse(savedVoucher));
            } catch (e) {
                console.error("Voucher retrieval failed:", e);
            }
        }

        const savedDelivery = localStorage.getItem('artisanal_delivery');
        if (savedDelivery) {
            try {
                setDeliveryDetails(JSON.parse(savedDelivery));
            } catch (e) {
                console.error("Delivery retrieval failed:", e);
            }
        }

        const savedWishlist = localStorage.getItem('artisanal_wishlist');
        if (savedWishlist) {
            try {
                setWishlistItems(JSON.parse(savedWishlist));
            } catch (e) {
                console.error("Wishlist retrieval failed:", e);
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('artisanal_cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        if (appliedVoucher) {
            localStorage.setItem('artisanal_voucher', JSON.stringify(appliedVoucher));
        } else {
            localStorage.removeItem('artisanal_voucher');
        }
    }, [appliedVoucher]);

    useEffect(() => {
        localStorage.setItem('artisanal_delivery', JSON.stringify(deliveryDetails));
    }, [deliveryDetails]);

    useEffect(() => {
        localStorage.setItem('artisanal_wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const addToCart = (item: CartItem) => {
        setCartItems(prev => {
            const existing = prev.find(i => i.id === item.id);
            if (existing) {
                // If it's a fixed qty item, force it to its fixed qty (4)
                if (item.isFixedQty) return prev.map(i => i.id === item.id ? { ...i, qty: 4 } : i);
                return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
            }
            return [...prev, { ...item, qty: item.isFixedQty ? 4 : (item.qty || 1) }];
        });
    };

    const removeFromCart = (id: number | string) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQty = (id: number | string, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                if (item.isFixedQty) {
                    // Force minimum of 4 and allow increments of 4 for artisanal batches
                    const newQty = Math.max(4, item.qty + (delta * 4));
                    return { ...item, qty: newQty };
                }
                return { ...item, qty: Math.max(1, item.qty + delta) };
            }
            return item;
        }));
    };

    const updateVariant = (id: number | string, type: 'Solo' | 'Package') => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newPrice = type === 'Solo' ? item.solo_price : item.package_price;
                const newId = item.original_id + (type === 'Package' ? '_pkg' : '_solo');
                
                // For solo items priced 5-15, enforce fixed qty 4 (Artisanal Batch Rule)
                const isSoloFixed4 = type === 'Solo' && item.solo_price >= 5 && item.solo_price <= 15;

                return { 
                    ...item, 
                    id: newId, 
                    priceType: type, 
                    price: newPrice, 
                    isFixedQty: isSoloFixed4,
                    qty: isSoloFixed4 ? Math.max(4, item.qty) : item.qty
                };
            }
            return item;
        }));
    };

    const clearCart = () => {
        setCartItems([]);
        setAppliedVoucher(null);
        localStorage.removeItem('artisanal_cart');
        localStorage.removeItem('artisanal_voucher');
    };

    const applyVoucher = (voucher: Promotion) => {
        setAppliedVoucher(voucher);
    };

    const removeVoucher = () => {
        setAppliedVoucher(null);
    };

    const updateDeliveryDetails = (details: Partial<DeliveryDetails>) => {
        setDeliveryDetails(prev => ({ ...prev, ...details }));
    };

    const toggleWishlist = (product: any) => {
        setWishlistItems(prev => {
            const exists = prev.find(p => p.id === product.id);
            if (exists) {
                return prev.filter(p => p.id !== product.id);
            }
            return [...prev, product];
        });
    };

    const isInWishlist = (id: number | string) => {
        return wishlistItems.some(p => p.id === id);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider value={{ 
            cartItems, 
            setItems: setCartItems, 
            addToCart, 
            removeFromCart, 
            updateQty, 
            updateVariant,
            clearCart, 
            cartCount,
            deliveryDetails,
            updateDeliveryDetails,
            appliedVoucher,
            applyVoucher,
            removeVoucher,
            isDetectingLocation,
            setIsDetectingLocation,
            wishlistItems,
            toggleWishlist,
            isInWishlist
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
