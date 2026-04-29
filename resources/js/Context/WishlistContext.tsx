import React, { createContext, useContext, useState, useEffect } from 'react';

interface WishlistItem {
    id: number | string;
    name: string;
    price: number;
    img: string;
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    toggleWishlist: (item: WishlistItem) => boolean; // returns true if added, false if removed
    isInWishlist: (id: number | string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('kokommerce_wishlist');
        if (saved) {
            try {
                setWishlistItems(JSON.parse(saved));
            } catch (e) {
                console.error("Failed to parse wishlist", e);
            }
        }
    }, []);

    // Save to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('kokommerce_wishlist', JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    const toggleWishlist = (item: WishlistItem) => {
        const index = wishlistItems.findIndex(i => i.id === item.id);
        const exists = index !== -1;
        
        if (exists) {
            setWishlistItems(prev => prev.filter(i => i.id !== item.id));
            return false;
        } else {
            setWishlistItems(prev => [...prev, item]);
            return true;
        }
    };

    const isInWishlist = (id: number | string) => {
        return wishlistItems.some(item => item.id === id);
    };

    return (
        <WishlistContext.Provider value={{ wishlistItems, toggleWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}; 
