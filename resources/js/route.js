/**
 * Buyer Route Configuration
 * Connects the frontend (TSX/JS) with the defined path structure.
 */

export const BUYER_ROUTES = {
    HOME: '/buyer/home',
    SHOP: '/buyer/shop',
    OFFERS: '/buyer/offer',
    HISTORY: '/buyer/history',
    ACCOUNT: '/buyer/account',
    CART: '/buyer/cart',
    DELIVERY: '/buyer/delivery',
    PAYMENT: '/buyer/payment',
};

/**
 * Utility function to check if a route is active.
 * Used in BuyerLayout.tsx and other navigational components.
 */
export const isRouteActive = (currentPath, targetPath) => {
    return currentPath.startsWith(targetPath);
};

// Exporting styling references (SCSS and CSS connection info)
export const BUYER_STYLE_CONTEXT = {
    MAIN: 'resources/sass/buyer.scss',
    COMPILED: 'public/css/app.css',
};
