import './bootstrap';

import React from 'react';
import { render } from 'react-dom';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { ClerkProvider } from '@clerk/clerk-react';
import { CartProvider } from './Context/CartContext';
import { WishlistProvider } from './Context/WishlistContext';

/**
 * CONSOLE NOISE SUPPRESSOR
 * This silences third-party errors (YouTube tracking, Extensions) to keep the 
 * developer console clean and focused on actual application logic.
 */
if (typeof window !== 'undefined') {
    const ignoredErrors = [
        'youtube-nocookie.com',
        'TrustedScript',
        'AdGuard',
        'liner-core',
        '[Violation]',
        'React DevTools'
    ];

    const originalError = console.error;
    const originalWarn = console.warn;

    console.error = (...args) => {
        const msg = args[0]?.toString() || '';
        if (ignoredErrors.some(term => msg.includes(term))) return;
        originalError.apply(console, args);
    };

    console.warn = (...args) => {
        const msg = args[0]?.toString() || '';
        if (ignoredErrors.some(term => msg.includes(term))) return;
        originalWarn.apply(console, args);
    };
}

import { ThemeProvider } from './Context/ThemeContext';

InertiaProgress.init({ color: '#eca840' });

const PUBLISHABLE_KEY = process.env.MIX_CLERK_PUBLISHABLE_KEY || 'pk_test_d2lzZS1kYXNzaWUtODYuY2xlcmsuYWNjb3VudHMuZGV2JA';

createInertiaApp({
  resolve: (name) => {
    const page = require(`./Pages/${name}`);
    return page.default ? page.default : page;
  },
  setup({ el, App, props }) {
    render(
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ThemeProvider>
          <WishlistProvider>
              <CartProvider>
                  <App {...props} />
              </CartProvider>
          </WishlistProvider>
        </ThemeProvider>
      </ClerkProvider>,
      el
    );
  },
});
