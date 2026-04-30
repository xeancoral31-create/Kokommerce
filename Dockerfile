# ============================================================
# Stage 1: Node.js — Build frontend assets
# ============================================================
FROM node:18-alpine AS node-builder

WORKDIR /app

# Copy package files first for better layer caching
COPY package.json package-lock.json .npmrc ./

# Install all dependencies (including devDeps needed for build)
RUN npm ci --legacy-peer-deps

# Copy source files
COPY resources/ resources/
COPY webpack.mix.js tailwind.config.js tsconfig.json ./
COPY public/ public/

# Build production assets
RUN npm run prod

# ============================================================
# Stage 2: PHP + Composer — Build app
# ============================================================
FROM php:8.2-cli AS php-builder

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git curl zip unzip libpng-dev libonig-dev libxml2-dev \
    libcurl4-openssl-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml ctype fileinfo bcmath zip curl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy composer files first
COPY composer.json composer.lock ./

# Install PHP dependencies (no dev, optimized)
RUN composer install \
    --optimize-autoloader \
    --no-dev \
    --no-interaction \
    --prefer-dist \
    --no-scripts

# Copy full application
COPY . .

# Copy built frontend assets from node-builder
COPY --from=node-builder /app/public/js ./public/js
COPY --from=node-builder /app/public/css ./public/css
COPY --from=node-builder /app/public/mix-manifest.json ./public/mix-manifest.json

# Set proper storage permissions
RUN mkdir -p storage/framework/{sessions,views,cache,testing} \
    storage/logs \
    bootstrap/cache \
    && chmod -R 777 storage bootstrap/cache

# ============================================================
# Stage 3: Final runtime image
# ============================================================
FROM php:8.2-cli AS runtime

# Install only runtime PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo pdo_mysql mbstring xml ctype fileinfo bcmath zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy built app from php-builder
COPY --from=php-builder /app .

# Copy vendor
COPY --from=php-builder /app/vendor ./vendor

# Expose port
EXPOSE 8080

# Run migrations, link storage, then start server
CMD sh -c "php artisan migrate --force && \
           php artisan storage:link --force 2>/dev/null || true && \
           php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"
