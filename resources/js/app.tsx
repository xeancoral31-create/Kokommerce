import './bootstrap';
import React from 'react';
import { render } from 'react-dom';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';

InertiaProgress.init({ color: '#eca840' });

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = process.env.MIX_CLERK_PUBLISHABLE_KEY || 'pk_test_d2lzZS1kYXNzaWUtODYuY2xlcmsuYWNjb3VudHMuZGV2JA';

createInertiaApp({
  resolve: (name) => {
    const page = require(`./Pages/${name}`);
    return page.default ? page.default : page;
  },
  setup({ el, App, props }) {
    render(
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App {...props} />
      </ClerkProvider>,
      el
    );
  },
});

